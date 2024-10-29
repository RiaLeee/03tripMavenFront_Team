package com.tripmaven.joinchatting;



import com.tripmaven.chattingroom.ChattingRoomEntity;
import com.tripmaven.members.model.MembersEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinChattingDto {

	private long id;
	private ChattingRoomEntity chattingRoom;
	private MembersEntity member;
	
	//DTO를 ENTITY로 변환하는 메소드
	public JoinChattingEntity toEntity() {
		return JoinChattingEntity.builder()
				.id(id)
				.chattingRoom(chattingRoom)
				.member(member)
				.build();
	}
	//ENTITY를 DTO로 변환하는 메소드
	public static JoinChattingDto toDto(JoinChattingEntity joinChattingEntity) {
		return JoinChattingDto.builder()
				.id(joinChattingEntity.getId())
				.chattingRoom(joinChattingEntity.getChattingRoom())
				.member(joinChattingEntity.getMember())
				.build();
	}
}
