import React, { useContext, useEffect, useState } from 'react';
import styles from '../styles/components/Header.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { menuData } from '../config/MyPageEndPoint';
import { TemplateContext } from '../context/TemplateContext';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import GuideRegistration from '../pages/registerguidepage/RegisterGuide';
import { IconButton, Badge, Typography, Avatar } from '@mui/material';
import { fetchedData, logout } from '../utils/memberData';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styled from '@emotion/styled';
import { readNotification } from '../utils/NotificationData';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '0px',
    width: 1200,
    height: '85vh',
    bgcolor: 'background.paper',
    border: '1px solid primary',
    borderRadius: '16px',
    boxShadow: 24,
    overflow: 'hidden',
};

const NotificationPopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const NotificationItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #f5f5f5;
  }
`;

const NotificationTitle = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const convertNotificationType = {
    'chat': '채팅',
    'review': '리뷰'
}


//알림 컴포넌트
//헤더 컴포넌트에서 받아올 알림 상태
const NotificationComponent = () => {
    const { notifications, setNotifications, notificationCount } = useContext(TemplateContext);
    const [updatedNotifications,setUpdatedNotifications] = useState(notifications);
    useEffect(() => {
        const fetchSenderNames = async () => {
            try {
                // 각 알림의 memberId로 이름을 가져옴
                const updatedNotificationsWithNames = await Promise.all(
                    notifications.map(async (notification) => {
                        // 각 notification의 memberId로 이름을 가져옴
                        const senderData = await fetchedData(notification.senderId);
                        return {
                            ...notification,
                            senderName: senderData.name, // senderName 추가
                        };
                    })
                );
                setUpdatedNotifications(updatedNotificationsWithNames); // 이름이 추가된 알림으로 상태 업데이트
            } catch (error) {
                console.error('Error fetching sender names:', error);
            }
        };

        if (notifications.length > 0) {
            fetchSenderNames();
        }
    }, [notifications]);

    const navigate = useNavigate();
    //알림 펼치기 여부 상태
    const [showNotifications, setShowNotifications] = useState(false);

    //알림 펼치기
    const handleClick = () => {
        setShowNotifications(!showNotifications);
    };

    //알림 내용 눌렀을때
    const handleNotificationClick = (noti) => {
        //console.log(noti);
        //누른 알림 상태리스트에서 삭제
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== noti.id)
        );
        //알림테이블에서 읽음처리로 수정하기
        readNotification(noti.content[0]);
        setShowNotifications(false);
        navigate(noti.link);
    };

    //알림 모션
    const ringAnimation = notificationCount > 0 ? `
        @keyframes ring {
            0% { transform: rotate(0); }
            5% { transform: rotate(5deg); }
            10% { transform: rotate(-5deg); }
            15% { transform: rotate(5deg); }
            20% { transform: rotate(-5deg); }
            25% { transform: rotate(0); }
            100% { transform: rotate(0); }
        }
    ` : '';

    return (
        <div style={{ position: 'relative' }}>
            <IconButton
                onClick={handleClick}
                style={{
                    transition: 'transform 0.3s ease',
                    animation: notificationCount > 0 ? 'ring 2s infinite' : 'none',
                }}
            >
                <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <style>
                {ringAnimation}
            </style>
            {showNotifications && (
                <NotificationPopup style={{ width: "200px" }}>
                    {notificationCount > 0 ? (
                        updatedNotifications.map((notification) => {
                            //console.log(notification);
                            return (
                                <NotificationItem
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <NotificationTitle style={{ display: 'inline' }}>{convertNotificationType[notification.type]}</NotificationTitle>
                                    <Typography variant="caption" style={{ display: 'inline', color: 'gray' }}>{` ${new Date().toLocaleDateString() == new Date(notification.createAt + 'Z').toLocaleDateString() ? '' : new Date(notification.createAt + 'Z').toLocaleDateString().slice(6, -1)} ${new Date(notification.createAt + 'Z').toLocaleTimeString().slice(0, -3)}`}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingRight: '10px' }}>
                                        <Typography variant="body2" style={{ fontWeight: 'bold' }}>{notification.senderName}</Typography>
                                        {/*
                                    <Typography variant="body2" >{notification.content[0].content}</Typography>
                                    <Typography variant="body2" style={{fontWeight: 'bold', color: 'red'}}>{notification.type=='chat' && notification.content.length}</Typography>
                                    */}
                                        {notification.type == 'chat' && (
                                            <span className="badge rounded-pill bg-danger" style={{ fontSize: '11px' }}>{notification.type == 'chat' && notification.content.length}</span>
                                        )}
                                    </Box>
                                </NotificationItem>
                            )
                        })
                    ) : (
                        <NotificationItem>
                            <Typography variant="body2">알림이 없습니다</Typography>
                        </NotificationItem>
                    )}
                </NotificationPopup>
            )}
        </div>
    );
};

//헤더 컴포넌트
const Header = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState(''); //검색어 상태
    const [open, setOpen] = useState(false); //가이드 등록 모달 사용여부 상태
    const template = useContext(TemplateContext);
    let menuList = menuData[template.memberInfo.role]; //사용자 role에 따라 메뉴 변경

    useEffect(()=>{

    },[location])

    //로그아웃 함수
    const handleLogout = () => {
        logout().then(res => {
            localStorage.clear();
            window.location.href = `http://localhost:58337/home`;
        })
    }

    //가이드 등록 모달 관련 함수
    const handleOpen = () => {
        if (localStorage.getItem("token")) setOpen(true);
    };
    const handleClose = () => setOpen(false);

    //상품목록 페이지 벗어날때 검색창 비우기
    useEffect(() => {
        //상품페이지 벗어날때 검색창 검색어 초기화
        if (!location.pathname.includes('/product')) {
            setSearchKeyword('');
        }
    }, [location.pathname]);

    const handleChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleEnterPress = (event) => {
        if (event.key === 'Enter') handleNavigatePage();
    };

    const handleNavigatePage = () => {
        navigate(`/product?keyword=${searchKeyword}`);
    };

    //스크롤 관련 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleClick = (path) => {
        navigate(path);
        scrollToTop();
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerFrame}>
                <button className={styles.logoButton} onClick={() => { navigate('/home'); }}>TripMaven</button>

                <div className={styles.nav}>
                    <div className={styles.inputstyle}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="검색어를 입력하세요"
                            value={searchKeyword}
                            onChange={handleChange}
                            onKeyDown={handleEnterPress}
                        />
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} onClick={handleNavigatePage} />
                    </div>
                    <div className={styles.navFrame}>
                        <div className={styles.navItems}>
                            <button className={styles.navButton} onClick={() => { handleClick('/home') }}>Home</button>
                            <button className={styles.navButton} onClick={() => { handleClick('/aipage') }}>AI 서비스</button>
                            <div className={styles.dropdown}>
                                <button className={styles.dropdownButton}>
                                    {template.memberInfo.name ? (
                                        <>
                                            <Avatar sx={{ mr: 1 }} alt={template.memberInfo.profile} src={template.memberInfo.profile} className={styles.avatar} />
                                            {template.memberInfo.name} 님
                                        </>
                                    ) : (
                                        '마이 페이지'
                                    )}
                                    <svg
                                        className={styles.dropdownIcon}
                                        width="9"
                                        height="6"
                                        viewBox="0 0 9 6"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M4.98622 5.30911C4.85946 5.43134 4.68755 5.5 4.50831 5.5C4.32906 5.5 4.15715 5.43134 4.03039 5.30911L0.206369 1.62092C0.141806 1.56078 0.0903082 1.48884 0.0548807 1.4093C0.0194533 1.32975 0.00080548 1.2442 2.55226e-05 1.15763C-0.000754434 1.07107 0.0163492 0.985216 0.0503381 0.905091C0.084327 0.824966 0.134521 0.752172 0.19799 0.690957C0.26146 0.629742 0.336934 0.581331 0.42001 0.54855C0.503085 0.515768 0.592098 0.499272 0.681854 0.500025C0.77161 0.500777 0.860312 0.518762 0.942784 0.552931C1.02526 0.5871 1.09985 0.636769 1.1622 0.699038L4.50831 3.92629L7.85441 0.699038C7.9819 0.580277 8.15265 0.514562 8.32989 0.516048C8.50713 0.517533 8.67668 0.5861 8.80201 0.70698C8.92734 0.827861 8.99843 0.991383 8.99997 1.16233C9.00151 1.33327 8.93338 1.49796 8.81024 1.62092L4.98622 5.30911Z"
                                            fill="#1E1E1E"
                                        />
                                    </svg>
                                </button>
                                <div className={styles.dropdownContent}>
                                    {menuList && menuList.map((item, index) => {
                                        if (item.name) {
                                            return <a key={index}><button className={styles.navButton1} onClick={() => { handleClick(item.path) }}>{item.name}</button></a>
                                        }
                                    })}
                                </div>
                            </div>
                            <button className={styles.navButton} onClick={handleOpen}>가이드 등록</button>
                            <NotificationComponent />
                        </div>

                        {!localStorage.getItem("token") ?
                            <NavLink className={styles.loginButton} to="/login" >로그인</NavLink>
                            :
                            <NavLink onClick={handleLogout} className={styles.loginButton} to="/home" >로그아웃</NavLink>
                        }
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                keepMounted
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <GuideRegistration />
                </Box>
            </Modal>
        </header>
    );
}

export default Header;
