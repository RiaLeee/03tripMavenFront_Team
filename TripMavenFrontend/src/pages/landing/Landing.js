import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from '../../styles/landing/Landing.module.css';
import Footer from '../../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faRobot, faCompass, faMapMarkedAlt, faChartLine, faBullhorn, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
// Import images
import locationGif from '../../images/Location.gif';
import envelopeGif from '../../images/Envelope.gif';
import telephoneGif from '../../images/Telephone.gif';
import sttIcon from '../../images/STT.gif';
import nlpIcon from '../../images/NLP.gif';
import multimodalIcon from '../../images/MM.gif';
import beachWithBoats from '../../images/trip.jpg';
import koreamap from '../../images/Event.png';
import santoriniView from '../../images/travel.jpg';
import scrollTopGif from '../../images/scroll-top.gif';
import { logout } from '../../utils/memberData';

const TravelLandingPage = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isNavbarShrunk, setIsNavbarShrunk] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showPage, setShowPage] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animatedSections, setAnimatedSections] = useState({});
  const navigate = useNavigate();

  const wordColors = [
    { word: '경험', color: '#FF6B6B' },
    { word: '추억', color: '#4ECDC4' },
    { word: '계획', color: '#FE2E9A' }, 
    { word: '여정', color: '#FF8C00' }  
  ];

  const sectionRefs = {
    about: useRef(null),
    features: useRef(null),
    newsFeatures: useRef(null),
  };

  const handleLogout = () => {
    logout().then(res => {
      localStorage.clear();
      navigate('/home');
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarShrunk(window.scrollY > 100);
      setShowScrollTop(window.scrollY > 300);
    };

    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsNavCollapsed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    const elements = document.querySelectorAll(`.${styles.fadeIn}`);
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(styles.visible);
      }, 200 * index);
    });

    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % wordColors.length);
    }, 2000);

    const observers = {};

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      observers[key] = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setAnimatedSections((prev) => ({ ...prev, [key]: true }));
              observers[key].unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observers[key].observe(ref.current);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartClick = () => {
    setShowPage(false);
    setTimeout(() => navigate('/home'), 300);
  };

  return (
    <CSSTransition
      in={showPage}
      timeout={300}
      classNames={{
        enter: styles.fadeEnter,
        enterActive: styles.fadeEnterActive,
        exit: styles.fadeExit,
        exitActive: styles.fadeExitActive,
      }}
      unmountOnExit
    >
    <div className={styles.pageWrapper} id="page-top">
        <nav className={`${styles.navbar} ${isNavbarShrunk ? styles.navbarShrink : ''}`}>
          <div className={styles.navbarContainer}>
            <a className={styles.navbarBrand} href="#page-top" onClick={() => navigate('/home')}>TripMaven</a>
            <button className={styles.navbarToggler} type="button" onClick={handleNavCollapse}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <ul className={`${styles.navbarNav} ${!isNavCollapsed ? styles.show : ''}`}>
              <li className={styles.navItem}><a className={styles.navLink} href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
              <li className={styles.navItem}><a className={styles.navLink} href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
              <li className={styles.navItem}><a className={styles.navLink} href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              {!localStorage.getItem("token") ?
                <li className={styles.navItem}><a className={styles.navLink} href="/login">Login</a></li>
                :
                <li className={styles.navItem}><a className={styles.navLink} onClick={handleLogout} href="/home">Logout</a></li>
              }
            </ul>
          </div>
        </nav>

        <div className={styles.contentWrapper}>
          <div className={styles.travelPage}>
            <div className={styles.heroSection}>
              <div className={styles.heroTitle}>
                <h1 className={styles.glowTitle}>
                  <span className={`${styles.glowLetter} ${styles.glowLeft}`} style={{animationDelay: '0s'}}>T</span>
                  <span className={`${styles.glowLetter} ${styles.glowRight}`} style={{animationDelay: '0.2s'}}>R</span>
                  <span className={`${styles.glowLetter} ${styles.glowLeft}`} style={{animationDelay: '0.4s'}}>I</span>
                  <span className={`${styles.glowLetter} ${styles.glowRight}`} style={{animationDelay: '0.6s'}}>P</span>
                  <span className={`${styles.glowLetter} ${styles.glowRight}`} style={{animationDelay: '1s'}}>M</span>
                  <span className={`${styles.glowLetter} ${styles.glowLeft}`} style={{animationDelay: '1.2s'}}>A</span>
                  <span className={`${styles.glowLetter} ${styles.glowRight}`} style={{animationDelay: '1.4s'}}>V</span>
                  <span className={`${styles.glowLetter} ${styles.glowLeft}`} style={{animationDelay: '1.6s'}}>E</span>
                  <span className={`${styles.glowLetter} ${styles.glowRight}`} style={{animationDelay: '1.8s'}}>N</span>
                </h1>
              </div>
              <div className={`${styles.heroLeft} ${styles.fadeIn}`}>
                <h1 className={`${styles.heroTitle} ${styles.heroTitleLeft}`}>관광객을 위한 서비스</h1>
                <ul className={`${styles.heroList} ${styles.heroListLeft}`}>
                  <li><FontAwesomeIcon icon={faRobot} /> AI 챗봇으로 스마트한 정보 획득</li>
                  <li><FontAwesomeIcon icon={faCompass} /> 다양한 가이드 상품 비교 및 선택</li>
                  <li><FontAwesomeIcon icon={faMapMarkedAlt} /> 맞춤형 지역 정보로 여행 계획 수립</li>
                </ul>
              </div>
              <div className={`${styles.heroRight} ${styles.fadeIn}`}>
                <h1 className={`${styles.heroTitle} ${styles.heroTitleRight}`}>가이드를 위한 플랫폼</h1>
                <ul className={`${styles.heroList} ${styles.heroListRight}`}>
                  <li><FontAwesomeIcon icon={faChartLine} /> AI 기반 맞춤형 능력 향상 피드백</li>
                  <li><FontAwesomeIcon icon={faBullhorn} /> 실시간 AI 상품 평가 및 홍보 지원</li>
                  <li><FontAwesomeIcon icon={faUserPlus} /> 간편한 가이드 등록 및 상품 등록</li>
                </ul>
              </div>
              <div className={styles.heroButtonWrapper}>
                <a href="#" className={`${styles.btn2} ${styles.fadeIn}`} onClick={(e) => { e.preventDefault(); handleStartClick(); }}>
                  <span>시작하기</span>
                </a>
              </div>
            </div>

            {/* About section */}
            <div 
              className={`${styles.section} ${styles.tealSection} ${animatedSections.about ? styles.animated : ''}`} 
              id="about"
              ref={sectionRefs.about}
            >
              <div className={`${styles.container} ${styles.flexContainer}`}>
                <div className={`${styles.flexHalf} ${styles.textContent}`}>
                  <h2 className={`${styles.sectionTitle} ${styles.fadeInLeft}`}>소개를 하자면...</h2>
                  <p className={`${styles.sectionText} ${styles.fadeInLeft}`}>
                    "MAVEN"은 영어로 '전문가'를 뜻합니다 <br/>
                    저희는 AI를 활용하여 여러분께 잊지 못할 <br/> 최적의 여행
                    <span className={styles.wordRotator}>
                      {wordColors.map((item, index) => (
                        <span
                          key={item.word}
                          className={`${styles.rotatingWord} ${index === currentWordIndex ? styles.visible : ''}`}
                          style={{ color: item.color }}
                        >
                          {item.word}
                        </span>
                      ))}
                    </span>
                    을 선사합니다
                  </p>
                </div>
                <div className={`${styles.flexHalf} ${styles.imageWrapper} ${styles.fadeInRight}`}>
                  <img src={beachWithBoats} alt="Beach with boats" className={styles.sectionImage} />
                </div>
              </div>
            </div>

            {/* Features section */}
            <div 
              className={`${styles.section} ${styles.darkTealSection} ${animatedSections.features ? styles.animated : ''}`}
              ref={sectionRefs.features}
            >
              <div className={`${styles.container} ${styles.flexContainer}`}>
                <div className={`${styles.flexHalf} ${styles.textContent}`}>
                  <h2 className={`${styles.sectionTitle} ${styles.fadeInLeft}`}>고객을 위한 TripMaven의 기능</h2>
                  <p className={`${styles.sectionText} ${styles.fadeInLeft}`}>
                    지역만 검색하면 날씨와 행사들을 확인할 수 있습니다 <br/>
                    고객님이 가고자 하는 곳 어디든,<br/> 고객님에게 맞는 가이드가 있습니다
                  </p>
                </div>
                <div className={`${styles.flexHalf} ${styles.imageWrapper} ${styles.fadeInRight}`}>
                  <img src={koreamap} alt="Tropical beach" className={styles.sectionImage} />
                </div>
              </div>
            </div>

            {/* News Features section */}
            <div 
              className={`${styles.section} ${styles.brightTealSection} ${animatedSections.newsFeatures ? styles.animated : ''}`} 
              id="features"
              ref={sectionRefs.newsFeatures}
            >
              <div className={styles.container}>
                <div className={styles.newsFeaturesTitleContainer}>
                  <h2 className={`${styles.sectionTitle} ${styles.center} ${styles.fadeInRight}`}>
                    가이드를 위한 TripMaven의 기능
                  </h2>
                  <p className={`${styles.sectionSubtitle} ${styles.fadeInLeft}`}>
                    저희는 행동, 시선, 표정을 평가하여 가이드 님의 능력을 향상시켜줍니다<br />
                    여행지 소개, 고객 응대 등을 평가받고 여러분의 능력을 향상시켜 보세요!
                  </p>
                </div>
                <div className={styles.featuresContainer}>
                  {[
                    { title: '음성인식 기술 (STT)', icon: sttIcon, description: '음성을 텍스트로 변환하는 STT 기술' },
                    { title: '자연어 처리기술(NLP)', icon: nlpIcon, description: '말을 분석 및 이해하는 NLP 기술' },
                    { title: '멀티모달 기술', icon: multimodalIcon, description: '다양한 유형의 데이터를 동시 처리하는 기술 ' }
                  ].map((feature, index) => (
                    <div key={index} className={`${styles.featureCard} ${styles.fadeInUpCard}`}>
                      <img src={feature.icon} alt={feature.title} className={styles.featureIcon} />
                      <div className={styles.featureContent}>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Us section */}
            <div className={styles.contactSection} id="contact">
              <div className={styles.contactImageWrapper}>
              <img src={santoriniView} alt="World map with travel items" className={styles.contactImage} />
              <h2 className={styles.contactTitle}>Contact Us</h2>
              </div>
              <div className={styles.contactInfoWrapper}>
              <h2 className={styles.contactInfoTitle}>연락처</h2>
              <div className={styles.contactInfo}>
                <div className={styles.infoGroup}>
                <img src={locationGif} alt="Location" className={styles.icon} />
                <span className={styles.infoText}>한국 ICT 인재 개발원</span>
                </div>
                <div className={styles.infoGroup}>
                <img src={telephoneGif} alt="Telephone" className={styles.icon} />
                <span className={styles.infoText}>02-739-7235</span>
                </div>
                <div className={styles.infoGroup}>
                <img src={envelopeGif} alt="Envelope" className={styles.icon} />
                <span className={styles.infoText}>tripmaven1234@gmail.com</span>
                </div>
              </div>
              </div>
            </div>
            </div>
          </div>
          <Footer />

        {showScrollTop && (
          <button className={styles.scrollTopButton} onClick={scrollToTop}>
            <img src={scrollTopGif} alt="Scroll to top" className={styles.scrollTopIcon} />
          </button>
        )}
      </div>
    </CSSTransition>
  );
};

export default TravelLandingPage;
