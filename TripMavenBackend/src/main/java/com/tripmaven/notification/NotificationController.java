package com.tripmaven.notification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/noti")
@RequiredArgsConstructor
public class NotificationController {
	
	private final NotificationService notificationService;

	
	//알림 테이블에 등록하는 메소드
	@PostMapping("/")
	public ResponseEntity<NotificationDto> postNotification(@RequestBody NotificationDto dto) {
		try {
			NotificationDto savedDto = notificationService.create(dto);
			return ResponseEntity.ok(savedDto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	//알림 목록 불러오는 메소드
	@GetMapping("/{myId}")
	public ResponseEntity<List<NotificationDto>> getNotifications(@PathVariable(name = "myId") Long myId) {
		try {
			List<NotificationDto> notificationList = notificationService.readAll(myId);
			List<NotificationDto> filteredList = notificationList.stream().filter(t-> !(t.getIsRead().equals("1"))).toList();
			return ResponseEntity.ok(filteredList);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	//알림 목록 클릭시 isRead변경 메소드
	@PutMapping("/")
	public ResponseEntity<List<NotificationDto>> putNotifications(@RequestBody NotificationDto dto) {
		try {
			List<NotificationDto> updatedList = notificationService.updateRead(dto);
			return ResponseEntity.ok(updatedList);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
