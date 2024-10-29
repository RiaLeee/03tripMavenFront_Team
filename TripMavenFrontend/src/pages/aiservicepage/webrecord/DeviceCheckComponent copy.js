import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Container, Grid, MenuItem, Select, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const DeviceCheckComponent2 = () => {
  const webcamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(60); // 1분 타이머
  const timerIntervalRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [transcript, setTranscript] = useState(""); // 음성 인식 자막 저장용 상태
  const [isWebcamConnected, setIsWebcamConnected] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false); // 테스트 시작 여부 상태
  const [testResult, setTestResult] = useState(""); // 테스트 결과 저장 상태
  const navigate = useNavigate();

  /*
  useEffect(() => {
    // 카메라와 마이크 장치 정보 가져오기
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
        setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
        // 기본 카메라와 마이크 선택
        setSelectedVideoDevice(devices.find((d) => d.kind === 'videoinput'));
        setSelectedAudioDevice(devices.find((d) => d.kind === 'audioinput'));
        const videoDevices = devices.filter(device => device.kind === 'videoinput'); 
        if (videoDevices.length > 0) {
          setIsWebcamConnected(true);
        } else {
          setIsWebcamConnected(false);
        }
      })
      .catch((error) => {
        console.error('Error getting device information:', error);
      });

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  */
  

  useEffect(() => {

    const effect = async()=>{
      const mediaInfo = await navigator.mediaDevices.enumerateDevices();
      console.log(mediaInfo);

      // 마이크와 카메라 권한 요청
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        console.log('권한 요청 성공');
        // 권한을 허용한 경우에만 enumerateDevices를 호출
        navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            console.log(devices.filter((d) => d.kind === 'videoinput'));
            setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
            console.log(devices.filter((d) => d.kind === 'audioinput'));
            setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));

            // 기본 카메라와 마이크 선택
            if(devices.find((d) => d.kind === 'videoinput').length > 0)
              setSelectedVideoDevice(devices.find((d) => d.kind === 'videoinput')[0]);
            if(devices.find((d) => d.kind === 'audioinput').length > 0)
              setSelectedAudioDevice(devices.find((d) => d.kind === 'audioinput')[0]);
            
          })
          .catch((error) => {
            console.error('Error getting device information:', error);
          });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
    };
    effect();
  
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);
  

  const handleStartRecording = () => {
    setIsTestStarted(true); // 테스트 시작 상태로 변경
    setIsRecording(true);
    setTestResult(""); // 테스트 결과 초기화

    navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedVideoDevice?.deviceId },
      audio: { deviceId: selectedAudioDevice?.deviceId }
    })
      .then((stream) => {
        webcamRef.current.srcObject = stream;

        // 음성 인식 시작
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

        // 10초 후에 자동으로 인식 종료
        setTimeout(() => {
          recognition.stop();
          handleStopRecording();
          setTestResult(transcript ? "완료되었습니다!" : "실패했습니다.");
        }, 10000);

      })
      .catch((error) => {
        console.error('Error getting user media:', error);
        handleStopRecording();
        setTestResult("실패했습니다.");
      });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAudioPlaying(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  return (
    <Container sx={{ mt: '20px', width: '1100px' }}>
      <Typography variant="h4" gutterBottom align="left" sx={{ mt: '120px', fontWeight: 'bold' }}>
        장비 테스트
      </Typography>
      <img src="../../images/WebTestPageLine.png" alt="Line Image" />
      <Typography variant="h5" gutterBottom align="center" sx={{ mt: '20px', mb: '20px' }}>
        지금부터 웹캡/마이크체크를 시작하겠습니다.
        [웹캡/마이크체크] 버튼을 누르고 가이드 선 안에 얼굴을 위치시켜
        5초 이내에 “안녕하세요! 만나서 반갑습니다.”을 소리 내어 읽어주세요.
      </Typography>
      <Grid container>
        {/* 왼쪽 박스: 웹캠 미리보기 */}
        <Grid item xs={5.4} sx={{ ml: '50px' }}>
          <Box
            sx={{
              width: '100%', height: 360,
              bgcolor: '#F8F8F8', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              border: '1px solid #000000', borderRadius: '5px',
              flexDirection: 'column', textAlign: 'center'
            }}
          >
            {isTestStarted ? (
              <Webcam
                ref={webcamRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
              />
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

        {/* 오른쪽 박스: 음성 인식 자막 표시 또는 기본 이미지 및 문구 */}
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
        </Grid>
      </Grid>

      {/* 인식이 되지 않습니다 문구 */}
      <Typography variant="body2" color={isAudioPlaying ? 'success.main' : 'error'} align="left" sx={{ mt: 2, ml: '75px' }}>
        {isAudioPlaying ? '카메라 작동 중' : '*인식이 되지 않습니다.'}
      </Typography>

      {/* 웹캠/마이크 체크 버튼 */}
      <Stack display="flex" justifyContent="center" direction="row" sx={{ mt: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}
          onClick={handleStartRecording}
        >
          웹캠/마이크 체크
        </Button>
      </Stack>

      {testResult && (
        <Typography variant="h6" align="center" sx={{ mt: 3, color: testResult === "완료되었습니다!" ? 'success.main' : 'error.main' }}>
          {testResult}
        </Typography>
      )}

      <Typography variant="h7" align="center" display="block" sx={{ mt: 5, color: '#979797' }}>
        ※정확한 측정을 위해 얼굴이 전체적으로 잘 보이도록 하고, 주변 소음을 최소화해 주시기 바랍니다.
      </Typography>
      <Stack display="flex" justifyContent="center" direction="row" spacing={3} sx={{ mt: '25px' }}>
        <Button variant="contained" sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}>
          실전 테스트 바로 가기
        </Button>
        <Button variant="outlined" onClick={() => { navigate('/precautionspage1') }}>
          유의사항 확인
        </Button>
      </Stack>

      <Typography variant="h7" align="center" display="block" sx={{ mt: 5 }} >
        ※정확한 측정을 위해 얼굴이 전체적으로 잘 보이도록 하고, 주변 소음을 최소화해 주시기 바랍니다.
      </Typography>
    </Container>
  );
};

export default DeviceCheckComponent2;
