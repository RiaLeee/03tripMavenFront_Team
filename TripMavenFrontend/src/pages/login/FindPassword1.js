import React, { useRef, useState } from 'react';
import styles from '../../styles/login/FindPassword1.module.css';
import { useNavigate } from 'react-router-dom';
import { findMemberbyEmail } from '../../utils/memberData';

const FindPassword1 = () => {
  const navigate = useNavigate();
  const emailRef = useRef('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 관리

  const handleClick = async (e) => {
    e.preventDefault();
    
    try {
      const res = await findMemberbyEmail(emailRef.current.value);
      
      // 이메일이 있으면 다음 단계로 이동, 없으면 에러 메시지 표시
      if (res && emailRef.current.value === res.email) {
        setErrorMessage(''); // 에러 메시지 초기화
        navigate(`/login/findpassword2?email=${res.email}&id=${res.id}`);
      } else {
        setErrorMessage('입력하신 회원정보를 찾을 수 없습니다.'); // 이메일이 없을 경우
      }
    } catch (error) {
      // 400 에러 처리
      if (error.response && error.response.status === 400) {
        setErrorMessage('입력하신 회원정보를 찾을 수 없습니다.');
      } else {
        setErrorMessage('오류가 발생했습니다. 다시 시도해주세요.'); // 기타 오류
      }
    }
  }

  const handleEnterPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick(e);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>TripMaven</h1>
      <p className={styles.subtitle}>비밀번호를 찾고자 하는 아이디를 입력해주세요.</p>
      <form className={styles.form}>
        <input 
          type="text" 
          className={styles.input} 
          ref={emailRef} 
          placeholder="아이디를 입력해주세요." 
          onKeyDown={handleEnterPress} 
        />
        <button 
          type="button" 
          className={styles.submitButton} 
          onClick={handleClick}
        >
          다음
        </button>
      </form>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} {/* 에러 메시지 출력 */}
    </div>
  );
};

export default FindPassword1;
