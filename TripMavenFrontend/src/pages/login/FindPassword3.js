import React, { useRef, useState } from 'react';
import styles from '../../styles/login/FindPassword3.module.css';
import { useLocation } from 'react-router-dom';
import { updateProfile } from '../../utils/memberData';

const FindPassword3 = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const id = searchParams.get('id');
  const passwordRef = useRef('');
  const passwordconfirmRef = useRef('');
  const [error, setError] = useState({
    passwordError: '',
    passwordConfirmError: ''
  });

  const valid = () => {
    let isValid = true;

    // 비밀번호가 6자 이상인지 확인
    if (passwordRef.current.value.length < 6) {
      setError((prevErrors) => ({ ...prevErrors, passwordError: '비밀번호는 최소 6자 이상이어야 합니다.' }));
      isValid = false;
    } else {
      setError((prevErrors) => ({ ...prevErrors, passwordError: '' }));
    }

    // 새 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (passwordRef.current.value !== passwordconfirmRef.current.value) {
      setError((prevErrors) => ({ ...prevErrors, passwordConfirmError: '비밀번호가 일치하지 않습니다.' }));
      isValid = false;
    } else {
      setError((prevErrors) => ({ ...prevErrors, passwordConfirmError: '' }));
    }

    return isValid;
  }

  const handleClick = (e) => {
    e.preventDefault();
    if (!valid()) return;
    updateProfile(id, { 'password': passwordRef.current.value })
      .then(() => {
        alert('비밀번호 변경이 완료되었습니다.');
        window.location.href = `http://localhost:58337/login`;
      })
      .catch(() => alert('비밀번호 변경이 실패되었습니다.'));
  }

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick(e);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>비밀번호 재설정</h1>

      <div className={styles.section}>
        <p className={styles.subtitle}>
          트립 메이븐 아이디 : <span className={styles.username}>{email}</span>
        </p>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <input 
              type="password" 
              className={styles.input} 
              ref={passwordRef} 
              placeholder="새 비밀번호" 
            />
            {error.passwordError && <p className={styles.error}>{error.passwordError}</p>}
          </div>
          <div className={styles.formGroup}>
            <input 
              type="password" 
              className={styles.input} 
              ref={passwordconfirmRef} 
              placeholder="새 비밀번호 확인" 
              onKeyDown={handleEnterPress} 
            />
            {error.passwordConfirmError && <p className={styles.error}>{error.passwordConfirmError}</p>}
          </div>
        </form>
        <p className={styles.note}>
          - 영문, 숫자, 특수문자를 함께 사용하면 (8자 이상 16자 이하)보다 안전합니다.<br />
          - 다른 사이트와 다른 트립메이븐의 아이디와의 비밀번호를 만들어 주세요.
        </p>
      </div>

      <button type="button" className={styles.submitButton} onClick={handleClick}>확인</button>
    </div >
  );
};

export default FindPassword3;
