package com.tripmaven.chattingroom;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Vector;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.chattingmessage.ChattingMessageEntity;
import com.tripmaven.joinchatting.JoinChattingDto;
import com.tripmaven.joinchatting.JoinChattingEntity;
import com.tripmaven.joinchatting.JoinChattingRepository;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersRepository;
import com.tripmaven.productboard.ProductBoardDto;
import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productboard.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChattingRoomService {

	private final ChattingRoomRepository chattingRoomRepository;
	private final JoinChattingRepository joinChattingRepository;
	private final ProductRepository productRepository;
	private final MembersRepository membersRepository;
	private final ObjectMapper objectMapper;

	public String getChattingRoomTopic(Long myId, Long yourId, Long prodId) {

		MembersEntity user1 = membersRepository.findById(myId).get();
		MembersEntity user2 = membersRepository.findById(yourId).get();
		ProductBoardEntity productBoardEntity = productRepository.findById(prodId).get();		
		List<JoinChattingEntity> user1List = joinChattingRepository.findAllByMember(user1);
		List<JoinChattingEntity> user2List = joinChattingRepository.findAllByMember(user2);

		List<Long> roomIds = new Vector<>();
		long roomId = 0;
		//2명 다 들어있는 채팅방 찾기

		for(JoinChattingEntity user1entity : user1List) {
			for(JoinChattingEntity user2entity : user2List) {

				if(user1entity.getChattingRoom().getId() == user2entity.getChattingRoom().getId()) {

					roomIds.add(user1entity.getChattingRoom().getId());
				}
			}
		}


		for(Long r : roomIds) {
			ChattingRoomEntity chatroom  = chattingRoomRepository.findById(r).orElse(null);
			if(chatroom != null) {
				if(chatroom.getProductBoard().getId() == prodId) {
					roomId = chatroom.getId();
					break;
				}
			}
		}
		if(roomId == 0) {
			ChattingRoomEntity chatroom = ChattingRoomEntity.builder().productBoard(productBoardEntity).build();
			chatroom = chattingRoomRepository.save(chatroom);
			JoinChattingEntity newEnteredChatRoom1 = JoinChattingEntity.builder().chattingRoom(chatroom).member(user1).build();
			joinChattingRepository.save(newEnteredChatRoom1);
			JoinChattingEntity newEnteredChatRoom2 = JoinChattingEntity.builder().chattingRoom(chatroom).member(user2).build();
			newEnteredChatRoom2 = joinChattingRepository.save(newEnteredChatRoom2);
			roomId = newEnteredChatRoom2.getChattingRoom().getId();
			return String.valueOf(roomId);
		}


		if(roomIds.size()==1) {
			return String.valueOf(roomIds.get(0));
		}

		//채팅방 있으면 채팅방 id 반환
		if(roomId != 0) return String.valueOf(roomId);

		//없으면 만들어서 반환
		else {
			ChattingRoomEntity chatroom = ChattingRoomEntity.builder().productBoard(productBoardEntity).build();
			chatroom = chattingRoomRepository.save(chatroom);
			JoinChattingEntity newEnteredChatRoom1 = JoinChattingEntity.builder().chattingRoom(chatroom).member(user1).build();
			joinChattingRepository.save(newEnteredChatRoom1);
			JoinChattingEntity newEnteredChatRoom2 = JoinChattingEntity.builder().chattingRoom(chatroom).member(user2).build();
			newEnteredChatRoom2 = joinChattingRepository.save(newEnteredChatRoom2);
			roomId = newEnteredChatRoom2.getChattingRoom().getId();
			return String.valueOf(roomId);
		}
	}

	public List<ChattingRoomDto> getAllChattingRoom() {
		List<ChattingRoomEntity> chatrooms = chattingRoomRepository.findAll();
		List<ChattingRoomDto> chatroomDTOs = new ArrayList<ChattingRoomDto>();
		for (ChattingRoomEntity room : chatrooms) {
			if (room.getIsDelete() == "0") {
				chatroomDTOs.add(ChattingRoomDto.toDTO(room));
			}
		}
		return chatroomDTOs;
	}

	public List<JoinChattingDto> getChattingYour(Long myId) {
		MembersEntity my = membersRepository.findById(myId).get();
		List<JoinChattingEntity> myChatList = joinChattingRepository.findAllByMemberAndIsdelete(my, "0");
		List<JoinChattingEntity> yourChatList = new Vector<>();
		for(JoinChattingEntity chat:myChatList) {
			List<JoinChattingEntity> chattingRoomList = joinChattingRepository.findAllByChattingRoomAndAndIsdelete(chat.getChattingRoom(),"0");
			for(JoinChattingEntity chatting:chattingRoomList) {
				if(chatting.getMember().getId()!=myId) yourChatList.add(chatting);
			}
		}
		return objectMapper.convertValue(yourChatList, objectMapper.getTypeFactory().defaultInstance().constructCollectionType(List.class,JoinChattingDto.class));
	}

	public List<JoinChattingDto> getChattingMy(Long myId) {
		MembersEntity my = membersRepository.findById(myId).get();
		List<JoinChattingEntity> myChatList = joinChattingRepository.findAllByMemberAndIsdelete(my,"0");
		return objectMapper.convertValue(myChatList, objectMapper.getTypeFactory().defaultInstance().constructCollectionType(List.class,JoinChattingDto.class));
	}

	public ChattingRoomDto getChattingRoom(Long chattingRoomId) {
		ChattingRoomEntity chattingRoomEntity = chattingRoomRepository.findById(chattingRoomId).get();
		return ChattingRoomDto.toDTO(chattingRoomEntity);
	}

	@Transactional
	public JoinChattingDto delete(long id) {
		JoinChattingDto deletedDto=JoinChattingDto.toDto(joinChattingRepository.findById(id).get());
		joinChattingRepository.deleteById(id);
		return deletedDto;
	}



}