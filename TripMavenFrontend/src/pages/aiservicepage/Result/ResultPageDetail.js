import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Modal, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import MovieIcon from '@mui/icons-material/Movie';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import TagIcon from '@mui/icons-material/Tag'; 
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';

import styles from "../../../styles/aiservicepage/Result/ResultFirst.module.css";
import { useLocation, useParams } from "react-router-dom";
import { PieChart } from "@mui/x-charts";
import WordCloud from 'react-d3-cloud';
import ReactSpeedometer from "react-d3-speedometer"
import { fetchFile } from "../../../utils/fileData";


const ResultFirstPage = ({result, videoUrls, setPageNumber, pageNumber}) => {

  const groupFirstId = useParams().id;

  //워드클라우드 데이터
  const [wordCloudData, setWordCloudData] = useState([]);

  // 그래프를 저장할 상태 변수
  const [graphs, setGraphs] = useState([]);
  const graphNames = ['입 주변 변화율','광대 주변 변화율','미간 주름 변화율','팔자 주름 변화율']

  // 그래프 이미지 확대용 모달
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  // 모달 열기
  const handleOpen = (imgSrc) => {
    setSelectedImage(imgSrc);
    setOpen(true);
  };

  // 모달 닫기
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log('상세프랍스 내려온 groupFirstId: ', groupFirstId);
    console.log('ResultFinalPage에서 가져온 result: ', result);
    const temp = async () => {
      if (result) {
        const fileUrl = await fetchFile(result.filename, 1);
        setFileURL(fileUrl);

        // 각 결과에서 그래프를 추출하여 상태에 저장
        setGraphs([`data:image/png;base64,${result.mouth}`,
                    `data:image/png;base64,${result.cheek}`,
                    `data:image/png;base64,${result.brow}`,
                    `data:image/png;base64,${result.nasolabial}`]);
                    
        if (result.text) {
          const wordList = result.text.split(',');
          const weightList = result.weight.split(',');
          const keyValue = [];

          for (let i = 0; i < wordList.length; i++) {
            keyValue.push({ 'text': wordList[i], 'value': parseInt(weightList[i], 10) * 100 });
          }
          setWordCloudData(keyValue);
        }
      }
    };
    
    temp();

    //페이지 옮기면 스크롤 위로 올리기
    scrollToTop(); 
  }, [result, pageNumber]);

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  const handleClick = ()=>{
    setPageNumber("0");
  };

  return <>

    <div className={styles.pageTitle}>
      {pageNumber==="1"?"첫":"두"}번째 실전 테스트 결과
    </div>

    <p>*영상 및 음성 분석 결과는 평균적인 데이터이므로 참고용으로만 보시기 바랍니다</p>
    <p>*페이지 내 모든 이미지들은 클릭 시, 확대됩니다.</p>
    <div className="d-flex justify-content-end mb-5">
      <Button variant="contained" className={styles.detailButton} onClick={handleClick}>
        전체 테스트 결과 돌아가기 &gt;&gt;
      </Button>
    </div>
    <div className={styles.mainContainer}>
      <Box className={styles.maintitleContainer}>
        <Typography variant="h6" className={styles.maintitle}>
          <MovieIcon className={styles.icon} /> 영상 분석 결과
        </Typography>
      </Box>

      {result ? (
        <>
          {/* 비디오 분석 섹션 */}
          <div className={styles.boxContainer}>
            <Grid container spacing={3} alignItems="stretch"> {/* Grid에 alignItems="stretch" 추가 */}
              {/* 총 응시 시간, 눈 깜빡임 횟수 */}
              <Grid item xs={6}>
                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}> {/* height: 100% 추가 */}
                  <Typography variant="h6" className={styles.chartTitle} align="center">
                    영상 분석
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box className={styles.monBoxContainer}>
                        <Typography variant="h6" className={styles.monChartTitle} align="center">
                          총 응시 시간
                        </Typography>
                        <Typography className={styles.monChartLabel} align="center">
                          {result.total_time} 초
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className={styles.monBoxContainer}>
                        <Typography variant="h6" className={styles.monChartTitle} align="center">
                          눈 깜빡임 횟수
                        </Typography>
                        <Typography className={styles.monChartLabel} align="center">
                          {result.eye} 회
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box className={`${styles.mainResultSummary} ${styles.commentBoxBelow}`}>
                    <Box className={styles.resultSummaryBox}>
                      <Typography variant="h6" className={styles.resultTitle}>
                        <LeaderboardIcon className={styles.icon} /> Video Comment
                      </Typography>
                      <Typography className={styles.resultText}>
                        {result.commentEye.split("*")[0]}
                      </Typography>
                      <Typography className={styles.monSubtext} style={{fontSize:"12px"}}>
                        {"*" + result.commentEye.split("*")[1]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* 영상 다시보기 */}
              <Grid item xs={6}>
                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}> {/* height: 100% 추가 */}
                  <Typography variant="h6" className={styles.chartTitle} align="center">
                    영상 다시보기
                  </Typography>
                  <Box className={styles.videoPlayerContainer}>
                    {(videoUrls && videoUrls.length > 0) ?
                      (
                        <video controls className={styles.videoPlayer}>
                          <source src={videoUrls[0] || fileURL} type="video/mp4" />
                        </video>
                      )
                      :
                      <Typography variant="h6" align="center" sx={{ marginTop: "120px" }}>
                        일시적인 오류로 동영상을 표시할 수 없습니다.
                      </Typography>
                    }
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </div>


          {/* 표정 분석 섹션 */}
          <div className={styles.boxContainer}>
            <Box className={styles.chartSection}>
              <Box className={`${styles.mainResult} ${styles.sameHeight}`}>
                <Typography variant="h6" className={styles.chartTitle}>
                  표정 분석
                </Typography>

                <Grid container spacing={3} className={styles.chartGrid}>
                  {/* 그래프들 나열 */}
                  {graphs.length > 0 && graphs.map((graph, index) => 
                    <Grid item xs={3} key={index}>
                      <Box className={styles.monBoxContainer}>
                        <Typography variant="h6" className={styles.monChartTitle} align="center">
                          {graphNames[index]}
                        </Typography>
                        <img
                          src={graph}
                          alt={`${graphNames[index]} 그래프`}
                          className={styles.monChartImage}
                          onClick={() => { handleOpen(graph) }}
                          style={{ cursor: 'pointer' }} />
                      </Box>
                    </Grid>
                  )}
                </Grid>


                {/* 표정 분석 결과 요약 */}
                <Grid item xs={12}>
                <Box className={`${styles.mainResultSummary} ${styles.commentBoxBelow}`}>
                  <Box className={styles.resultSummaryBox}>
                    <Typography variant="h6" className={styles.resultTitle}>
                      <EmojiEmotionsIcon className={styles.icon} /> Face Comment
                    </Typography>
                    <Typography className={styles.resultText}>
                      {/* 마침표로 나눈 결과를 map을 사용하여 각 문장을 렌더링 */}
                      {result.commentsFace.split(".").map((sentence, index) => (
                        <span key={index}>
                          {sentence.trim()}
                          <br />
                        </span>
                      ))}
                    </Typography>
                    <Typography variant="h6" className={styles.resultTitles}>
                      <SentimentNeutralIcon className={styles.icon} /> {result.commentsFace.split("*").slice(-1)[0]}
                    </Typography>
                  </Box>
                </Box>
                </Grid>
              </Box>
            </Box>


            {/* 모달 구현 */}
            <Modal open={open} onClose={handleClose}>
              <Box className={styles.modalBox}>
                {selectedImage && <img src={selectedImage} alt="Enlarged" className={styles.fullscreenImage} />}
              </Box>
            </Modal>
          </div>
        </>
      ) : (
        <Typography>결과를 불러오는 중입니다...</Typography>
      )}
    </div>


    {result ? (
      <>
        <div className={styles.mainContainer}>
          <Box className={styles.maintitleContainer}>
            <Typography variant="h6" className={styles.maintitle}>
              <MovieIcon className={styles.icon} /> 음성 분석 결과
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
                          목소리 톤 분석
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
                              목소리 평균 Hz: {result.tone_mean}
                            </Typography>
                            <Typography className={styles.monResultText}>
                              {result.tone}
                            </Typography> 
                            {/* <Typography className={styles.monResultText}>
                              목소리 평균 Hz: {result.tone_mean}
                            </Typography> */}
                            <Typography className={styles.monSubtext} style={{fontSize:"12px"}}>
                              <br/>
                              *평균적으로 남성은 110~130헤르츠(hz), 여성은 210~240헤르츠(hz)의 영역 대의 목소리가 일반적으로 듣기 좋은 목소리라고 합니다.
                              <br/>
                              *그래프 상에서 목소리가 해당 범위를 자주 벗어나거나 크게 벗어나는 구간이 있다면 유의해서 살펴보시기 바랍니다.
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
                        <div style={{width:'100%', height:'150px', marginTop:'20px'}}>
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
                        <Typography className={styles.monSubtext} style={{fontSize:"12px"}}>
                          *WPM(Word Per Minute): 분당 단어 수<br />
                          *한국인 평균 말하기 속도는 분당 240 ~ 300 (어절) 입니다.
                        </Typography>
                      </Box>
                    </Grid>


                    {/* 발음 분석 */}
                    <Grid item xs={2}>
                      <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}>
                        <Typography variant="h6" className={styles.monChartTitle} align="center">
                          발음 분석
                        </Typography>
                        <br/>
                        <Typography className={styles.monChartLabel} align="center">
                          발음 정확도: {result.pronunciation}%
                        </Typography>
                        <br/>
                        <Typography className={styles.monSubtext} style={{fontSize:"12px"}}>
                          *녹음 환경에 따라 발음 정확도의 차이가 존재할 수 있습니다. <br/>
                          <br/>
                          *뉴스 영상의 아나운서의 발음 정확도는 80~90% 를 보입니다.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  {/* 음성 분석 코멘트 아래에 여백 추가 */}
                  <Box className={styles.mainResultSummary} style={{ marginTop: '40px' }}>
                    <Box className={styles.resultSummaryBox}>
                      <Typography variant="h6" className={styles.resultTitle}>
                        <MicIcon className={styles.icon} /> Voice Comment
                      </Typography>
                      
                      <Typography className={styles.resultText}>
                        음성 주파수는 {result.tone} Hz에 해당하는 수치를 보입니다.
                        <Typography className={styles.resultVoice}>
                          {result.member.gender === 'male' ? (
                            result.tone >= 110 && result.tone <= 130 ? (
                              '남성의 경우, 현재 음성 주파수는 듣기 좋은 범위에 속합니다.'
                            ) : (
                              '남성의 경우, 음성 주파수가 조금 더 조정될 여지가 있습니다. 적절한 발성을 통해 더 자연스러운 톤을 낼 수 있습니다.'
                            )
                          ) : (
                            result.tone >= 210 && result.tone <= 240 ? (
                              '여성의 경우, 현재 음성 주파수는 듣기 좋은 범위에 속합니다.'
                            ) : (
                              '여성의 경우, 음성 주파수가 조금 더 조정될 여지가 있습니다. 적절한 발성을 통해 더 자연스러운 톤을 낼 수 있습니다.'
                            )
                          )}
                        </Typography>

                        <br />
                        음성 속도 분석은 약 {result.speed} WPM의 수치를 보입니다.
                        <Typography className={styles.resultVoice}>
                          {result.speed < 240 && 
                            '말하기 속도가 다소 느린 편입니다. 청중이 좀 더 집중할 수 있도록 속도를 약간 높이는 것이 좋습니다.'}
                          {result.speed >= 240 && result.speed <= 300 && 
                            '말하기 속도는 평균적인 수치를 보입니다. 청중의 이해와 관심을 잘 이끌어낼 수 있는 속도입니다.'}
                          {result.speed > 300 && 
                            '말하기 속도가 다소 빠른 편입니다. 청중이 내용을 놓칠 수 있으니, 조금 더 천천히 말하는 것이 좋습니다.'}
                        </Typography>

                        <br />
                        발음 정확도는 약 {result.pronunciation}%의 수치를 보입니다.
                        <Typography className={styles.resultVoice}>
                          {result.pronunciation < 20 && 
                            '발음 정확도가 다소 낮은 편입니다. 발음 훈련을 통해 더욱 명확한 전달이 가능해질 수 있습니다.'}
                          {result.pronunciation >= 20 && result.pronunciation <= 50 && 
                            '발음 정확도가 평균 이하이므로, 좀 더 명확한 발음 연습이 필요합니다.'}
                          {result.pronunciation > 50 && result.pronunciation <= 80 && 
                            '발음 정확도가 평균적인 수준입니다. 전달력 있는 말하기를 위해 조금 더 개선할 여지가 있습니다.'}
                          {result.pronunciation > 80 && 
                            '발음 정확도가 매우 좋은 편입니다. 명확하고 전달력 있는 발음으로 청중의 이해를 돕고 있습니다.'}
                        </Typography>
                      </Typography>
                    </Box>
                  </Box>

                </Box>
              </Grid>

              

            </Grid>
          </div>


          <div className={styles.monMainContainer}>
            {/* 문법 분석 섹션 */}
            <Grid container spacing={3} alignItems="stretch"> {/* alignItems="stretch" 추가 */}
              <Grid item xs={7}>
                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`}> {/* equalHeightBox 클래스 추가 */}
                  <Typography variant="h6" className={styles.chartTitle} align="center">
                    문법 분석
                  </Typography>
                  <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Box className={styles.monBoxContainer}>
                      <Typography variant="h6" className={styles.monChartTitle} align="center">
                        불필요한 추임새 빈도
                      </Typography>

                      {result.fillerwords && result.fillerwords.split(',').length > 0 ? (
                        <TableContainer sx={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                          <Table>
                            <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                              <TableRow>
                                <TableCell align="center">단어</TableCell>
                                <TableCell align="center">사용횟수</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {result.fillerwords.split(',').map((word, index) => (
                                <TableRow key={index} hover>
                                  <TableCell align="center">{word}</TableCell>
                                  <TableCell align="center">{result.fillerweights.split(',')[index] + '번'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography align="center" style={{ marginTop: '10px', marginBottom: '10px', fontSize: '14px' }}>
                          불필요한 추임새 사용 결과가 없습니다.
                        </Typography>
                      )}
                      
                      <Typography className={styles.monSubtext} align="center" style={{ fontSize: '12px' }}>
                        *주로 쓰는 추임새 단어를 추출한 결과입니다.
                      </Typography>
                    </Box>
                  </Grid>



                    {/* 어미 분석 */}
                    <Grid item xs={6}>
                      <Box className={styles.monBoxContainer}>
                        <Typography variant="h6" className={styles.monChartTitle} align="center">
                          어미 분석
                        </Typography>
                        <PieChart
                          series={[
                            {
                              data: [
                                { id: 0, value: result.formal_speak, label: '평서문' },
                                { id: 1, value: result.question_speak, label: '의문문' },
                              ],
                              arcLabel: (params) => {
                                const total = result.formal_speak + result.question_speak;
                                const percent = ((params.value / total) * 100).toFixed(0);
                                return params.value > 0 ? `${params.label} ${percent}%` : '';
                              },
                            },
                          ]}
                          labelPlacement="end"
                          width={300}
                          height={200}
                          sx={{ marginTop: '10px', fontSize: '14px', fontWeight: 'bold' }}
                        />
                        <Typography className={styles.monChartLabel} align="center" sx={{ marginBottom: '10px' }}>
                          어미 비율
                        </Typography>
                        <Typography className={styles.monSubtext} align="center" style={{fontSize:"12px"}}>
                          *어미 분석을 통해 나온 평서문과 의문문 비율 차트입니다.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* 키워드 분석 섹션 */}
              <Grid item xs={5}>
                <Box className={`${styles.monBoxContainer} ${styles.equalHeightBox}`} style={{ height: '100%' }}> {/* equalHeightBox 클래스 추가 */}
                  <Typography variant="h6" className={styles.chartTitle} align="center">
                    키워드 분석
                  </Typography>
                  <WordCloud
                    data={wordCloudData}
                    width={300}
                    height={150}
                    font="Times"
                    fontWeight="bold"
                    spiral="rectangular"
                    padding={5}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* 문법 및 키워드 코멘트 */}
            <Grid item xs={12}>
              <Box className={styles.mainResultSummary}>
                <Box className={styles.resultSummaryBox}>
                  <Typography variant="h6" className={styles.resultTitle}>
                  <TagIcon className={styles.icon} /> Suceess Keyword
                  </Typography>
                  <Typography className={styles.resultText}>
                
                  {result.member.keywords.split('*').map((key, index) => (
                  <span key={index}>
                      {index !== 0 && ','} {/* 첫 번째 항목에는 쉼표를 붙이지 않음 */}
                      <span>{key.trim()}</span>
                    </span>
                  ))}


                  </Typography>
                </Box>
              </Box>
            </Grid>

          </div>
        </div>
        
        <div className="d-flex justify-content-end mb-5">
          <Button variant="contained" className={styles.detailButton} onClick={handleClick}>
            전체 테스트 결과 돌아가기 &gt;&gt;
          </Button>
        </div>
      </>
    ) : (
      <Typography>결과를 불러오는 중입니다...</Typography>
    )}
  </>
};

export default ResultFirstPage;
