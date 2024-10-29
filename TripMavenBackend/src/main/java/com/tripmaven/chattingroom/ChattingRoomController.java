package com.tripmaven.chattingroom;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tripmaven.chattingmessage.ChattingMessageEntity;
import com.tripmaven.joinchatting.JoinChattingDto;
import com.tripmaven.joinchatting.JoinChattingRepository;
import com.tripmaven.productboard.ProductBoardDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChattingRoomController {

	private final ChattingRoomService chattingRoomService;
	
	
	// JoinChattingDto의 ChattingMessage 리스트에서 마지막 메시지의 createdAt을 반환
    private Long getLastMessageTimestamp(JoinChattingDto dto) {
        // ChattingRoomEntity에서 ChattingMessage 리스트를 가져옴
        List<ChattingMessageEntity> messages = dto.getChattingRoom().getChattingMessage();

        // 메시지가 없는 경우 Long.MIN_VALUE를 반환하여 정렬에서 가장 뒤로 감
        if (messages == null || messages.isEmpty()) {
            return Long.MIN_VALUE;
        }

        // 마지막 메시지의 createdAt을 LocalDateTime으로 가져와서 타임스탬프 변환
        LocalDateTime createdAt = messages.get(messages.size() - 1).getCreatedAt();

        // LocalDateTime을 타임스탬프로 변환하여 반환
        return getTimestampFromLocalDateTime(createdAt);
    }
    
    
    // LocalDateTime을 타임스탬프로 변환하는 메서드
    private Long getTimestampFromLocalDateTime(LocalDateTime localDateTime) {
        // LocalDateTime을 지정된 ZoneId를 기준으로 Instant로 변환한 뒤, 밀리초 단위의 타임스탬프로 변환
        return localDateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }
    


	@GetMapping("/topic/{myId}/{yourId}/{prodId}")
	public ResponseEntity<String> getChattingRoomTopic(@PathVariable("myId") Long myId, @PathVariable("yourId") Long yourId, @PathVariable("prodId") Long prodId) {
		try {
			String chattingRoomTopic = chattingRoomService.getChattingRoomTopic(myId, yourId, prodId);
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json")
					.body(chattingRoomTopic);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	//채팅 내역 불러오기
	@GetMapping("/users")
	public ResponseEntity<List<ChattingRoomDto>> getA11ChatRoom() {
		try {
			List<ChattingRoomDto> chattingRoom = chattingRoomService.getAllChattingRoom();
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json").body(chattingRoom);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);

		}
	}
	
	//로그인한 사람 기준으로 채팅하는 상대방 모두 얻기
	@GetMapping("/topic/{myId}")
	public ResponseEntity<List<JoinChattingDto>> getChattingYour(@PathVariable("myId") Long myId) {
		try {
			List<JoinChattingDto> yourList = chattingRoomService.getChattingYour(myId);
			System.out.println("리스트:"+yourList.size());
			// JoinChattingDto 리스트를 정렬
	        Collections.sort(yourList, new Comparator<JoinChattingDto>() {
	            @Override
	            public int compare(JoinChattingDto dto1, JoinChattingDto dto2) {
	                // 첫 번째 dto의 마지막 메시지 타임스탬프
	                Long timestamp1 = getLastMessageTimestamp(dto1);
	                // 두 번째 dto의 마지막 메시지 타임스탬프
	                Long timestamp2 = getLastMessageTimestamp(dto2);
	                // 최신 메시지가 먼저 오도록 내림차순 정렬
	                return timestamp2.compareTo(timestamp1);
	            }
	        });
			
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json")
					.body(yourList);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	//로그인한 사람 채팅방 모두 얻기
	@GetMapping("/topic/my/{myId}")
	public ResponseEntity<List<JoinChattingDto>> getChattingMy(@PathVariable("myId") Long myId) {
		try {
			List<JoinChattingDto> myList = chattingRoomService.getChattingMy(myId);
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json")
					.body(myList);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	
	@GetMapping("/chattingroom/{chattingRoomId}")
	public ResponseEntity<ChattingRoomDto> getChattingRoom(@PathVariable("chattingRoomId") Long chattingRoomId) {
		try {
			ChattingRoomDto chattingRoomDto = chattingRoomService.getChattingRoom(chattingRoomId);
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json")
					.body(chattingRoomDto);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	//채팅방 나가기
	@DeleteMapping("/chattingroom/{chattingRoomId}")
	public ResponseEntity<JoinChattingDto> postDelete(@PathVariable("chattingRoomId") long chattingRoomId){
		try {
			JoinChattingDto deleteDTO = chattingRoomService.delete(chattingRoomId);
			return ResponseEntity.ok(deleteDTO);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

}