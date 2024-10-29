import React from 'react';
import styles from '../../styles/login/PasswordChangeForm.module.css';
import { useNavigate } from 'react-router-dom';

const PasswordChangeForm = () => {
  
  const navigate = useNavigate();
  const membersId= localStorage.getItem('membersId');

  const handleClick = () => {
    navigate(`/mypage/${membersId}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>비밀번호 수정</h1>
      <p className={styles.subtitle}>계정확인을 위해 비밀번호를 입력해주세요.</p>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>기존 비밀번호 *</label>
          <input type="password" className={styles.input} placeholder="기존 비밀번호를 입력해주세요" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>새 비밀번호 *</label>
          <input type="password" className={styles.input} placeholder="새 비밀번호" />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>새 비밀번호 확인 *</label>
          <input type="password" className={styles.input} placeholder="새 비밀번호 확인" />
        </div>
        <div className={styles.buttons}>
          <button type="button" className={styles.cancelButton}>취소하기</button>
          <button type="submit" className={styles.submitButton} onClick={()=>handleClick()}>수정하기</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeForm;
