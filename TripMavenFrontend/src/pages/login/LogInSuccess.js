import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LoginSuccess = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    useEffect(() => {
        const access = query.get('access');
        const refresh = query.get('refresh');
        const role = query.get('role');
        const membersId = query.get('membersId');
        if (access && refresh) {
            // JWT 토큰과 사용자 정보를 로컬 스토리지에 저장합니다.
            window.localStorage.setItem("token", access);
            window.localStorage.setItem("role", role);
            window.localStorage.setItem("membersId", membersId);
            window.localStorage.setItem("refresh", refresh);
            // 원하는 페이지로 리다이렉트합니다.
            window.location.href = `http://localhost:58337/home`;
        }
    }, [query]);

    return (
        <div>
            <p>로그인 성공! 리다이렉트 중...</p>
        </div>
    );
};

export default LoginSuccess;
