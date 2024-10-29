package com.tripmaven.notification;


import java.time.LocalDateTime;

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
public class NotificationDto {

	private long id;
	private long memberId;
	private String content;
	private String isRead;
	private LocalDateTime createAt;
	private String type;
	private String link;
	private long senderId;
	
	//DTO를 ENTITY로 변환하는 메소드
	public NotificationEntity toEntity() {
		return NotificationEntity.builder()
				.id(id)
				.memberId(memberId)
				.content(content)
				.isRead(isRead)
				.createAt(createAt)
				.type(type)
				.link(link)
				.senderId(senderId)
				.build();
	}
	
	//Entity를 DTO로 변환하는 메소드
	public static NotificationDto toDto(NotificationEntity notificationEntity) {
		return NotificationDto.builder()
				.id(notificationEntity.getId())
				.memberId(notificationEntity.getMemberId())
				.content(notificationEntity.getContent())
				.isRead(notificationEntity.getIsRead())
				.createAt(notificationEntity.getCreateAt())
				.type(notificationEntity.getType())
				.link(notificationEntity.getLink())
				.senderId(notificationEntity.getSenderId())
				.build();
	}
}
