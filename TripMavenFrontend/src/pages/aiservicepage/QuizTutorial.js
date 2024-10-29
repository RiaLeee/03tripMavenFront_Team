import React from 'react';
import styles from '../../styles/aiservicepage/QuizTutorial.module.css';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const QuizTutorial = () => {

    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Tutorial</h1>
            <div className={styles.contentFrame}>
                <div className={styles.licenseInfoConfirm}>
                    <Box sx={{ mt: 8, width: '100%', textAlign: 'center', mt: '10px' }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            안녕하세요 퀴즈에 참여해 주셔서 감사합니다.<br />
                            본 퀴즈는 총 4개의 선택지 중 하나의 정답을<br />
                            선택하는 방식으로 진행됩니다.<br />
                            문제는 총 10문제 이며, <br />
                            각 문제는 하나의 정답만을 가지고 있습니다.
                        </Typography>
                        <Typography variant='h7' sx={{ fontWeight: 'bold', textAlign: 'left'}}>
                            1. 화면에 표시되는 문제와 4개의 선택지를 확인<br />
                            2. 모든 문제에 대한 답변을 마친 후, 제출 버튼을 눌러 결과를 확인하세요.
                        </Typography>
                    </Box>
                </div>
                <button className={styles.button} onClick={() => { navigate('/quizform2') }} style={{ marginTop: '35px'}}>확인</button>

            </div>


        </div>

    );
};

export default QuizTutorial;
