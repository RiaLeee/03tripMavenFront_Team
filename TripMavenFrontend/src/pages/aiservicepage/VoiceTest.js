import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, Container, Grid, MenuItem, Select, Typography, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import { PronunContext } from '../../context/PronunContext';
import { evaluatePronunciation, videoFace } from '../../utils/PythonServerAPI';
import Webcam from 'react-webcam';

const PronunciationTest = () => {
  const timerRef = useRef(null); // 타이머 인스턴스 참조
  const [transcript, setTranscript] = useState(''); // 자막 상태
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [timer, setTimer] = useState(10); // 10초 타이머 초기값
  const [testMessage, setTestMessage] = useState(''); // 테스트 메시지 상태
  const [isRecognitionDone, setIsRecognitionDone] = useState(false); // 음성 인식 완료 여부
  const recognitionRef = useRef(null); // SpeechRecognition 인스턴스 참조
  const lastFinalTranscriptRef = useRef(''); // 마지막으로 인식된 최종 자막을 저장
  const accumulatedTranscriptRef = useRef(''); // 모든 최종 자막을 저장하는 참조
  const mediaRecorderRef = useRef(null);
  const webcamRef = useRef(null);
  const videoChunks = useRef([]);
  const [videoBlob, setVideoBlob] = useState(null); // 녹음된 오디오 데이터를 저장
  const [isVideoConnected, setIsVideoConnected] = useState(false); // 웹캠 연결 상태
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [isRecording, setIsRecording] = useState(false);


  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        //모든 장비 가져오기
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        const audioInputs = devices.filter((d) => d.kind === 'audioinput');

        //모든 명단 스테이트로 저장
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);

        //첫번째 장비 선택하기
        setSelectedVideoDevice(videoInputs[0] || null);
        setSelectedAudioDevice(audioInputs[0] || null);

        //연결됐는지 여부
        setIsVideoConnected(videoInputs.length > 0);
      })
      .catch((error) => {
        console.error('Error getting device information:', error);
      });
  }, []);

  const handleStartRecording = () => {
    if (isRecording) { // 마이크가 활성화된 경우 음성 기록 중지
      recognitionRef.current.stop(); // 음성 인식 중지
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop(); // 실제 녹음 중지
      }
      setIsRecording(false);
      clearInterval(timerRef.current); // 타이머 중지
      setIsAudioPlaying(false); // 음성 중지 상태로 전환
      setTestMessage('음성 기록이 중단되었습니다.'); // 중단 메시지 표시

    }
    else {
      setTranscript(''); // 자막 초기화
      setTimer(10); // 타이머 초기화
      setTestMessage(''); // 이전 테스트 메시지 초기화
      setIsRecognitionDone(false); // 음성 인식 완료 상태 초기화
      lastFinalTranscriptRef.current = ''; // 마지막 최종 자막 초기화
      accumulatedTranscriptRef.current = ''; // 누적된 자막 초기화    

      navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: selectedAudioDevice?.deviceId,
          sampleRate: 16000,  // 16kHz 샘플레이트
        },
        video: true
      })
        .then(stream => {
          if (webcamRef.current) {
            webcamRef.current.srcObject = stream; // 웹캠 비디오 스트림 연결
          }

          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = (event) => {
            videoChunks.current.push(event.data);
          };

          mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(videoChunks.current, { type: 'video/mp4' });
            setVideoBlob(blob); // 비디오 데이터를 Blob으로 저장
            console.log('오디오 멈춤, 블롭:', blob);
            videoChunks.current = []; // 저장 후 초기화
            setIsRecognitionDone(true);
          };

          mediaRecorderRef.current.start();
          setIsRecording(true);
          setTestMessage('녹음이 시작되었습니다.');
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
        });

      setIsAudioPlaying(true);
      startSpeechRecognition(); // 음성 인식 시작
      startTimer(); // 타이머 시작
    }
  };

  //블롭 객체를 파일로 변환
  const convertBlobToFile = (blob, fileName) => {
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  // 오디오 서버로 전송
  const handleSendAudio = async () => {
    if (!videoBlob) {
      alert('녹음된 파일이 없습니다.');
      return;
    }
    console.log(videoBlob);
    const file = convertBlobToFile(videoBlob, 'video.mp4');
    console.log('녹음 파일:', file);

    const formData = new FormData();
    formData.append('file', file); // 비디오 데이터를 FormData에 추가


    /*
    const url = window.URL.createObjectURL(file);
    // a 태그를 생성하여 다운로드 실행
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'video.mp4'; // 다운로드할 파일명 설정
    document.body.appendChild(a);
    a.click(); // 클릭 이벤트 실행 (다운로드 시작)
    // 다운로드 후 태그와 URL 해제
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // 메모리 해제
    */

    // 서버로 Axios를 사용하여 전송
    const response = await videoFace(formData);
    console.log(response);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition; // ref로 인스턴스 참조
    recognition.lang = 'ko-KR'; // 한국어 설정
    recognition.interimResults = false; // 중간 결과를 무시
    recognition.continuous = true; // 음성 인식을 10초 동안 강제로 유지

    recognition.onresult = (event) => {
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript.trim();
          // 중복된 최종 결과가 없는 경우만 추가
          if (!accumulatedTranscriptRef.current.includes(finalTranscript)) {
            accumulatedTranscriptRef.current += ' ' + finalTranscript; // 최종 결과를 누적
            setTranscript(accumulatedTranscriptRef.current.trim()); // 자막 업데이트
          }
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      recognition.stop();
    };

    recognition.onend = () => {
      // 음성 인식이 자동으로 종료되지 않도록 빈 onend 핸들러
    };

    recognition.start();

    // 10초 후 음성 인식 종료
    setTimeout(() => {
      recognition.stop();
      setIsAudioPlaying(false); // 음성 인식 중이 아님
      setIsRecognitionDone(true); // 음성 인식이 완료됨
    }, 10000); // 10000ms = 10초
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current); // 타이머 종료
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000); // 1초마다 타이머 감소
  };

  useEffect(() => {
    // 컴포넌트가 언마운트되면 타이머를 정리합니다.
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);



  return (
    <Container sx={{ mt: '20px', width: '1100px' }}>

      <Typography variant="h4" gutterBottom align="left" sx={{ mt: '120px', fontWeight: 'bold' }}>
        발음 테스트
      </Typography>
      <img src="../../images/WebTestPageLine.png" alt="Line Image" />
      <Typography variant="h5" gutterBottom align="center" sx={{ mt: '13px', mb: '13px' }}>
        버튼을 누르고 아래에 있는 문장을 읽으세요
      </Typography>
      <Grid container>
        <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <Box
            sx={{
              width: '500px', height: 370,
              bgcolor: '#F8F8F8', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid #000000', borderRadius: '5px',
              flexDirection: 'column', textAlign: 'center',
              position: 'relative'
            }}
          >
            {transcript && isRecognitionDone ? (
              // 음성 인식이 끝났고 자막이 있을 때 자막 유지
              <>
                <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>
                  {transcript} {/* 음성 인식 결과 표시 */}
                </Typography>
              </>
            ) : (
              isVideoConnected ? (
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              ) : (
                <>
                  <img
                    src='../../images/speakIcon.png'
                    alt='speak Icon'
                    style={{
                      top: '40px',
                      left: '40px'
                    }}
                  />
                  <Box sx={{ mt: 4, fontSize: '20px' }}>
                    {''}
                  </Box>
                </>
              )
            )}

          </Box>
        </Grid>
      </Grid>
      {/* 마이크 인식 여부에 따른 상태 메시지 표시 */}
      <Typography variant="body2" fontSize="1.2em" color={isAudioPlaying ? 'success.main' : 'error'} align="center" sx={{ mt: 4 }}>
        {isAudioPlaying ? '마이크 작동 중' : '*마이크 인식이 되지 않습니다.'}
      </Typography>
      <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={handleStartRecording} >
            <img
              src='../../images/micIcon.png'
              style={{ width: '50px', height: '50px', cursor: 'pointer' }}
              alt="MicIcon"
            />
          </IconButton>
        </Box>
      </Grid>

      <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
        <Grid item sx={{ width: '400px' }}>
          <Select
            value={selectedVideoDevice?.deviceId || ''}
            displayEmpty
            onChange={(e) => setSelectedVideoDevice(videoDevices.find((d) => d.deviceId === e.target.value))}
            sx={{ width: '400px' }}
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
            sx={{ width: '400px' }}
          >
            <MenuItem value="">마이크를 선택하세요</MenuItem>
            {audioDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      {testMessage && (
        <Typography fontSize="1.5em" align="center" variant="body2" color="error" sx={{ mt: 2 }}>
          <span dangerouslySetInnerHTML={{ __html: testMessage }} /> {/* 테스트 메시지 출력 */}
        </Typography>
      )}
      <Stack display="flex" justifyContent="center" direction="row" spacing={3} sx={{ mt: '25px' }}>

        <Button variant="contained" sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }} onClick={handleSendAudio}>
          {'보내기'}
        </Button>
      </Stack>
    </Container >
  );
};

export default PronunciationTest;
