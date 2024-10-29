import React, { useState, useEffect } from 'react';
import styles from '../../styles/login/FindPassword2.module.css';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 훅 추가
import { findMemberbyEmail, sendEmailCode, verifyEmailCode } from '../../utils/memberData';

const FindPassword2 = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(queryParams.get('email') || ''); // 쿼리 파라미터에서 이메일 가져오기
  const [code, setCode] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [codeErrorMessage, setCodeErrorMessage] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isMemberValid, setIsMemberValid] = useState(true);
  const [codeInputErrorMessage, setCodeInputErrorMessage] = useState(''); // 인증번호 입력 여부 에러 메시지
  const [memberId, setMemberId] = useState(''); // Member ID를 저장하기 위한 상태 추가
  const [buttonText, setButtonText] = useState('코드 전송');
  const [timer, setTimer] = useState(0); // 타이머 상태 추가
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 비활성화 상태 추가
  const navigate = useNavigate();
  let interval = null; // 타이머를 위한 변수

  useEffect(() => {
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isCodeSent) {
      setButtonText('코드 재전송');
      setIsButtonDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, isCodeSent]);

  const startTimer = () => {
    setTimer(60); // 타이머 1분 설정
    setIsButtonDisabled(true); // 타이머가 돌아가는 동안 버튼 비활성화
  };

  // 타이머를 MM:SS 형식으로 변환하는 함수
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleSendCode = async () => {
    // 타이머는 코드 전송 버튼을 누르자마자 시작
    startTimer();
    try {
      const member = await findMemberbyEmail(email);

      if (!member || member.name !== name) {
        setEmailErrorMessage('입력하신 회원정보를 찾을 수 없습니다.');
        setIsMemberValid(false);
        setIsButtonDisabled(false); // 실패 시 버튼 다시 활성화
        clearInterval(interval); // 타이머 중단
        return;
      }

      await sendEmailCode(email);
      setIsCodeSent(true);
      setIsMemberValid(true);
      setMemberId(member.id); // Member ID를 저장
      setEmailErrorMessage('');
      setButtonText('코드 전송 중...');
      alert('인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      setEmailErrorMessage('이메일 전송 중 오류가 발생했습니다.');
      setIsCodeSent(false); // 실패 시 다시 코드 전송 가능하게 설정
      setIsButtonDisabled(false); // 타이머 종료
      clearInterval(interval); // 타이머 중단
      setTimer(0);
      console.error('이메일 전송 중 오류 발생: ', error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const isValid = await verifyEmailCode(email, code);
      setIsCodeValid(isValid);
      if (!isValid) {
        setCodeErrorMessage('인증번호가 일치하지 않습니다.');
      } else {
        setCodeErrorMessage('');
        setCodeInputErrorMessage(''); // 성공적으로 인증되었을 때 모든 에러 메시지 제거
      }
    } catch (error) {
      console.error('인증번호 검증 중 오류 발생: ', error);
      setCodeErrorMessage('인증번호 검증 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 입력 시 실시간 유효성 검사
  useEffect(() => {
    if (code.length === 6) {
      handleVerifyCode();  // 인증번호가 6자리일 때 유효성 검사 수행
    }
  }, [code]);

  // 다음 버튼 클릭 시 처리
  const handleNext = async () => {
    if (!code) {
      setCodeInputErrorMessage('인증번호를 입력해주세요.');
    } else {
      setCodeInputErrorMessage(''); // 인증번호가 입력된 경우 에러 메시지 제거
      await handleVerifyCode();  // 유효성 검사를 다시 확인
      if (isCodeValid) {
        navigate(`/login/findpassword3?email=${email}&id=${memberId}`); // 이메일과 ID를 쿼리 파라미터로 전달
      } else {
        setCodeErrorMessage('인증번호가 올바르지 않습니다.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>비밀번호 찾기</h1>

      <div className={styles.section}>
        <label className={styles.radioLabel}>회원정보에 등록한 이메일로 인증</label>
        <p className={styles.description}>
          회원정보에 등록한 이메일과 입력하신 이메일이 같아야, 인증번호를 받을 수 있습니다.
        </p>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>이름</label>
            <input
              type="text"
              className={styles.input}
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>이메일</label>
            <div className={styles.inputWithButton}>
              <input
                type="text"
                className={styles.inputEmail}
                placeholder="이메일을 입력하세요"
                value={email}
                disabled // 이메일 필드를 수정할 수 없게 설정
              />
              <button
                type="button"
                className={styles.codeButton}
                onClick={handleSendCode}
                disabled={isButtonDisabled || !isEmailValid} // 버튼 비활성화 및 타이머 동작 중 비활성화
              >
                {buttonText}
              </button>
            </div>
            {/* 타이머가 돌아갈 때 남은 시간을 버튼 아래에 표시 */}
            {timer > 0 && (
              <p className={styles.timer}>{formatTime(timer)}</p>
            )}
            {/* 이메일 형식 오류 또는 회원 정보 없음 메시지 */}
            {emailErrorMessage && (
              <p className={styles.errorMessage}>{emailErrorMessage}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="인증번호 6자리 숫자 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {/* 인증번호 입력 여부 메시지 */}
            {codeInputErrorMessage && <p className={styles.errorMessage}>{codeInputErrorMessage}</p>}
            {/* 인증 결과 메시지 표시 */}
            {codeErrorMessage && <p className={styles.errorMessage}>{codeErrorMessage}</p>}
            {isCodeValid === true && <p className={styles.successMessage}>인증번호가 일치합니다.</p>}
          </div>
          <p className={styles.note}>
            인증번호가 오지 않는다면 스팸 메일로 등록되어 있는 것은 아닌지 확인해주세요.
          </p>
        </form>
      </div>

      <button
        type="button"
        className={styles.submitButton}
        onClick={handleNext} // 다음 버튼 클릭 시 처리
      >
        다음
      </button>
    </div>
  );
};

export default FindPassword2;
