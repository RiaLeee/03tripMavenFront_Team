import React, { useContext, useState } from 'react';
import styles from '../../styles/chat/BigChat.module.css';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TemplateContext } from '../../context/TemplateContext';

function ChattingRoom({ setSelectedUser, data, client, setChatMessages, fetchChatMessages, chatMessages }) {
  const { notifications, setNotifications, notificationCount } = useContext(TemplateContext);
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleMouseEnter = (index) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  // 최근 메시지 시간 뿌리기
  const getLastMessageTime = (chatMessages, chattingRoomId) => {
    const messageTime = chatMessages[chattingRoomId] || [];

    if (messageTime.length === 0) {
      return ''; // 메시지가 없으면 빈 문자열 반환
    }

    const lastMessage = messageTime.reduce((latest, current) => {
      return new Date(latest.timestamp) > new Date(current.timestamp) ? latest : current;
    });

    // 마지막 메시지의 날짜
    const lastMessageDate = new Date(lastMessage.timestamp);
    const now = new Date();

    // 마지막 메시지의 날짜가 오늘이면 시간만 반환
    if (lastMessageDate.toDateString() === now.toDateString()) {
      return lastMessageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 시간만 반환
    } else {
      // 어제 또는 그 이전이면 월일과 시간만 반환
      return lastMessageDate.toLocaleDateString([], { month: '2-digit', day: '2-digit' }) + ' ' + lastMessageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 월일과 시간 모두 반환
    }
  };

  // 검색어와 일치하는 유저 필터링
  const SearchData = data.filter((joinChatting) =>
    joinChatting.member.name.toLowerCase().includes(search.toLowerCase()) 
  );

  const handleClick = (joinChatting) => {
    /*
    if (client && joinChatting.chattingRoom) {
      client.unsubscribe(`${id}`);
      client.subscribe(`${joinChatting.chattingRoom.id}`, (err) => {
        if (!err) {
          console.log(joinChatting.chattingRoom.id, 'Subscribed to topic');
        } else {
          console.error('Subscription error:', err);
        }
      });

      fetchChatMessages(joinChatting.chattingRoom.id);
      setSelectedUser(joinChatting);
    }
    */
    console.log(joinChatting);
    navigate(`/bigchat/${joinChatting.chattingRoom.id}`);
  };

  return (
    <div className={styles.messagesSection}>
      <div className={styles.header}>
        <h2 className={styles.messagesTitle}>TripTalk</h2>
        <div className={styles.searchNewChat}>
          <input
            type="text"
            value={search} // 검색 상태
            onChange={(e) => setSearch(e.target.value)} // 검색 상태 업데이트
            className={styles.searchInput}
            placeholder="검색어를 입력하세요"
          />
        </div>
      </div>

      <div className={styles.chatList}>
        {SearchData.length > 0 ? (
          SearchData.map((joinChatting, index) => {
            const lastMessageTime = getLastMessageTime(chatMessages, joinChatting.chattingRoom.id);

            return (
            <Box
              key={index}
              className={`${styles.chatItem} ${joinChatting.chattingRoom.id}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(joinChatting)}
              sx={{
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                backgroundColor: hoveredRow === index ? '#f0f0f0' : 'transparent',
                color: hoveredRow === index ? 'black' : 'inherit',
              }}
            >
              <img
                src={joinChatting.member.profile ? joinChatting.member.profile : "../images/defaultimage.png"}
                alt="profile"
                className={styles.profileImage}
              />
              <div className={styles.chatInfo}>
                <span>
                  <span className={styles.chatName}>{joinChatting.member.name}</span>
                  {notificationCount > 0 && notifications &&
                  (
                    <span className="badge rounded-pill bg-danger" style={{ fontSize: '11px' }}>{notifications.find(notification => notification.type=='chat' && joinChatting.member.id==notification.senderId && notification.link.includes(joinChatting.chattingRoom.id)) && notifications.find(notification => notification.type=='chat' && joinChatting.member.id==notification.senderId && notification.link.includes(joinChatting.chattingRoom.id)).content.length}</span>
                  )}
                </span>
                <span className={styles.chatTime}>
                  <span>
                    {lastMessageTime ? lastMessageTime : '...'}
                  </span>
                </span>
              </div>
            </Box>
            );
          })
        ) : (
          <p className={styles.noSearch}>검색 결과가 없습니다</p>
        )}
      </div>
    </div>
  );
}

export default ChattingRoom;
