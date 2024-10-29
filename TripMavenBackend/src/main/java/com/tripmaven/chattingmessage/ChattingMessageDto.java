package com.tripmaven.chattingmessage;

import java.time.LocalDateTime;

import com.tripmaven.chattingroom.ChattingRoomEntity;

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
public class ChattingMessageDto {

	private long id;
	private ChattingRoomEntity chattingRoom;
	private long sender;
	private String text;
	private LocalDateTime createdAt;
	private String isActive;
	private LocalDateTime deletedAt;
	private String isDelete;
	
	//DTO를 ENTITY로 변환하는 메소드
	public ChattingMessageEntity toEntity() {
		return ChattingMessageEntity.builder()
				.id(id)
				.chattingRoom(chattingRoom)
				.sender(sender)
				.text(text)
				.createdAt(createdAt)
				.isActive(isActive)
				.deletedAt(deletedAt)
				.isDelete(isDelete)
				.build();
	}
	//ENTITY를 DTO로 변환하는 메소드
	public static ChattingMessageDto toDto(ChattingMessageEntity chattingMessageEntity) {
		return ChattingMessageDto.builder()
				.id(chattingMessageEntity.getId())
				.chattingRoom(chattingMessageEntity.getChattingRoom())
				.sender(chattingMessageEntity.getSender())
				.text(chattingMessageEntity.getText())
				.createdAt(chattingMessageEntity.getCreatedAt())
				.isActive(chattingMessageEntity.getIsActive())
				.deletedAt(chattingMessageEntity.getDeletedAt())
				.isDelete(chattingMessageEntity.getIsDelete())
				.build();
	}
	
}
