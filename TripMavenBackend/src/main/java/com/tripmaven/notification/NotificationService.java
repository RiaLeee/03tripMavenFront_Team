package com.tripmaven.notification;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	
	private final ObjectMapper objectMapper;
	private final NotificationRepository notificationRepository;

	public NotificationDto create(NotificationDto dto) {
		return NotificationDto.toDto(notificationRepository.save(dto.toEntity()));
	}

	public List<NotificationDto> readAll(Long myId) {
		List<NotificationEntity> notificationList = notificationRepository.findAllByMemberId(myId);
		notificationList.sort((n1, n2) -> n2.getCreateAt().compareTo(n1.getCreateAt()));
		return objectMapper.convertValue(notificationList, objectMapper.getTypeFactory().
				defaultInstance().constructCollectionType(List.class, NotificationDto.class));
	}

	public List<NotificationDto> updateRead(NotificationDto dto) {
		List<NotificationEntity> notificationList = notificationRepository.
													findAllByMemberIdAndSenderId(dto.getMemberId(), dto.getSenderId());
		notificationList.stream().map(entity->{entity.setIsRead("1"); return entity;}).collect(Collectors.toList());
		List<NotificationEntity> updatedList = notificationRepository.saveAll(notificationList);
		return objectMapper.convertValue(updatedList, objectMapper.getTypeFactory().defaultInstance().
				constructCollectionType(List.class, NotificationDto.class));
	}

}
