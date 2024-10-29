package com.tripmaven.chattingmessage;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;



public interface ChattingMessageRepository extends JpaRepository<ChattingMessageEntity, Long>{

	List<ChattingMessageEntity> findAllByChattingRoom_Id(Long chattingRoomId);

	List<ChattingMessageEntity> findAllByChattingRoom_IdOrderByCreatedAtAsc(Long chattingRoomId);

}
