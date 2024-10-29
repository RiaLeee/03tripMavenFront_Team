import React, { useState, useEffect, useRef, useContext } from 'react';
import { Box, Button, Container, Grid, MenuItem, Select, Typography, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router-dom';
import { PronunContext } from '../../context/PronunContext';
import {  evaluateVoiceAndText } from '../../utils/PythonServerAPI';
import { TemplateContext } from '../../context/TemplateContext';


const PronunciationTest = () => {
    const {memberInfo} = useContext(TemplateContext);
    const navigate = useNavigate();
    const timerRef = useRef(null); // 타이머 인스턴스 참조
    const [isMicActive, setIsMicActive] = useState(false); // 마이크가 활성화되었는지 여부
    const [transcript, setTranscript] = useState(''); // 자막 상태
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedAudioDevice, setSelectedAudioDevice] = useState(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [timer, setTimer] = useState(10); // 10초 타이머 초기값
    const [micError, setMicError] = useState(false); // 마이크 인식 여부
    const [testMessage, setTestMessage] = useState(''); // 테스트 메시지 상태
    const [isRecognitionDone, setIsRecognitionDone] = useState(false); // 음성 인식 완료 여부
    const recognitionRef = useRef(null); // SpeechRecognition 인스턴스 참조
    const accumulatedTranscriptRef = useRef(''); // 모든 최종 자막을 저장하는 참조
    const { newsHeadLine } = useContext(PronunContext);
    const { sequence } = useParams();
    const sequenceNumber = parseInt(sequence, 10);
    const {setResults} = useContext(PronunContext);

    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const [audioBlob, setAudioBlob] = useState(null); // 녹음된 오디오 데이터를 저장
    
    
    useEffect(() => {
        if (isNaN(sequenceNumber) || sequenceNumber < 1 || sequenceNumber > 5) {
            // 범위를 벗어나면 다른 페이지로 리다이렉트 또는 에러 메시지 표시
            navigate('/home'); // 잘못된 sequence 값일 경우 에러 페이지로 리다이렉트
        }
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const audioDevicesList = devices.filter((d) => d.kind === 'audioinput');
                setAudioDevices(audioDevicesList);
                if (audioDevicesList.length > 0) {
                    setSelectedAudioDevice(audioDevicesList[0]);
                } else {
                    setMicError(true); // 마이크가 없는 경우 에러 상태로 설정
                }
            })
            .catch((error) => {
                console.error('Error getting device information:', error);
                setMicError(true); // 장치 정보를 가져오는 데 실패한 경우 에러 상태로 설정
            });
    },[sequence]);

    //녹음 함수
    const handleStartRecording = () => {
        if (isMicActive) { // 마이크가 활성화된 경우 음성 기록 중지
            recognitionRef.current.stop(); // 음성 인식 중지
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
                mediaRecorderRef.current.stop(); // 실제 녹음 중지
            }
            clearInterval(timerRef.current); // 타이머 중지
            setIsMicActive(false); // 마이크 비활성화
            setIsAudioPlaying(false); // 음성 중지 상태로 전환
            setTestMessage('음성 기록이 중단되었습니다.'); // 중단 메시지 표시
            
        }
        else {
            setTranscript(''); // 자막 초기화
            setIsMicActive(true); // 음성 인식 중 상태
            setTimer(10); // 타이머 초기화
            setMicError(false); // 마이크 에러 상태 초기화
            setTestMessage(''); // 이전 테스트 메시지 초기화
            setIsRecognitionDone(false); // 음성 인식 완료 상태 초기화
            accumulatedTranscriptRef.current = ''; // 누적된 자막 초기화    

            navigator.mediaDevices.getUserMedia({
                audio: { 
                    deviceId: selectedAudioDevice?.deviceId,
                    sampleRate: 16000,  // 16kHz 샘플레이트
                }
            })
            .then( stream => {
                /*
                const audioRef = new Audio();
                audioRef.srcObject = stream;
                audioRef.play();
                */
                mediaRecorderRef.current = new MediaRecorder(stream, {mimeType: 'audio/webm;codecs=opus'});
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunks.current.push(event.data);
                };

                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                    setAudioBlob(audioBlob); // 오디오 데이터를 Blob으로 저장
                    console.log('오디오 멈춤, 블롭:', audioBlob);
                    audioChunks.current = []; // 저장 후 초기화
                    setIsRecognitionDone(true);
                };

                mediaRecorderRef.current.start();
                setTestMessage('녹음이 시작되었습니다.');
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
                setMicError(true);
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
        if (!audioBlob) {
            alert('녹음된 파일이 없습니다.');
            return;
        }

        //블롭을 webm 파일로 변환하기
        const file = convertBlobToFile(audioBlob, 'audio2.webm');
        console.log('녹음 파일:',file);


        //발음평가에 쓰일 원래 문장
        const text = newsHeadLine[sequenceNumber - 1].replace(/[^가-힣a-zA-Z]/g, '')
        //console.log('원래 문장: ',text);


        //nlp + 목소리톤 + 말하기속도 + 발음정확도 분석에 보낼 폼데이터
        const formData = new FormData();
        formData.append('voice', file); // 오디오 데이터를 FormData에 추가
        formData.append('text', text);
        formData.append('gender', memberInfo.gender=='male'?'0':'1'); //사용자 성별 넣어줘야함
        formData.append('isVoiceTest', '1'); //발음테스트시 1로, 영상테스트시 0으로 하면 됨

        //목소리톤 + 말하기속도 + 발음정확도 분석
        const response = await evaluateVoiceAndText(formData);
        console.log(response);
        if(response.success){
            const data = {
                voice_graph: response.data.voice_tone.voice,
                tone: response.data.voice_tone.voice_mean,
                tone_comment: response.data.voice_tone.voice_check,
                speed: response.data.speed_result.phonemes_per_min,
                pronunciation: response.data.pronunciation_precision.pronunciation_accuracy,
                total_time: response.data.speed_result.total_spoken_time,
            };
            setResults(prev=>[...prev, data]);
        }
        else{
            alert('다시 녹음해서 전달해주세요');
        }
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
            setIsMicActive(false);
            recognition.stop();
        };

        recognition.onend = () => {
            // 음성 인식이 자동으로 종료되지 않도록 빈 onend 핸들러
        };

        recognition.start();

        // 10초 후 음성 인식 종료
        setTimeout(() => {
            recognition.stop();
            setIsMicActive(false); // 음성 인식이 끝났을 때 상태 비활성화
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

    const handlePronunciationTest = () => {
        /*
        if (!isRecognitionDone) {
            // 마이크 테스트가 진행되지 않았을 때
            setTestMessage('위 문장을 따라 읽어주세요.');
        } else if (!isTranscriptValid(transcript)) {
            // 자막이 맞지 않을 때
            setTestMessage('장치 테스트에 실패하였습니다. 다시 시도해주세요.');
        } else {
            // 자막이 맞을 때 페이지 이동
            navigate(`/pronunciation/${sequenceNumber+1}`);
        }
            */
        if (sequenceNumber === 5) {
            navigate(`/pronunciation/result`);
        }
        else {
            navigate(`/pronunciation/${sequenceNumber+1}`);  
        }
        // 5번으로 가면 결과창!
    };

    return (
        <Container sx={{ mt: '20px', width: '1100px' }}>
            <Typography variant="h4" gutterBottom align="left" sx={{ mt: '120px', fontWeight: 'bold' }}>
                발음 테스트 
            </Typography>
            <img src="../../images/WebTestPageLine.png" alt="Line Image" />
            <Typography variant="h5" gutterBottom align="center" sx={{ mt: '13px', mb: '13px', fontWeight:'bold' }}>
                테스트 {sequenceNumber}
            </Typography>
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
                            isMicActive ? (
                                <>
                                    <Typography variant="subtitle1" align="center" sx={{ mt: 2 }}>

                                        {transcript || "음성을 인식 중입니다..."}<br /> {/* 실시간 음성 인식 결과 표시 */}
                                    </Typography>
                                    <Typography variant="subtitle1" align="center" sx={{ mt: 2, fontSize: '1.5em', fontWeight: 'bold' }}>
                                        {"문장: " + newsHeadLine[sequenceNumber - 1]}
                                    </Typography>
                                    <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                                        남은 시간: {timer}초 {/* 타이머 표시 */}
                                    </Typography>
                                </>
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
                                        {newsHeadLine[sequenceNumber - 1]}
                                    </Box>
                                </>
                            )
                        )}

                    </Box>
                </Grid>
            </Grid>
            {/* 마이크 인식 여부에 따른 상태 메시지 표시 */}
            <Typography variant="body2" fontSize="1.2em" color={isAudioPlaying ? 'success.main' : 'error'} align="center" sx={{ mt: 4 }}>
                {isAudioPlaying ? '마이크 작동 중' : (micError ? '*인식이 되지 않습니다.' : '')}
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
                <Button variant="contained" sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }} onClick={handlePronunciationTest}>
                    {sequenceNumber === 5 ? '결과 보러가기' : '다음 문장으로 가기'} 
                </Button>

                <Button variant="contained" sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }} onClick={handleSendAudio}>
                    {'분석 요청하기'} 
                </Button>
            </Stack>
        </Container >
    );
};

export default PronunciationTest;
