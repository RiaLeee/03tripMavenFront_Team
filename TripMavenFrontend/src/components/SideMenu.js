import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaQuestionCircle, FaFlag, FaPencilAlt, FaComments, FaRobot, FaStar, FaHeart } from 'react-icons/fa';
import styles from '../styles/components/SideMenu.module.css';
import { menuData } from '../config/MyPageEndPoint';
import { TemplateContext } from '../context/TemplateContext';

//메뉴 데이터 구조
const SideMenu = () => {
    const { role } = useContext(TemplateContext);
    //endpoint 받아오기(location.pathname)
    const location = useLocation();
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

    const getIcon = (name) => {
        const iconMap = {
            "내 정보 관리": <FaUser />,
            "회원 목록": <FaUsers />,
            "1:1문의 내역": <FaQuestionCircle />,
            "신고 내역": <FaFlag />,
            "내 게시물 관리": <FaPencilAlt />,
            "채팅방": <FaComments />,
            "AI 서비스": <FaRobot />,
            "이용후기": <FaStar />,
            "찜 목록": <FaHeart />,
        };
        return iconMap[name] || null;
    };
    // 나중에 로그인 구현되면 DecideSideMenu함수 쓰지 않아도 토큰에서 role을 받아와서 뿌려주면 됨(role: admin, guide, user)
    let menuItems = menuData[role];

    return (
        <div className={styles.layoutContainer}>
            <div className={styles.sidebar}>
                 <h2 className={styles.sidebarTitle}>MyPage</h2>
                 
                <ul>
                    {menuItems && menuItems.map((item, index) => {
                        if (item.name) {
                            const isActive = location.pathname.toLowerCase().includes(item.path.toLowerCase());
                            return (
                                <li key={index} className={`${styles.sidebarItem} ${isActive ? styles.active : ''}`}>
                                    <button
                                        className={styles.navButton}
                                        onClick={() => handleClick(item.path) }
                                    >
                                        <span className={styles.icon}>{getIcon(item.name)}</span>
                                        <span className={styles.label}>{item.name}<small>  </small></span>
                                    </button>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
            <div className={styles.mainContent}>
            </div>
        </div>
    );
};

export default SideMenu;
