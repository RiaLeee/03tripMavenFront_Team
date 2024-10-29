import React from 'react';
import { Box, Typography, Button, Rating, Modal, Avatar } from '@mui/material';
import styles from '../../styles/productPage/GuideProfileModal.module.css';
import { useNavigate } from 'react-router-dom';
import { chattingRoomData } from '../../utils/chatData';

const ProfileCardModal = ({ isOpen, onClose, postData }) => {

    console.log(postData.member)
    const navigate = useNavigate();

    const handleChat = async () => {
        try {
          const myId = localStorage.getItem("membersId");
          const yourId = postData.member.id;
          const roomId = await chattingRoomData(myId, yourId, postData.id);
            console.log(roomId)
          navigate(`/bigChat/${roomId}`);
    
        } catch (error) {
          console.error('Error fetching or creating chat room:', error);
        }
    
      };

    if (!postData.member) return null; // 가이드 데이터가 없을 경우 모달을 렌더링하지 않음


    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box className={styles.modalContent}>
                <Box className={styles.card}>
                    <Box className={styles.profile}>
                        <Avatar
                            src={postData.member.profile || '/path/to/default-avatar.png'}
                            alt="Guide Avatar"
                            sx={{ width: 120, height: 120, marginRight: '16px' }}  // Avatar 크기 고정 및 간격 추가
                        />
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', fontSize: '24px', color: '#333' }}  // 이름과 아래 한줄 소개 사이의 간격
                            >
                                {postData.member.name}
                            </Typography>
                        </Box>
                    </Box>

                    {/* 해시태그 강조 하드 코딩입니다. */}
                    <Box className={styles.hashtags} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginTop: 2 }}>
                        {postData.member.keywords && postData.member.keywords.split('*').map((keyword, index)=>{
                            return <Typography variant="body2" className={styles.hashtag} key={index}>#{keyword}</Typography>
                        })}
                    </Box>

                    {/* 소개 섹션 */}
                    <Box className={styles.description}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>소개</Typography>
                        <Typography variant="body2">
                            {postData.member.introduce || 
                            "안녕하세요, 트립메이븐입니다. 순간의 기억이 영원히 남을 수 있도록, 여러분의 특별한 순간을 기록으로 완성해드립니다. 소중한 추억을 마음속 깊이 간직하게 만드는 여정, 저와 함께 떠나보세요. 이 외에도 다양한 활동을 통해 여러분의 여정을 더욱 풍성하게 만들어드릴 것을 약속드립니다. 믿을 수 있는 가이드와 함께 잊지 못할 추억을 만들어보세요."}
                        </Typography>
                    </Box>

                    {/* 평점 섹션 */}
                    <Box className={styles.ratings} sx={{ marginTop: 3, display: 'flex', justifyContent: 'center', gap: 5 }}>
                        <Box className={styles.rating} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">AI 평균 평점</Typography>
                            <Rating value={postData.AiScore} readOnly precision={0.5} />
                            <Typography variant="body2">{postData.AiScore} / 5.0</Typography>
                        </Box>
                        <Box className={styles.rating} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">리뷰 평균 평점</Typography>
                            <Rating value={postData.review && Object.values(postData.review).length > 0
                                            ? Object.values(postData.review).reduce((acc, review) => acc + review.ratingScore, 0) / Object.values(postData.review).length
                                            : 0 } readOnly precision={0.1} />
                            <Typography variant="body2">{postData.review && Object.values(postData.review).length > 0
                                                        ? Object.values(postData.review).reduce((acc, review) => acc + review.ratingScore, 0) / Object.values(postData.review).length
                                                        : 0 } / 5.0</Typography>
                        </Box>
                    </Box>

                    {/* 버튼 UI */}
                    <Box className={styles.buttons} sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
                        <Button className={`${styles.customButton} ${styles.white}`} variant="contained" onClick={()=>navigate(`/product?keyword=${postData.member.name}`)}>
                            게시글<br/>보러가기
                        </Button>
                        <Button className={`${styles.customButton} ${styles.blue}`} variant="contained" onClick={()=>handleChat()}>
                            채팅 하기
                        </Button>
                    </Box>

                    <Button onClick={onClose} sx={{ marginTop: 3 }}>Close</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ProfileCardModal;
