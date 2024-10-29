import React, { useContext } from 'react';
import styles from '../styles/components/Footer.module.css'; // CSS 모듈 파일을 불러옵니다.
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { TemplateContext } from '../context/TemplateContext';


const Footer = ({ className, ...props }) => {
  const { setSearchKeyword } = useContext(TemplateContext);

  const navigate = useNavigate();

  // 페이지 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 버튼 클릭 시 페이지 이동 및 스크롤 처리
  const handleClick = (path) => {
    navigate(path);
    scrollToTop();
  };
  return (
    <div className={`${styles.footer} ${className}`}>
      <div className={styles.footerLeft} onClick={()=>{handleClick('/home')}}>
        <div className={styles.tripMaven}>TripMaven</div>
        <div className={styles.happyFindReporter}>
          <span>
            <span className={styles.happyFindReporterSpan}>
              여행 전문가들의 사이트
              <br />
            </span>
            <span className={styles.happyFindReporterSpan2}>Happy find reporter</span>
          </span>
        </div>
      </div>
      <div className={styles.footerRight}>
        <div className={styles.footerLinks}>
          <a className={styles.footerLink}><button className={styles.navButton} onClick={() => { handleClick('/termsservice') }}>이용약관</button></a>
          <span className={styles.bar}> | </span>
          <a className={styles.footerLink}><button className={styles.navButton} onClick={() => { handleClick('/siteinfo') }}>사이트소개</button></a>
          <span className={styles.bar}> | </span>
          <a className={styles.footerLink}><button className={styles.navButton} onClick={() => { handleClick('/mypage/askall') }}>1:1문의</button></a>
          <span className={styles.bar}> | </span>
          <a className={styles.footerLink}><button className={styles.navButton} onClick={() => { handleClick('/faq') }}>고객센터</button></a>
          <span className={styles.bar}> | </span>
          <a className={styles.footerLink}><button className={styles.navButton} onClick={() => { handleClick('/') }}>시작화면으로 돌아가기</button></a>
        </div>
      </div>
    </div>
  );
};

export default Footer;