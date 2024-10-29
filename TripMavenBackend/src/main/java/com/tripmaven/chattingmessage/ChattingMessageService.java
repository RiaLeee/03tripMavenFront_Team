package com.tripmaven.chattingmessage;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.tripmaven.chattingroom.ChattingRoomEntity;
import com.tripmaven.chattingroom.ChattingRoomRepository;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChattingMessageService {

	private final ChattingMessageRepository chattingMessageRepository;
	private final ChattingRoomRepository chattingRoomRepository;



	
	//메세지 저장
	 @Transactional
	  public void saveMessage(Long chattingRoomId, String text, Long sender) {
		
        ChattingRoomEntity chattingRoom = chattingRoomRepository.findById(chattingRoomId).orElseThrow();
        
            // 새로운 메시지 엔티티 생성
            ChattingMessageEntity newMessage = ChattingMessageEntity.builder()
                .chattingRoom(chattingRoom)
                .text(text)
                .sender(sender)
                .createdAt(LocalDateTime.now()) 
                .isActive("1") 
                .isDelete("0") 
                .build();
            
            chattingMessageRepository.save(newMessage);
        }



	 @Transactional
		public List<Map<String, Object>> getMessages(Long chattingRoomId) {

			List<ChattingMessageEntity> chatMessages = chattingMessageRepository.findAllByChattingRoom_IdOrderByCreatedAtAsc(chattingRoomId);
			
			return chatMessages.stream().map(chatMessage -> {
				Map<String, Object> messageMap = new HashMap<>();
				messageMap.put("text", chatMessage.getText());
				messageMap.put("sender", chatMessage.getSender());
				messageMap.put("timestamp", chatMessage.getCreatedAt());
				return messageMap;
			}).collect(Collectors.toList());
		}
}
