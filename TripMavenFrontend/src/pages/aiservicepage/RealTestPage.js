import React, { useState, useRef, useEffect, useContext } from 'react';
import Webcam from 'react-webcam';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Container, MenuItem, Select, Typography } from '@mui/material';
import styles from '../../styles/aiservicepage/RealTestPage.module.css';
import { createEvaluation } from '../../utils/AiData';
import { evaluateVoiceAndText, videoFace } from '../../utils/PythonServerAPI';
import { TemplateContext } from '../../context/TemplateContext';
import FaceDetection from '../../components/FaceDetection';
import { filesPost } from '../../utils/fileData';


const RealTestPage = () => {
  const memberId = localStorage.getItem('membersId');
  const { memberInfo } = useContext(TemplateContext);
  const productboardId = useParams().id;
  const navigate = useNavigate();

  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [isVideoConnected, setIsVideoConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingStatus, setRecordingStatus] = useState("녹화하기");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loadingMessage, setLoadingMessage] = useState("");

  const [responses, setResponses] = useState([]); // 감정 분석 결과 저장

  const webcamRef = useRef(null);
  const videoBlob = useRef(null);
  const videoChunks = useRef([]);
  const videoRecorderRef = useRef(null);
  const audioBlob = useRef(null);
  const audioChunks = useRef([]);
  const audioRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);  // 녹화 상태 관리
  const [isRecordingSuccess, setIsRecordingSuccess] = useState(false);  // 녹화 성공 했냐?
  const [isAnalysisSuccess, setIsAnalysisSuccess] = useState("none");  //분석 성공했나?
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);  //저장 성공했나?
  const [tempResponse, setTempResponse] = useState(null);  //응답 데이터 임시 저장용 객체

  const accumulatedTranscriptRef = useRef(''); // 모든 최종 자막을 저장하는 참조
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);  //타이머
  const timeoutRef = useRef(null);  // 타임아웃을 관리하는 ref
  const ResultIdRef = useRef(''); 
  
  const questions = [
    "Q: 여행을 하는 중에 컴플레인이 들어 왔을 경우 어떻게 해결을 해야 할까요?",
    "Q: 투어 중 한 관광객이 갑자기 화장실을 급히 가고 싶다고 말합니다. 어떻게 안내하실 건가요?",
    "Q: 관광객 중 한 명이 예상치 못하게 길에서 화장실을 찾기 어렵다고 말하며 도움을 요청합니다. 이럴 때 어떻게 대처하시겠어요?",
    "Q: 여행 도중 관광지가 화장실이 멀리 떨어져 있어 시간이 걸릴 것 같다고 말하는 관광객이 있습니다. 이런 경우 어떻게 응대하시겠습니까?"
  ];

  const firstQuestion = "본인의 여행 상품에 대해 1분안에 말하시오";

  useEffect(() => {
    // 장치 목록 가져오기
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        const audioInputs = devices.filter((d) => d.kind === 'audioinput');

        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
        setSelectedVideoDevice(videoInputs[0] || null);
        setSelectedAudioDevice(audioInputs[0] || null);
        setIsVideoConnected(videoInputs.length > 0);
      })
      .catch((error) => console.error('장치 정보를 가져오는 중 에러 발생:', error));
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  //녹화, 녹음 설정 및 시작하는 함수
  const startRecording = () => {
    setIsRecordingSuccess(false);
    navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: selectedAudioDevice?.deviceId,
        sampleRate: 16000,
      },
      video: true
    }).then((stream) => {
      if (webcamRef.current) webcamRef.current.srcObject = stream;

      //비디오 녹화
      videoRecorderRef.current = new MediaRecorder(stream);
      videoRecorderRef.current.ondataavailable = (event) => {
        videoChunks.current.push(event.data);
      };

      videoRecorderRef.current.onstop = () => {
        const blob = new Blob(videoChunks.current, { type: 'video/mp4' });
        console.log('비디오 블롭:', blob);
        videoBlob.current = blob;
        videoChunks.current = [];

        if (intervalRef.current) {
          clearInterval(intervalRef.current);  // 타이머 중지
        }
      };

      //비디오 녹화시작
      setTimeLeft(60);
      videoRecorderRef.current.start();

      // 오디오 녹화
      const audioStream = new MediaStream(stream.getAudioTracks());
      audioRecorderRef.current = new MediaRecorder(audioStream, { mimeType: 'audio/webm;codecs=opus' });
      audioRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      audioRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        console.log('오디오 블롭:', blob);
        audioBlob.current = blob;
        audioChunks.current = [];
      };

      audioRecorderRef.current.start();
      setIsRecording(true);

      // 1초마다 녹화 시간 업데이트
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));  // 0 이하로 내려가지 않도록 설정
      }, 1000);  // 1초마다 호출

      // 60초 후 자동 종료 타이머 설정
      timeoutRef.current = setTimeout(() => {
        stopRecording();  // 60초 후 자동으로 녹화를 중지
      }, 60000);
    }).catch((error) => console.error('Error accessing microphone:', error));
  };

  // 녹화 수동 중지 함수
  const stopRecording = () => {
    if (!isRecording) return;  // 이미 녹화가 중지된 상태면 중지하지 않음

    // 비디오 및 오디오 녹화 중지
    videoRecorderRef.current?.stop();
    audioRecorderRef.current?.stop();

    // 타이머 정리
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);  // 자동 종료 타이머 제거
      timeoutRef.current = null;
    }

    // 타이머 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);  // 1초마다 시간 업데이트 타이머 정리
      intervalRef.current = null;
    }

    setIsRecording(false);  // 녹화 상태를 중지로 설정
    setIsRecordingSuccess(true);
  };

  const handleButtonClick = async () => {
    if (recordingStatus === "녹화하기" || recordingStatus === "다시 녹화하기") {
      accumulatedTranscriptRef.current = ''; // 누적된 자막 초기화
      setIsAnalysisSuccess("none");
      startSpeechRecognition(); //음성인식 시작
      startRecording(); //녹화, 녹음 시작
      setRecordingStatus("녹화 중지"); //버튼 문구 바꾸기
    } else if (recordingStatus === "녹화 중지") {
      recognitionRef.current.stop();
      stopRecording();
      setRecordingStatus("평가 요청하기");
    } else if (recordingStatus === "평가 요청하기" || recordingStatus === "다시 요청하기") {
      setLoadingMessage("영상 전송 중");
      if (isFirstQuestion) {
        setRecordingStatus("다음 문제");
      } else {
        setRecordingStatus("결과 보기");
      }
      await uploadVideo(isFirstQuestion ? 'first' : 'second');
    } else if (recordingStatus === "다음 문제") {
      setIsFirstQuestion(false);
      setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));
      setTranscript("");
      setRecordingStatus("녹화하기");
      setLoadingMessage("");
    } else if (recordingStatus === "결과 보기") {
      navigate(`/resultFinalPage/${productboardId}`);
    }
  };

  //음성인식
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition; // ref로 인스턴스 참조
    recognition.lang = 'ko-KR'; // 한국어 설정
    recognition.interimResults = true; // 중간 결과를 활성화
    recognition.continuous = true; // 음성 인식을 10초 동안 강제로 유지

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      console.log("event",event)
      for (let i = 0; i < event.results.length; i++) {
        // 중간 결과를 처리
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.trim() + ' ';
        } else {
          interimTranscript += event.results[i][0].transcript.trim() + ' ';
        }
      }

      // 최종 자막을 누적 및 업데이트
      if (finalTranscript) {
        accumulatedTranscriptRef.current += finalTranscript;
        setTranscript(accumulatedTranscriptRef.current.trim());
      }

      // 실시간으로 중간 결과 업데이트
      if (interimTranscript) {
        setTranscript(accumulatedTranscriptRef.current + interimTranscript);
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      recognition.stop();
    };

    recognitionRef.current.start();
    setTranscript(''); // 음성 인식 시작 시 트랜스크립트 초기화

    // 60초 후 음성 인식 종료
    setTimeout(() => {
      recognition.stop();
    }, 60000); // 10000ms = 10초
  };

  //녹화, 녹음 분석 함수
  const anaysis = async (formDataForVideo, formDataForAudio)=>{
    const videoResponse = await videoFace(formDataForVideo);
    const audioResponse = await evaluateVoiceAndText(formDataForAudio);
    if (videoResponse.success && audioResponse.success) {
      setIsAnalysisSuccess("success");
      return {videoResponse, audioResponse};
    }
    else {
      setIsAnalysisSuccess("fail");
      setRecordingStatus("다시 녹화하기");
    }
  };


  //녹화, 녹음 파일 파이썬 서버에 보내기 + 결과 받아서 데이터베이스에 저장하기
  const uploadVideo = async (videoType) => {
    if(isAnalysisSuccess === "fail") setLoadingMessage("영상 전송 중");
    //비디오 녹화 파일
    const videoFile = new File([videoBlob.current], 'recordedVideo.mp4', { type: 'video/mp4' });
    console.log('비디오 파일:', videoFile);
    const formDataForVideo = new FormData();
    formDataForVideo.append('file', videoFile);

    //오디오 녹화 파일
    const audioFile = new File([audioBlob.current], 'audio222.webm', { type: 'audio/webm' });
    console.log('오디오 파일:', audioFile);
    const formDataForAudio = new FormData();
    formDataForAudio.append('voice', audioFile);
    formDataForAudio.append('text', transcript); //정답 텍스트를 테스트 하는 사람이 입력해줘야함
    formDataForAudio.append('gender', memberInfo.gender == 'male' ? '0' : '1'); //사용자 성별
    formDataForAudio.append('isVoiceTest', '0'); //영상테스트시 0으로, 발음테스트시 1로 하면 됨

    /* 음성 다운 
    console.log(audioBlob.current);
    const url = window.URL.createObjectURL(audioBlob.current);
    // a 태그를 생성하여 다운로드 실행
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'audio2.webm'; // 다운로드할 파일명 설정
    document.body.appendChild(a);
    a.click(); // 클릭 이벤트 실행 (다운로드 시작)
    // 다운로드 후 태그와 URL 해제
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // 메모리 해제
    */
    let videoResponse = null; 
    let audioResponse = null;
    if(isAnalysisSuccess!=="success"){ //분석 성공하고 응답받았을때 다시 디비 저장 요청시 스킵할거임
      try{
        const data = await anaysis(formDataForVideo, formDataForAudio);
        setTempResponse(data);
        console.log(data); //잘 나오고
        videoResponse=data.videoResponse.data;
        audioResponse=data.audioResponse.data;
        setIsAnalysisSuccess("success");
      }
      catch (error){
        console.error('영상 분석 중 에러 발생:', error)
      }
    }

    try {
      if ((videoResponse && audioResponse) || tempResponse) { //분석 성공하고 임시 저장 객체 있을시 실행
        const resultVideoData = videoResponse ? videoResponse : tempResponse.videoResponse.data ; //영상 분석 결과
        console.log('resultVideoData:', resultVideoData);
        const resultAudioData = audioResponse ? audioResponse : tempResponse.audioResponse.data; //음성 분석 결과
        console.log('resultAudioData:', resultAudioData);

  
        //동영상 파일 서버에 저장 
        const formData = new FormData();
        formData.append('files', videoFile);
        const response = await filesPost(formData);
        
        console.log('response:', response);

        const keywords= resultVideoData.expression_keywords; // + 음성 키워드 추가하셈
        console.log('keywords',keywords);

        // 점수 계산
      let scoreData = 0;

      // 1. 음성 주파수 (110 ~ 130 Hz 사이면 25점)
      const voiceTone = resultAudioData.voice_tone.voice_check;
      if (voiceTone >= 110 && voiceTone <= 130) {
        scoreData += 25;
      }

      // 2. 눈 깜박임 (10 ~ 30회 사이면 25점)
      const eyeBlinks = resultVideoData.eye.average_blinks;
      if (eyeBlinks >= 10 && eyeBlinks <= 30) {
        scoreData += 25;
      }

      // 3. 음성 속도 분석 (240 ~ 300 WPM이면 25점)
      const speechSpeed = resultAudioData.speed_result.phonemes_per_min;
      if (speechSpeed >= 240 && speechSpeed <= 300) {
        scoreData += 25;
      }

      // 4. 발음 정확도 (50 ~ 80%이면 15점, 80% 이상이면 25점)
      const pronunciationAccuracy = resultAudioData.pronunciation_precision.pronunciation_accuracy;
      if (pronunciationAccuracy >= 50 && pronunciationAccuracy < 80) {
        scoreData += 15;
      } else if (pronunciationAccuracy >= 80) {
        scoreData += 25;
      }

      console.log('Final Score:', scoreData);


        //디비에 저장하기
        const evaluationResponse = await createEvaluation({
         // score: 50,
          score: scoreData,
          fillerwords: resultAudioData.text_analysis.fillerwords,
          fillerweights:  resultAudioData.text_analysis.fillerweights,
          formal_speak: resultAudioData.text_analysis.speak_end.formal_speak,
          question_speak: resultAudioData.text_analysis.speak_end.question_speak,
          text: resultAudioData.text_analysis.text,
          weight: resultAudioData.text_analysis.weight,

          voice_graph: resultAudioData.voice_tone.voice,
          tone_mean: resultAudioData.voice_tone.voice_mean,
          tone: resultAudioData.voice_tone.voice_check,
          speed: resultAudioData.speed_result.phonemes_per_min,
          pronunciation: resultAudioData.pronunciation_precision.pronunciation_accuracy,
          total_time: resultAudioData.speed_result.total_spoken_time,


          cheek: resultVideoData.graphs.cheekbones_graph,
          mouth: resultVideoData.graphs.mouth_graph,
          brow: resultVideoData.graphs.brow_graph,
          eye: resultVideoData.eye.average_blinks,
          nasolabial: resultVideoData.graphs.nasolabial_folds_graph,
          commentEye: resultVideoData.eye.comment,
          commentsFace: resultVideoData.expression_comment,
          group_id: ResultIdRef.current == ''?"0":ResultIdRef.current,
          filename: videoFile.name
        }, memberId, productboardId ,keywords);


        ResultIdRef.current = evaluationResponse.data.id;
        console.log('evaluationResponse:', evaluationResponse);
        setLoadingMessage(""); // 모달 메시지 제거

        // 두 개의 결과를 배열로 전달
        const previousResult = localStorage.getItem("previousResult")
          ? JSON.parse(localStorage.getItem("previousResult"))
          : [];

        const allResults = [...previousResult, resultVideoData]; // 결과를 배열에 추가

        localStorage.setItem("previousResult", JSON.stringify(allResults)); // 두 번째 결과 저장
        console.log('allResults: ', allResults);

        if (videoType === 'second') {
          alert('영상이 성공적으로 제출되었습니다!');
          navigate(`/resultFinalPage/${evaluationResponse.data.id}`, {
            state: {
              responses: allResults, // 두 개의 결과를 배열로 전달
              videoUrls: [
                URL.createObjectURL(videoBlob.current),
                ...previousResult.map(() => URL.createObjectURL(videoBlob.current))
              ],
              videoDuration: timeLeft
            }
          });
        }
      } else {
        setLoadingMessage("");
        alert('영상 제출 중 문제가 발생했습니다.');
      }
    } catch (error) {
      setLoadingMessage("");
      setRecordingStatus("다시 요청하기");
      console.error('영상 제출 중 에러 발생:', error);
      alert('영상 제출 중 에러가 발생했습니다.');
    }
  };

  // 입력 변경 핸들러
  const handleChange = (e) => {
    setTranscript(e.target.value);
  };


  return (
    <Container className={styles.container}>
      <h1>실전 테스트</h1>
      <p>{isFirstQuestion ? firstQuestion : questions[currentQuestionIndex]}</p>
      <p>{isFirstQuestion && `남은 시간: ${timeLeft}초`}</p>
      <div className={styles.testContainer}>
        <div className={styles.videoBox}>
          {isVideoConnected ? (
            <>
              <Webcam ref={webcamRef} audio={true} style={{ width: '100%', height: '100%', display: 'block' }} />
              {/*    <FaceDetection webcamRef={webcamRef} setResponses={setResponses} responses={responses} />  FaceDetection 사용 */}
            </>
          ) : (
            <Typography variant="body2" color="error" align="center">
              * 웹캠이 연결되지 않았습니다.
            </Typography>
          )}
        </div>
        <div className={styles.textBox}>
          <textarea
            className="form-control"
            value={transcript}
            onChange={handleChange}
            placeholder=" 여기에 자막이 표시됩니다. 
                      오타 났거나 말하는 것과 일치하지 않은 경우 내용을 수정해주세요."
            rows="5"

          />
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.selectContainer}>
          <Select
            value={selectedVideoDevice?.deviceId || ''}
            displayEmpty
            onChange={(e) => setSelectedVideoDevice(videoDevices.find((d) => d.deviceId === e.target.value))}
            className={styles.selectControl}
          >
            <MenuItem value="">웹캠을 선택하세요</MenuItem>
            {videoDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedAudioDevice?.deviceId || ''}
            displayEmpty
            onChange={(e) => setSelectedAudioDevice(audioDevices.find((d) => d.deviceId === e.target.value))}
            className={styles.selectControl}
          >
            <MenuItem value="">마이크를 선택하세요</MenuItem>
            {audioDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <Button variant="contained" color="primary" onClick={handleButtonClick} className={styles.controlButton}>
            {/*!isRecordingSuccess ? recordingStatus : !isAnalysisSuccess ? '다시 녹화하기' : recordingStatus*/}
            {recordingStatus}
          </Button>
  
          {(isRecordingSuccess && isAnalysisSuccess==="fail") &&
            <Button style={{marginLeft:'30px'}} variant="contained" color="primary" onClick={() => uploadVideo(isFirstQuestion ? 'first' : 'second')} className={styles.controlButton}>
              {"평가 요청하기"} 
            </Button>
          }
        </div>
        
        {/*
        <Button variant="contained" color="primary" onClick={uploadVideo} className={styles.controlButton                                                                                                                                                                                                                                                               }>
          {'보내기'}
        </Button>
         */}
      </div>

      {loadingMessage && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <Typography variant="h6">{loadingMessage}</Typography>
          </div>
        </div>
      )}
    </Container>
  );
};

export default RealTestPage;
