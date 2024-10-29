import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 가져옵니다.
import styles from '../../styles/error/Error404Page.module.css';

const Error404Page = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용하여 페이지 이동 처리

  const handleHomeClick = () => {
    navigate('/home'); // '/' 경로로 이동 (홈으로 이동)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 Not Found</h1>
      <img className={styles.image} src={require('../../images/sadcomputer.png')} alt="404 Error" />
      <p className={styles.message}>
        죄송합니다. 해당 페이지를 찾을 수 없습니다.<br />
        원하시는 결과를 찾을 수 없습니다. 올바른 URL을 입력하였는지 확인하세요.
      </p>
      <button className={styles.button} onClick={handleHomeClick}>
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default Error404Page;
