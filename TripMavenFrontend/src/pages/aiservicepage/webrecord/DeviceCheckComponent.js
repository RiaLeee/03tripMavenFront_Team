import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Container, Grid, MenuItem, Select, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

const DeviceCheckComponent = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [transcript, setTranscript] = useState(""); 
  const [isWebcamConnected, setIsWebcamConnected] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false); 
  const [isMicWorking, setIsMicWorking] = useState(false);
  const [timer, setTimer] = useState(10);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [isTestPassed, setIsTestPassed] = useState(false); 
  const [warningMessage, setWarningMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); // 테스트 통과 메시지 저장
  const [failureReason, setFailureReason] = useState(""); // 실패 원인 저장
  const [testButtonWarning, setTestButtonWarning] = useState(""); // 실전 테스트 버튼 클릭 시 경고 메시지
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); // 모달 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 저장

  let audioContext, analyser, microphone;

  
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
        setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
        const selectedCam = devices.find((d) => d.kind === 'videoinput');
        setSelectedVideoDevice(selectedCam);
        setSelectedAudioDevice(devices.find((d) => d.kind === 'audioinput'));
        
        if (selectedCam) {
          setIsWebcamConnected(true);
        } else {
          setIsWebcamConnected(false);
        }
      })
      .catch((error) => {
        console.error('Error getting device information:', error);
        setIsWebcamConnected(false);
      });
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log('권한 요청 성공');
        navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
            setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));

            if (devices.find((d) => d.kind === 'videoinput').length > 0)
              setSelectedVideoDevice(devices.find((d) => d.kind === 'videoinput')[0]);
            if (devices.find((d) => d.kind === 'audioinput').length > 0)
              setSelectedAudioDevice(devices.find((d) => d.kind === 'audioinput')[0]);
          })
          .catch((error) => {
            console.error('Error getting device information:', error);
          });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    };
    loadModels();
  }, []);

  const handleStartRecording = () => {
    // 실패 메시지와 원인 초기화
    setWarningMessage("");
    setFailureReason("");
    setSuccessMessage(""); // 테스트 통과 메시지 초기화
    setTestButtonWarning(""); // 실전 테스트 버튼 경고 초기화
    
    setIsTestStarted(true);
    setIsRecording(true);
    setTimer(10);
    setIsTestComplete(false);
    setIsTestPassed(false);

    navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedVideoDevice?.deviceId },
      audio: { deviceId: selectedAudioDevice?.deviceId }
    })
    .then((stream) => {
        webcamRef.current.srcObject = stream;

        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // 마이크 감도 확인 (볼륨 값 로그 출력)
        const checkMicActivity = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
         // console.log(`마이크 볼륨: ${volume}`); // 볼륨 로그로 확인

          // 볼륨 값 기준을 조정하여 인식 감도 향상
          if (volume > 5) { // 기존 10에서 5로 감도 하향 조정
            setIsMicWorking(true); // 마이크가 소리를 감지
          } else {
            setIsMicWorking(false); // 마이크가 소리를 감지하지 않음
          }
        };

        const micInterval = setInterval(checkMicActivity, 100);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          const transcriptArray = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(transcriptArray);
        };
        recognition.onerror = (event) => {
          console.error('Speech recognition error detected: ' + event.error);
        };
        recognition.start();

        webcamRef.current.video.addEventListener('canplay', () => {
          const video = webcamRef.current.video;
          const canvas = canvasRef.current;

          // 캔버스 크기 설정 (비디오의 크기에 맞춤)
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          } else {
            console.error('비디오 크기가 올바르지 않습니다.');
          }

          // 비디오가 제대로 로드된 후에만 drawImage를 호출
          const drawImage = () => {
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
          };

          // 주기적으로 비디오를 캔버스에 그리기 (얼굴 인식 및 테스트 로직 수행)
          const drawInterval = setInterval(drawImage, 100);
        });

        const stopStream = () => {
          const videoTracks = stream.getVideoTracks();
          videoTracks.forEach((track) => track.stop());
          setIsTestComplete(true);
          setIsRecording(false);
          recognition.stop();
          clearInterval(micInterval);

          const normalizedTranscript = transcript.replace(/[\s.]/g, ""); 
          let failureMessage = "";

          // 마이크 감도가 충분히 높을 때만 성공으로 간주
          if (!isMicWorking) {
            failureMessage = "마이크 장치 연결이 끊겼습니다.";
          } else if (!isWebcamConnected) {
            failureMessage = "웹캠 장치 연결이 끊겼습니다.";
          } else if (!normalizedTranscript.includes("안녕하세요만나서반갑습니다")) {
            failureMessage = "발음 인식이 잘 되지 않았습니다.";
          }

          if (failureMessage) {
            setIsTestPassed(false);
            setWarningMessage("장치 테스트를 통과하지 못했습니다. 다시 시도해주세요.");
            setFailureReason(`원인: ${failureMessage}`);
          } else {
            setIsTestPassed(true);
            setSuccessMessage("장치 테스트에 통과했습니다!"); // 성공 메시지 설정
            setWarningMessage(""); 
            setFailureReason(""); 
          }
        };

        const timerInterval = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer <= 1) {
              clearInterval(timerInterval);
              stopStream();
            }
            return prevTimer - 1;
          });
        }, 1000);
    })
    .catch((error) => {
      console.error('Error getting user media:', error);
    });
  };

  const detectFace = async () => {
    const video = webcamRef.current.video;

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());

      if (detections.length === 0) {
        setIsFaceDetected(false);
      } else {
        setIsFaceDetected(true);
      }
    }, 100);
  };

  const handleTestButtonClick = () => {
    // if (!isTestPassed) {
    //   setTestButtonWarning("장치 테스트 통과 후 눌러주세요.");
    // } else {
      navigate('/productComponent'); // 실전 테스트 페이지로 이동
    //}
  };

  return (
    <Container sx={{ mt: '20px', width: '1100px' }}>
      <Typography variant="h4" gutterBottom align="left" sx={{ mt: '120px', fontWeight: 'bold' }}>
        장비 테스트
      </Typography>
      <img src="../../images/WebTestPageLine.png" alt="Line Image" />
      <Typography variant="h5" gutterBottom align="center" sx={{ mt: '20px', mb: '20px' }}>
        지금부터 웹캠/마이크체크를 시작하겠습니다.
        [웹캠/마이크체크] 버튼을 누르고 가이드 선 안에 얼굴을 위치시켜
        10초 이내에 “안녕하세요! 만나서 반갑습니다.”를 소리 내어 읽어주세요.
      </Typography>
      <Grid container>
        <Grid item xs={5.4} sx={{ ml: '50px' }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%', 
              height: 360,
              bgcolor: '#F8F8F8', 
              display: 'flex',
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid #000000', 
              borderRadius: '5px',
              flexDirection: 'column', 
              textAlign: 'center'
            }}
          >
            {isTestStarted ? (
              <>
                <Webcam
                  ref={webcamRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
                <canvas
                  ref={canvasRef}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </>
            ) : (
              <>
                <img src='../../images/webcamImg.png' style={{ width: '180px', height: '180px' }} alt="WebCam" />
                <Box sx={{ mt: 4 }}>
                  웹캠이 정상적으로 설치/연결되었는지 확인해주세요.
                </Box>
              </>
            )}
          </Box>
        </Grid>

        <Grid item xs={5.4} sx={{ ml: '50px' }}>
          <Box
            sx={{
              width: '100%', height: 360,
              bgcolor: '#F8F8F8', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid #000000', borderRadius: '5px',
              flexDirection: 'column', textAlign: 'center',
              padding: '10px',
              overflowY: 'auto'
            }}
          >
            {isTestStarted ? (
              transcript || "여기에 음성 인식 결과가 표시됩니다."
            ) : (
              <>
                <img src='../../images/micImg.png' style={{ width: '180px', height: '180px' }} alt="Mic" />
                <Box sx={{ mt: 4 }}>
                  마이크 상태를 사전에 확인해주세요.<br />
                  (이어폰에 있는 마이크도 사용 가능합니다.)
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="left" alignItems="center" sx={{ mt: 2, ml: '53px' }}>
        <Grid item>
          <Select
            value={selectedVideoDevice?.deviceId || ''}
            displayEmpty
            onChange={(e) => setSelectedVideoDevice(videoDevices.find((d) => d.deviceId === e.target.value))}
            sx={{ width: '430px', ml: '15px' }}
          >
            <MenuItem value="">웹캠을 선택하세요</MenuItem>
            {videoDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" color={isWebcamConnected ? 'success.main' : 'error'} align="left" sx={{ mt: 2, ml: '15px' }}>
            {isWebcamConnected ? '카메라가 연결되었습니다.' : '* 카메라가 연결되지 않았습니다. 연결을 확인해주세요.'}
          </Typography>

          <Typography variant="body2" color={isFaceDetected ? 'success.main' : 'error'} align="left" sx={{ mt: 2, ml: '15px' }}>
            {isFaceDetected ? '얼굴이 인식되었습니다!' : '* 얼굴을 카메라 중앙에 맞춰주세요.'}
          </Typography>
        </Grid>

        <Grid item sx={{ width: '490px', ml: '50px' }}>
          <Select
            value={selectedAudioDevice?.deviceId || ''}
            displayEmpty
            onChange={(e) => setSelectedAudioDevice(audioDevices.find((d) => d.deviceId === e.target.value))}
            sx={{ width: '430px', ml: '30px' }}
          >
            <MenuItem value="">마이크를 선택하세요</MenuItem>
            {audioDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="body2" color={isMicWorking ? 'success.main' : 'error'} align="left" sx={{ mt: 2, ml: '30px' }}>
            {isMicWorking ? '마이크가 작동 중입니다!' : '* 마이크가 작동하지 않습니다.'}
          </Typography>
        </Grid>
      </Grid>

      {isTestStarted && (
        <Typography variant="h6" align="center" sx={{ color: '#000', mt: 2 }}>
          남은 시간: {timer}초
        </Typography>
      )}

      <Stack display="flex" justifyContent="center" direction="row" sx={{ mt: 3 }}>
        <Button
          variant="contained"
          sx={{ width: '200px', backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}
          onClick={handleStartRecording}
        >
          웹캠/마이크 체크
        </Button>
      </Stack>

      {/* 경고 메시지 표시 - 빨간색, 실패 이유 추가 */}
      {warningMessage && (
        <Typography variant="body2" align="center" sx={{ color: 'red', mt: 2 }}>
          {warningMessage}<br />
          {failureReason}
        </Typography>
      )}

      {/* 테스트 통과 메시지 - 녹색 */}
      {successMessage && (
        <Typography variant="body2" align="center" sx={{ color: 'green', mt: 2 }}>
          {successMessage}
        </Typography>
      )}

      <Typography variant="h7" align="center" display="block" sx={{ mt: 5, color: '#979797' }}>
        ※정확한 측정을 위해 얼굴이 전체적으로 잘 보이도록 하고, 주변 소음을 최소화해 주시기 바랍니다.
      </Typography>

      <Stack display="flex" justifyContent="center" direction="row" spacing={3} sx={{ mt: 3 }}>
        <Button variant="contained" sx={{ width: '200px', backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}
          onClick={handleTestButtonClick}
        >
          실전 테스트 바로 가기
        </Button>
        <Button variant="outlined" sx={{ width: '200px' }} onClick={() => { navigate('/precautionspage1') }}>
          유의사항 확인
        </Button>
      </Stack>

      {/* 실전 테스트 버튼 경고 메시지 */}
      {testButtonWarning && (
        <Typography variant="body2" align="center" sx={{ color: 'red', mt: 2 }}>
          {testButtonWarning}
        </Typography>
      )}
    </Container>
  );
};

export default DeviceCheckComponent;
