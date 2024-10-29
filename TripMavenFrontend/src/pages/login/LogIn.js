import React, { useEffect, useState } from 'react';
import styles from '../../styles/login/Login.module.css';
import { NavLink } from 'react-router-dom';
import { FormLogin } from '../../utils/memberData';
import { v4 as uuidv4 } from 'uuid';

const Login = () => {
    const [formData, setFormData] = useState({email: '', password: ''});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await FormLogin(formData);
            // 로그인 성공 시 처리
            if (response) {
                window.location.href = '/home'; // 예시: 홈으로 리다이렉트
            } else {
                alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            alert(error.response.data.message);
        }

    };

    const googleLogin = async() => {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = process.env.REACT_APP_GOOGLE_URL; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.

        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&scope=email profile`;
    };

    const kakaoLogin = () => { 
        const clientId = process.env.REACT_APP_KAKAO_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = process.env.REACT_APP_KAKAO_URL; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&through_account=true`;
    };

    const naverLogin = () => {
        const clientId = process.env.REACT_APP_NAVER_CLIENT_ID; // 환경 변수에서 클라이언트 ID를 가져옵니다.
        const redirectUri = process.env.REACT_APP_NAVER_URL; // 리다이렉트 URI
        const encodedRedirectUri = encodeURIComponent(redirectUri); // 리다이렉트 URI를 인코딩합니다.
        const state = uuidv4();
        localStorage.setItem('naver_login_state', state);
        window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodedRedirectUri}&state=${encodeURIComponent(state)}`;
    };

    // 엔터키로 로그인
    const handleEnterPress = async(event) => {
        if (event.key === 'Enter') {
            try {
                const response = await FormLogin(formData);
    
                // 로그인 성공 시 처리
                if (response) {
    
                    window.location.href = '/home'; // 예시: 홈으로 리다이렉트
                } else {
                    alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
                }
            } catch (error) {
                console.error('로그인 요청 중 오류 발생:', error);
            }
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.loginBox}>
                    <h1 className={styles.title}>로그인</h1>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">이메일</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="이메일 입력" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="비밀번호 입력" onKeyDown={handleEnterPress}/>
                    </div>
                    {/* <div className={styles.options}>
                        <div className={styles.autoLogin}>
                            <input type="checkbox" id="auto-login" checked={autoLogin} onChange={handleAutoLoginChange} />
                            <label htmlFor="auto-login">자동 로그인</label>
                        </div>
                    </div> */}
                    <button className={styles.loginButton} onClick={handleLogin}>로그인</button>
                    <div className={styles.extraOptions}>
                        <NavLink className={styles.extraOption} to="/login/signup" >회원가입</NavLink>
                        <span className={styles.separator}>|</span>
                        <NavLink className={styles.extraOption} to="/login/findpassword1">비밀번호 찾기</NavLink>
                    </div>
                    <div className={styles.snsLogin}>
                        <span className={styles.snsLoginText}>SNS 간편 로그인</span>
                        <div className={styles.snsIcons}>
                            {/* 각 SNS 아이콘에 클릭 이벤트 핸들러 설정 */}
                            <img src="/images/google.png" alt="Google" className={styles.snsIcon} onClick={googleLogin} />
                            <img src="/images/naver.png" alt="Naver" className={styles.snsIcon} onClick={naverLogin} />
                            <img src="/images/kakao.png" alt="Kakao" className={styles.snsIcon} onClick={kakaoLogin} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
