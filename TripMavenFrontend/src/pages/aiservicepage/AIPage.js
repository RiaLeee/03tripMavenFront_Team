import React, { useEffect, useState } from 'react';
import aiInfoStyles from '../../styles/aiservicepage/AIServiceInfo.module.css';
import aiServiceStyles from '../../styles/aiservicepage/AIService.module.css';
import mockTestImage from '../../images/mockTestImage.png'; // replace with actual path
import realTestImage from '../../images/realTestImage.png'; // replace with actual path
import { useNavigate } from 'react-router-dom';
import QuizTutorial from '../aiservicepage/QuizTutorial'; // QuizTutorial 경로로 변경 필요
import { Modal } from '@mui/material'; // MUI의 Modal 컴포넌트 추가

import aiPageFlowImage from '../../images/aiPageFlow/dd.png';
import AiPageFlow from './AiPageFlow';


const CombinedPage = () => {
  const navigate = useNavigate();
  const [isQuizModalOpen, setQuizModalOpen] = useState(false); // 모달 상태 추가

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 페이지가 마운트될 때 스크롤을 맨 위로 이동
  useEffect(() => {
    scrollToTop();
  }, []);

  // 버튼 클릭 시 페이지 이동 및 스크롤 처리
  const handleClick = (path) => {
    navigate(path);
    scrollToTop();
  };

  // 모달 열기 및 닫기
  const handleOpenQuizModal = () => setQuizModalOpen(true);
  const handleCloseQuizModal = () => setQuizModalOpen(false);

  const handleQuizCardClick = () => {
    handleOpenQuizModal();
  };

  return (
    <div>
      {/* AIServiceInfo 섹션 */}

      <div className={aiInfoStyles.container}>
        <div className={aiInfoStyles.title}>
          <img src="../../../images/TripMavenLogo.png" alt="TripMaven Logo" className={aiInfoStyles.logoImage} /> 
          의 AI는 당신의 여행 가이드 실력을<br /> 한 단계 업그레이드합니다!
        </div>
        <div className={aiInfoStyles.infoContainer}>
          <div className={aiInfoStyles.sttContainer}>
            <img
              src={aiPageFlowImage}
              alt='ai 페이징'
              style={{ width: '100%', height: 'auto', display: 'block', margin: '0' }} // 인라인 스타일 적용
            />
          </div>
        </div>
        <AiPageFlow />



        {/* <div className={aiInfoStyles.infoContainer}>
          <div className={aiInfoStyles.sttContainer}>
            <img src="../../../images/STT.png" alt='STT 음성 인식 기술' className={aiInfoStyles.sttImage}/>
          </div>
          <div className={aiInfoStyles.nlpContainer}>
            <img src="../../../images/NLP.png" alt='NLP' className={aiInfoStyles.nlpImage}/>
          </div>
        </div> */}

        <h3 className={aiInfoStyles.description}>
          TripMaven의 AI는 말과 행동, 시선, 표정을 분석할 수 있고 나만을 위한 맞춤형 퀴즈도 제작해줍니다.<br />
          여행지 소개, 고객 응대 등 다양한 스킬을 평가받고 항상시켜 보세요.
        </h3>
      </div>

      {/* AIService 섹션 */}
      <div className={aiServiceStyles.container}>
        <div className={aiServiceStyles.quizcardContainer} onClick={handleQuizCardClick}>
          <div className={aiServiceStyles.quizcard}>
            <div className={aiServiceStyles.quizContainer}>
              <img src={"../../images/quizImg.png"} alt="Quiz" className={aiServiceStyles.quizImage} />
              <div className={aiServiceStyles.textContainer}>
                <h2 className={aiServiceStyles.quizTitle}>
                  <small style={{ fontSize: '15px' }}>AI와 함께하는</small><br />퀴즈 맞추기
                </h2>
                <p className={aiServiceStyles.quizDescription}>
                  여행지 가이드 실력을 연습하고 싶다면?<br />모의 테스트로 준비하세요!
                </p>
              </div>
            </div>
            <div className={aiServiceStyles.arrowContainer}>
              <button className={aiServiceStyles.arrowButton} onClick={handleOpenQuizModal}><span>→</span></button>
            </div>
          </div>
        </div>
        <div className={aiServiceStyles.cardContainer}>
          <div className={aiServiceStyles.card}>
            <div className={aiServiceStyles.cardImage}>
              <img src={mockTestImage} alt="Mock Test" style={{ width: '215px' }} />
            </div>
            <h2 className={aiServiceStyles.cardTitle}>발음 테스트</h2>
            <p className={aiServiceStyles.cardDescription}>
              정확한 발음을 연습하고 싶다면?<br />AI가 맞춤 제작한 발음 테스트로<br />
              자신 있게 도전해보세요!
            </p>
            <button className={aiServiceStyles.button} onClick={() => { handleClick('/pronunciationtesttutorial') }}>시작하기</button>
          </div>
          <div className={aiServiceStyles.card}>
            <div className={aiServiceStyles.cardImage}>
              <img src={realTestImage} alt="Real Test" style={{ width: '220px', marginRight: '20px' }} />
            </div>
            <h2 className={aiServiceStyles.cardTitle}>실전 테스트</h2>
            <p className={aiServiceStyles.cardDescription}>
              내 여행지 소개 실력을 평가받고 싶다면?<br />실전 테스트로 도전하세요!
            </p>
            <button className={aiServiceStyles.button} onClick={() => { handleClick('/precautionspage1') }} style={{ marginTop: '35px' }}>시작하기</button>

          </div>

          {/* 모달 추가 */}
          <Modal open={isQuizModalOpen} onClose={handleCloseQuizModal}>
            <div className={aiServiceStyles.modalContent}>
              <QuizTutorial userId={null} /> {/* 필요한 경우 userId 전달 */}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CombinedPage;
