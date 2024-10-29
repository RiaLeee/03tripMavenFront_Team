/* AnalysisResult.js */
import React, { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Grid, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { VolumeDown, VolumeUp, PlayArrow, Pause, Replay, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AnalysisResult = () => {
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
    const navigate = useNavigate();

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
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
        setTimer(60);

        navigator.mediaDevices.getUserMedia({
            audio: { deviceId: selectedAudioDevice?.deviceId }
        })
            .then((stream) => {
                audioRef.current.srcObject = stream;
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
                mediaRecorderRef.current.start();

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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    return (
        <Container sx={{ mt: '20px', width: '1100px' }}>
            <Typography variant="h4" align="left" sx={{ mt: '120px', fontWeight: 'bold'  }}>
                발음 테스트
            </Typography>
            <img src="../../images/WebTestPageLine.png" alt="Line Image" />
            <Typography variant="h5" gutterBottom align="center" sx={{ mt: '13px', mb: '13px',textAlign:'center' }}>
                분석 결과를 확인하세요
            </Typography>
            <Grid container>
                <Grid container sx={{ justifyContent: 'center', alignItems: 'center', ml: '23px' }}>
                    <Box
                        sx={{
                            width: '1100px', height: '470px',
                            bgcolor: '#F8F8F8', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            border: '1px solid #000000', borderRadius: '5px',
                            flexDirection: 'column', textAlign: 'center',
                            position: 'relative'
                        }}
                    >
                        <img
                            src='../../images/speakIcon.png'
                            alt='speak Icon'
                            style={{
                                position: 'absolute',
                                top: '40px',
                                left: '40px'
                            }}
                        />
                        <Box sx={{ fontSize: '20px', textAlign: 'left', mb: 3, ml: '-300px' }}>
                            -분당 운중동 한국학중앙연구원<br />
                            <br />
                            -신분당선 환승역과 신논현역 사이<br />
                            <br />
                            -점검 전담반실과 검거 전담반실 점거 뒤 이뤄진 위법사항 점검<br />
                            <br />
                            -유관 기관과의 관련 문의 협의 완료 중인 국회법제사법위원회<br />
                            <br />
                            -스웨덴 왕립과학원 노벨위원회<br />
                            <br />
                            -역대 최연소 30세 307일만에 2만 5000득점을 기록
                        </Box>
                        <img src="../../images/WebTestPageLine.png" alt="Line Image" style={{ width: '1100px', position: 'relative' }} />
                        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box style={{ display: 'flex', alignItems: 'center', marginTop: '25px' }}>
                                <button style={{ border: 'none', background: 'none' }}><img src='../../images/AIListenIcon.png' style={{ marginRight: '8px' }} /></button>
                                내 발음 듣기
                                <button style={{ border: 'none', background: 'none', marginLeft: '5px' }}><img src='../../images/AIListenIcon.png' style={{ marginRight: '8px' }} /></button>
                                AI 발음 듣기
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Accordion sx={{ width: '1100px' }}>
                <AccordionSummary expandIcon={<ExpandMore />} >
                    <Typography sx={{ fontSize: '20px' }}>분석 결과 보기</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box>
                        -분당 운중동 한국학중앙연구원<br />
                        <br />
                        -신분당선 환승역과 신논현역 사이<br />
                        <br />
                        -점검 전담반실과 검거 전담반실 점거 뒤 이뤄진 위법사항 점검<br />
                        <br />
                        -유관 기관과의 관련 문의 협의 완료 중인 국회법제사법위원회<br />
                        <br />
                        -스웨덴 왕립과학원 노벨위원회<br />
                        <br />
                        -역대 최연소 30세 307일만에 2만 5000득점을 기록
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ border: '1px solid #000000', width: '900px', height: '130px', display: 'flex', mt: '30px', borderRadius: '5px',textAlign: 'left' }}>
                            <Typography sx={{ ml:'30px', fontSize:'17px',fontWeight:'bold', mt:'10px' }}>
                                발음이 매우 정확합니다! 특히 OOO 의 발음이 완벽했습니다.<br />
                                말할 때 속도를 조금만 줄이면 더 명확하게 들릴 수 있습니다. 천천히 말하는 연습을 해보세요.<br />
                                발음이 아주 좋지만, OOO 에서 약간의 개선이 필요합니다.<br />
                                반복해서 연습하면 더 자연스럽게 발음할 수 있을 거예요.
                            </Typography>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Box sx={{display:'flex',justifyContent:'center',mt:'30px',}}>
                <button style={{width:'220px',padding:'8px',backgroundColor:'#0066ff',border:'none', color:'#ffffff',borderRadius:'5px'}} onClick={()=>{navigate('/result')}}>최종 결과 보러 가기</button>
            </Box>

            
        </Container >
    );
};

export default AnalysisResult;

