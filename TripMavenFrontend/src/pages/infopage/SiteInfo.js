import React, { useEffect, useState, useRef } from 'react';
import styles from '../../styles/infopage/SiteInfo.module.css';

const SiteIntroduction = () => {
  const [visibleImages, setVisibleImages] = useState({}); // 각 요소의 가시성을 객체로 관리
  const elementsRef = useRef([]); // 모든 요소를 배열로 참조

  useEffect(() => {
    // 일반 요소들에 대한 Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleImages((prevVisibleImages) => ({
              ...prevVisibleImages,
              [entry.target.dataset.index]: true,
            }));
          } else {
            setVisibleImages((prevVisibleImages) => ({
              ...prevVisibleImages,
              [entry.target.dataset.index]: false,
            }));
          }
        });
      },
      {
        threshold: 0.6, // 60% 이상 보일 때 애니메이션 실행
      }
    );

    // siteInfoHeader에 대한 Observer
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleImages((prevVisibleImages) => ({
              ...prevVisibleImages,
              [entry.target.dataset.index]: true,
            }));
          } else {
            setVisibleImages((prevVisibleImages) => ({
              ...prevVisibleImages,
              [entry.target.dataset.index]: false,
            }));
          }
        });
      },
      {
        threshold: 0.2, // 20% 이상 보일 때 애니메이션 실행
      }
    );

    elementsRef.current.forEach((element) => {
      if (element) {
        if (element.dataset.index === "0") {
          headerObserver.observe(element); // siteInfoHeader에 대한 감지
        } else {
          observer.observe(element); // 일반 요소들에 대한 감지
        }
      }
    });

    return () => {
      if (elementsRef.current) {
        elementsRef.current.forEach((element) => {
          if (element) {
            if (element.dataset.index === "0") {
              headerObserver.unobserve(element); // siteInfoHeader 감지 중지
            } else {
              observer.unobserve(element); // 일반 요소 감지 중지
            }
          }
        });
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerImage} ref={(el) => (elementsRef.current[0] = el)} data-index="0">
        <div className={styles.headerImageText}>사이트 소개</div>
      </div>

      <div className={styles.content}>
        <img
          className={`${styles.logoImage} ${visibleImages["1"] ? styles.visible : ''}`}
          alt="TripMavenLogo"
          src="../../images/TripMavenLogo.png"
          data-index="1"
          ref={(el) => (elementsRef.current[1] = el)}
        />
        <p
          className={`${styles.description} ${visibleImages["2"] ? styles.visible : ''}`}
          data-index="2"
          ref={(el) => (elementsRef.current[2] = el)}
        >
          은 여행 가이드와 여행객 모두를 위한 사이트 입니다.
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <p
            className={`${styles.featureText} ${visibleImages["3"] ? styles.visible : ''}`}
            data-index="3"
            ref={(el) => (elementsRef.current[3] = el)}
          >
            <span style={{ fontSize: '27px', fontWeight: 'bold', color: '#0066ff' }}>
              AI 기술</span>을 활용해 데이터에 기반한 객관적인 평가를 수행하여<br />
            가이드의 말투, 행동, 대본을 평가하고, <br />
            추출된 장점 키워드를 통해 가이드 홍보도 가능합니다.
          </p>
          <img
            src="../../images/AI_Image.png"
            alt="AI 평가"
            className={`${styles.AI_Image} ${visibleImages["4"] ? styles.visible : ''}`}
            data-index="4"
            ref={(el) => (elementsRef.current[4] = el)}
          />
        </div>

        <div className={styles.feature}>
          <img
            src="../../images/tripImage.png"
            alt="여행 계획"
            className={`${styles.featureImage} ${visibleImages["5"] ? styles.visible : ''}`}
            data-index="5"
            ref={(el) => (elementsRef.current[5] = el)}
          />
          <p
            className={`${styles.featureText} ${visibleImages["6"] ? styles.visible : ''}`}
            data-index="6"
            ref={(el) => (elementsRef.current[6] = el)}
          >
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#0066ff' }}>
              가이드가 추천하는 여행 상품</span>을 통해 <br />
            숙소, 식당, 일정 등을 효율적으로 계획하여 불필요한 지출 없이<br />
            알찬 여행을 즐길 수 있도록 도와드립니다.
          </p>
        </div>

        <div className={styles.feature}>
          <p
            className={`${styles.featureText} ${visibleImages["7"] ? styles.visible : ''}`}
            data-index="7"
            ref={(el) => (elementsRef.current[7] = el)}
          >
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#0066ff' }}>OpenAI ChatGPT 기반의 챗봇</span>을 통해 실시간 응답과<br />
            대화 데이터 분석으로 사용자의 니즈와 행동 패턴을 파악하여<br />
            끊임 없는 대화 경험을 제공합니다.<br />
          </p>
          <img
            src="../../images/openAI.jpg"
            alt="openAI"
            className={`${styles.openAI_Image} ${visibleImages["8"] ? styles.visible : ''}`} // CSS 클래스명 수정
            data-index="8"
            ref={(el) => (elementsRef.current[8] = el)}
          />
        </div>

        <div className={styles.feature}>
          <div className={styles.textContainer}>
            <p
              className={`${styles.text} ${visibleImages["9"] ? styles.visible : ''}`}
              data-index="9"
              ref={(el) => (elementsRef.current[9] = el)}
            >
              최적의 여행 루트로 최고의 트립을 즐기고 싶은 분들을 위해<br />
              현재 최고 가이드들이 지역별로 여행 상품을 공개합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteIntroduction;
