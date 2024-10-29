package com.tripmaven.joinchatting;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tripmaven.chattingroom.ChattingRoomEntity;
import com.tripmaven.members.model.MembersEntity;

public interface JoinChattingRepository extends JpaRepository<JoinChattingEntity, Long>{
	


	long countByMember(MembersEntity member);

	List<JoinChattingEntity> findAllByMember(MembersEntity user1);

	List<JoinChattingEntity> findAllByChattingRoom(ChattingRoomEntity chattingRoom);

	List<JoinChattingEntity> findAllByMemberAndIsdelete(MembersEntity my, String string);

	List<JoinChattingEntity> findAllByChattingRoomAndAndIsdelete(ChattingRoomEntity chattingRoom, String string);


	

}