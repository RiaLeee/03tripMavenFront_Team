import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Container, Grid, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { VolumeDown, VolumeUp, PlayArrow, Pause, Replay } from '@mui/icons-material';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';

const RealTest1 = () => {
  const webcamRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timer, setTimer] = useState(60); // 1분 타이머
  const timerIntervalRef = useRef(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState(null);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [value, setValue] = useState(30);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    // 카메라와 마이크 장치 정보 가져오기
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
        setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
        // 기본 카메라와 마이크 선택
        setSelectedVideoDevice(devices.find((d) => d.kind === 'videoinput'));
        setSelectedAudioDevice(devices.find((d) => d.kind === 'audioinput'));
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

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimer(60); // 타이머 초기화

    navigator.mediaDevices.getUserMedia({
      video: { deviceId: selectedVideoDevice?.deviceId },
      audio: { deviceId: selectedAudioDevice?.deviceId }
    })
      .then((stream) => {
        webcamRef.current.srcObject = stream;
        audioRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorderRef.current.start();

        // 마이크 테스트
        audioRef.current.play();
        setIsAudioPlaying(true);

        timerIntervalRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error getting user media:', error);
      });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsAudioPlaying(false);
    mediaRecorderRef.current.stop();
    clearInterval(timerIntervalRef.current);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  /*
  const downloadRecording = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'recording.webm');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  */

  const handleChange = (event, newValue) => {
    setValue(newValue);
  }

  /*
    const handlePlay = () => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsVideoPlaying(true);
        setActiveButton('play'); // 활성화된 버튼 설정
      }
    };
  
    const handlePause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsVideoPlaying(false);
        setActiveButton('pause'); // 활성화된 버튼 설정
      }
    };
  
    const handleReplay = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsVideoPlaying(true);
        setActiveButton('replay'); // 활성화된 버튼 설정
      }
    };
    */

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
            <img src='../../images/webcamImg.png' style={{ width: '180px', height: '180px' }} alt="WebCam" />
            <Box sx={{ mt: 4 }}>
              웹캠이 정상적으로 설치/연결되었는지 확인해주세요.
            </Box>
          </Box>
        </Grid>
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
            <img src='../../images/micImg.png' style={{ width: '180px', height: '180px' }} alt="Mic" />
            <Box sx={{ mt: 4 }}>
              마이크 상태를 사전에 확인해주세요.<br />
              (이어폰에 있는 마이크도 사용 가능합니다.)
            </Box>
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
      <Typography variant="body2" color={isAudioPlaying ? 'success.main' : 'error'} align="left" sx={{ mt: 2, ml: '75px' }}>
        {isAudioPlaying ? '카메라 작동 중' : '*인식이 되지 않습니다.'}
      </Typography>
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
    </Container>
  );
};

export default RealTest1;
