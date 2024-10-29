package com.tripmaven.chattingroom;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChattingRoomRepository extends JpaRepository<ChattingRoomEntity, Long> {

	Optional<ChattingRoomEntity> findByProductBoard_Id(Long id);



	List<ChattingRoomEntity> findAllByProductBoard_Id(Long prodId);

}



