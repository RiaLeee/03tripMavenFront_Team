package com.tripmaven.review;

import java.util.List;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long>{

	// READ (상품id 로 리뷰들 조회)
	List<ReviewEntity> findAllByProductBoard_id(long productBoard_id);
	
	// READ (회원id 로 리뷰들 조회)
	List<ReviewEntity> findAllByMember_id(long member_id);
	
}
