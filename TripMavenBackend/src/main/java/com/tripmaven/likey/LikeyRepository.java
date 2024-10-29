package com.tripmaven.likey;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;

public interface LikeyRepository extends JpaRepository<LikeyEntity, Long> {

	LikeyEntity findByMemberAndProductBoard(MembersEntity member, ProductBoardEntity productBoard);
	
	List<LikeyEntity> findByMember_Id(long memberID);

}
