import React, { useContext, useEffect, useState } from 'react';
import { PronunContext } from '../../context/PronunContext';
import { Box, Button, Grid, Modal, Typography } from '@mui/material';
import ReactSpeedometer from "react-d3-speedometer"
import MovieIcon from '@mui/icons-material/Movie';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import styles from "../../styles/aiservicepage/Result/ResultFirst.module.css"
import { useNavigate } from 'react-router-dom';


const PronunciationResult = () => {
    const { results, setResults } = useContext(PronunContext);
    const navigate = useNavigate();

    // 그래프 이미지 확대용 모달
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fileURL, setFileURL] = useState(null);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 스크롤을 최상단으로 이동
        window.scrollTo(0, 0);
        //console.log(results);
        if(results.length === 0 ){
            alert('발음 테스트 결과가 없습니다');
            navigate('/pronunciation');
        }
    }, []);

    // 모달 열기
    const handleOpen = (imgSrc) => {
        setSelectedImage(imgSrc);
        setOpen(true);
    };

    // 모달 닫기
    const handleClose = () => setOpen(false);

    return <>
        {results ? results.map((result, index)=>
            <>
                <div className={styles.kkk}>
                    <div className={styles.mainContainer}>
                        <Box className={styles.maintitleContainer}>
                            <Typography variant="h6" className={styles.maintitle}>
                                <MovieIcon className={styles.icon} /> 발음 테스트 결과 {index+1}
                            </Typography>
                        </Box>

                        {/* 음성 분석 섹션 */}
                        <div className={styles.boxContainer}>
                            <Grid container spacing={3} alignItems="stretch">

                                {/* 음성 분석 */}
                                <Grid item xs={12}>
                                    <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}> {/* height: '100%' 추가 */}
                                        <Typography variant="h6" className={styles.chartTitle} align="center">
                                            음성 분석
                                        </Typography>
                                        <Grid container spacing={3} className={styles.flexContainer}>

                                            {/* 목소리의 Hz */}
                                            <Grid item xs={6}>
                                                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}> {/* height: '100%' 추가 */}
                                                    <Typography className={styles.monChartTitle} align="center">
                                                        목소리 Hz
                                                    </Typography>
                                                    <Box className={styles.flexContainer}>
                                                        <img
                                                            src={`data:image/png;base64,${result.voice_graph}`}
                                                            alt="목소리의 Hz 그래프"
                                                            className={styles.voiceHzChartImage}
                                                            onClick={() => { handleOpen(`data:image/png;base64,${result.voice_graph}`) }}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                        <Box className={styles.monTextContainer}>
                                                            <Typography className={styles.monResultText}>
                                                                목소리 평균 Hz: {result.tone}
                                                            </Typography>
                                                            <Typography className={styles.monResultText}>
                                                                {result.tone_comment}
                                                            </Typography>
                                                            <Typography className={styles.monSubtext} style={{ fontSize: "12px" }}>
                                                                *음성 주파수는 어느 정도가 좋다고 특정할 수 없습니다.
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Grid>

                                            {/* 음성 속도 분석 */}
                                            <Grid item xs={4}>
                                                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}> {/* height: '100%' 추가 */}
                                                    <Typography className={styles.monChartTitle} align="center">
                                                        음성 속도 분석
                                                    </Typography>
                                                    <div style={{ width: '100%', height: '150px', marginTop: '20px' }}>
                                                        <ReactSpeedometer
                                                            minValue={0}
                                                            maxValue={400}
                                                            fluidWidth={true}
                                                            ringWidth={40}
                                                            segments={3}
                                                            customSegmentStops={[0, 240, 300, 400]}
                                                            segmentColors={["gold", "tomato", "firebrick"]}
                                                            needleColor="red"
                                                            needleHeightRatio={0.6}
                                                            value={result.speed}
                                                        />
                                                    </div>
                                                    <Typography className={styles.monChartLabel} align="center">
                                                        {result.speed} WPM
                                                    </Typography>
                                                    <Typography className={styles.monSubtext} style={{ fontSize: "12px" }}>
                                                        *WPM(Word Per Minute): 분당 단어 수<br />
                                                        *한국인 평균 말하기 속도에 맞춘 결과입니다.
                                                    </Typography>
                                                </Box>
                                            </Grid>


                                            {/* 발음 분석 */}
                                            <Grid item xs={2}>
                                                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}>
                                                    <Typography variant="h6" className={styles.monChartTitle} align="center">
                                                        발음 분석
                                                    </Typography>
                                                    <Typography className={styles.monChartLabel} align="center">
                                                        발음 정확도: {Math.round(result.pronunciation)}%
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        {/* 음성 분석 코멘트 아래에 여백 추가 */}
                                        <Box className={styles.mainResultSummary} style={{ marginTop: '40px' }}> {/* 여백 추가 */}
                                            <Box className={styles.resultSummaryBox}>
                                                <Typography variant="h6" className={styles.resultTitle}>
                                                    <LeaderboardIcon className={styles.icon} /> Voice Comment
                                                </Typography>
                                                <Typography className={styles.resultText}>
                                                    분석된 음성에 대한 요약 내용이 여기에 표시됩니다.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>
                    </div>

                    {/* 모달 구현 */}
                    <Modal open={open} onClose={handleClose}>
                        <Box className={styles.modalBox}>
                            {selectedImage && <img src={selectedImage} alt="Enlarged" className={styles.fullscreenImage} />}
                        </Box>
                    </Modal>

                    <div className="d-flex justify-content-end mb-5">
                        <Button variant="contained" className={styles.detailButton} onClick={""}>
                            전체 테스트 결과 돌아가기 &gt;&gt;
                        </Button>
                    </div>
                </div>
            </>
        ) : (
            <Typography>결과를 불러오는 중입니다...</Typography>
        )}
    </>
};

export default PronunciationResult;
