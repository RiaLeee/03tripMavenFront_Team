import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import styles from "../../../styles/aiservicepage/Result/ResultFinalPage.module.css";
import MovieIcon from '@mui/icons-material/Movie';
import MicIcon from '@mui/icons-material/Mic';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { resultGetById } from "../../../utils/AiData";
import ResultPageDetail from "./ResultPageDetail";

const ResultFinalPage = () => {

  const location = useLocation();
  const { videoUrls } = location.state || {};

  const memberId = localStorage.getItem('membersId');
  const groupId = useParams().id;
  const navigate = useNavigate();

  const [results, setResults] = useState([]); //영상, 음성 분석 결과
  const [pageNumber, setPageNumber] = useState("0"); //상세 페이지 전환 스테이트

  useEffect(() => {

    console.log('groupId: ', groupId);

    // 그룹id로 결과 2개 가져오기
    const getResults = async () => {

      const data = await resultGetById(groupId);
      console.log('data.productEvaluation: ', data.productEvaluation);
      console.log('data.productEvaluation[0]: ', data.productEvaluation[0]);
      console.log('data.productEvaluation[0]: ', data.productEvaluation[0].member.keywords.split('*'));
      console.log('data.productEvaluation[0]: ', data.productEvaluation[0].commentsFace.split('*')[7]);
      setResults(data);


    };

    getResults();

  }, [groupId]);


  const handleGoToFirstPage = () => {
    console.log('handleGoToFirstPage의 result: ', results);
    // navigate 함수를 이용해 데이터를 state로 전달
    /*
    navigate(`/resultFirstPage/${result.productEvaluation[0].id}`, {
      state: {
        result: result.productEvaluation[0],
        videoUrls: videoUrls,
      }
    });
    */
    setPageNumber("1");
  };

  const handleGoToSecondPage = () => {
    console.log('handleGoToSecondPage의 result: ', results);
    // navigate 함수를 이용해 데이터를 state로 전달
    /*
    navigate(`/resultSecondPage/${result.productEvaluation[1].id}`, {
      state: {
        result: result.productEvaluation[1],
        videoUrls: videoUrls,
      }
    });
    */
    setPageNumber("2");
  };



  return <>
    {pageNumber === "0" ? (
      <div className={styles.container}>
        <div className={styles.pageTitle}>실전 테스트 결과</div>
        <div className={styles.mainResult}>
          {/* 종합 결과 */}
          <Box className={styles.titleContainer}>
            <Typography variant="h6" className={styles.title}>종합 결과</Typography>
          </Box>

          <div className={styles.resultSection}>
            {/* 영상 분석 결과 */}
            {results?.productEvaluation?.length > 0 && (
              <Box className={styles.resultBox}>
                <Typography variant="h6" align="center" className={styles.resultTitle}>
                  <MovieIcon className={styles.icon} /> 영상 분석 결과
                </Typography>
                <Box className={styles.resultText}>
                  {results.productEvaluation[0].commentEye || '눈 분석 결과 없음'}
                  <br />
                  {results.productEvaluation[0].commentsFace.split('*')[7] || '표정 분석 결과 없음'}
                </Box>
              </Box>
            )}

            {/* 음성 분석 결과 */}
            <Box className={styles.resultBox}>
              <Typography variant="h6" align="center" className={styles.resultTitle}>
                <MicIcon className={styles.icon} /> 음성 분석 결과
              </Typography>
              <Typography className={styles.resultText}>
                <Typography className={styles.resultVoice}>
                  {results?.productEvaluation?.[0]?.member.gender === 'male' ? (
                    results?.productEvaluation?.[0]?.tone >= 110 && results?.productEvaluation?.[0]?.tone <= 130 ? (
                      '남성의 경우, 현재 음성 주파수는 듣기 좋은 범위에 속합니다.'
                    ) : (
                      '남성의 경우, 음성 주파수가 조금 더 조정될 여지가 있습니다. 적절한 발성을 통해 더 자연스러운 톤을 낼 수 있습니다.'
                    )
                  ) : (
                    results?.productEvaluation?.[0]?.tone >= 210 && results?.productEvaluation?.[0]?.tone <= 240 ? (
                      '여성의 경우, 현재 음성 주파수는 듣기 좋은 범위에 속합니다.'
                    ) : (
                      '여성의 경우, 음성 주파수가 조금 더 조정될 여지가 있습니다. 적절한 발성을 통해 더 자연스러운 톤을 낼 수 있습니다.'
                    )
                  )}
                </Typography>
                <Typography className={styles.resultVoice}>
                  {results?.productEvaluation?.[0]?.speed < 240 &&
                    '말하기 속도가 다소 느린 편입니다. 청중이 좀 더 집중할 수 있도록 속도를 약간 높이는 것이 좋습니다.'}
                  {results?.productEvaluation?.[0]?.speed >= 240 && results?.productEvaluation?.[0]?.speed <= 300 &&
                    '말하기 속도는 평균적인 수치를 보입니다. 청중의 이해와 관심을 잘 이끌어낼 수 있는 속도입니다.'}
                  {results?.productEvaluation?.[0]?.speed > 300 &&
                    '말하기 속도가 다소 빠른 편입니다. 청중이 내용을 놓칠 수 있으니, 조금 더 천천히 말하는 것이 좋습니다.'}
                </Typography>

                <Typography className={styles.resultVoice}>
                  {results?.productEvaluation?.[0]?.pronunciation < 20 &&
                    '발음 정확도가 다소 낮은 편입니다. 발음 훈련을 통해 더욱 명확한 전달이 가능해질 수 있습니다.'}
                  {results?.productEvaluation?.[0]?.pronunciation >= 20 && results?.productEvaluation?.[0]?.pronunciation <= 50 &&
                    '발음 정확도가 평균 이하이므로, 좀 더 명확한 발음 연습이 필요합니다.'}
                  {results?.productEvaluation?.[0]?.pronunciation > 50 && results?.productEvaluation?.[0]?.pronunciation <= 80 &&
                    '발음 정확도가 평균적인 수준입니다. 전달력 있는 말하기를 위해 조금 더 개선할 여지가 있습니다.'}
                  {results?.productEvaluation?.[0]?.pronunciation > 80 &&
                    '발음 정확도가 매우 좋은 편입니다. 명확하고 전달력 있는 발음으로 청중의 이해를 돕고 있습니다.'}
                </Typography>
              </Typography>
            </Box>
          </div>


          <div className={styles.keywordSection}>
            {/* 획득한 키워드 */}
            <Box className={styles.resultBox}>
              <Typography variant="h6" align="center" className={styles.resultTitleKeyword}>
                <EmojiEventsIcon className={styles.icon} /> 획득한 키워드
              </Typography>
              <Box className={styles.resultTextKeyword}>
                {results?.productEvaluation?.[0]?.member?.keywords
                  .split('*')
                  .map((keyword, index) => (
                    <span key={index}>
                      <br /> #
                      <span style={{ fontWeight: 'bold', color: 'blue' }}>{keyword.trim()}</span>
                    </span>
                  ))}
              </Box>
            </Box>



          </div>
        </div>

        {/* 첫 번째 테스트 결과와 두 번째 테스트 결과를 병렬로 배치 */}
        <div className={styles.testResultContainer}>
          {/* 첫 번째 테스트 결과 */}
          {results?.productEvaluation?.[0] && (
            <Box className={styles.testBox}>
              <Typography variant="h6" align="center" className={styles.testTitle}>
                첫 번째 테스트 결과
              </Typography>
              <Box className={styles.resultContent}>
                <Typography align="center" className={styles.resultTitle}>
                  <MovieIcon className={styles.icon} /> 영상 분석 결과 요약
                </Typography>
                <Box className={styles.resultText}>
                  {results.productEvaluation[0].commentEye || '눈 분석 결과 없음'}
                </Box>
              </Box>
              <Box className={styles.resultContent}>
                <Typography align="center" className={styles.resultTitle}>
                  <MicIcon className={styles.icon} /> 음성 분석 결과 요약
                </Typography>
                <Box className={styles.resultText}>
                  {results.productEvaluation[0].tone || ' 목소리 톤 분석 결과 없음'}
                </Box>
              </Box>
              <Button variant="contained" className={styles.detailButton} onClick={handleGoToFirstPage}>
                첫 번째 테스트 결과 자세히 보기 &gt;&gt;
              </Button>
            </Box>
          )}

          {/* 두 번째 테스트 결과 */}
          {results?.productEvaluation?.[1] && (
            <Box className={styles.testBox}>
              <Typography variant="h6" align="center" className={styles.testTitle}>
                두 번째 테스트 결과
              </Typography>
              <Box className={styles.resultContent}>
                <Typography align="center" className={styles.resultTitle}>
                  <MovieIcon className={styles.icon} /> 영상 분석 결과 요약
                </Typography>
                <Box className={styles.resultText}>
                  {results.productEvaluation[1].commentEye || '눈 분석 결과 없음'}
                </Box>
              </Box>
              <Box className={styles.resultContent}>
                <Typography align="center" className={styles.resultTitle}>
                  <MicIcon className={styles.icon} /> 음성 분석 결과 요약
                </Typography>
                <Box className={styles.resultText}>
                  {results.productEvaluation[1].tone || ' 목소리 톤 분석 결과 없음'}
                </Box>
              </Box>
              <Button variant="contained" className={styles.detailButton} onClick={handleGoToSecondPage}>
                두 번째 테스트 결과 자세히 보기 &gt;&gt;
              </Button>
            </Box>
          )}
        </div>
        <div >
          <button className={styles.button} onClick={() => navigate(`/aipage`)}>
            AI 홈으로 이동 &gt;&gt;
          </button>

          <button className={styles.button} style={{ marginLeft: '30px' }} onClick={() => navigate(`/mypage/guide/aiservice`)}>
            마이페이지로 이동 &gt;&gt;
          </button>
        </div>
      </div>
    ) : (
      <ResultPageDetail
        result={pageNumber === "1" ? results.productEvaluation[0] : results.productEvaluation[1]}
        videoUrls={videoUrls}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
      />
    )}
  </>



};

export default ResultFinalPage;
