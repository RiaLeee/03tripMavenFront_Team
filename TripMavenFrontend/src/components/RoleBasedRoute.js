// RoleBasedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { TemplateContext } from "../context/TemplateContext"; // TemplateContext 가져오기

// RoleBasedRoute 컴포넌트: role이 일치하지 않는 사용자를 리다이렉트
const RoleBasedRoute = ({ element, requiredRole }) => {
    // TemplateContext에서 role 가져오기
    const { role } = useContext(TemplateContext);

    // role이 requiredRoles에 포함되어 있는지 확인
    if (!requiredRole.includes(role)) {
        alert('권한이 없습니다.');
        return <Navigate to="/home" />; // 권한이 없을 경우 /home으로 리다이렉트
    }

    // role이 포함되어 있으면 원하는 컴포넌트 렌더링
    return element;
};

export default RoleBasedRoute;