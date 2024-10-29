package com.tripmaven.productevaluation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tripmaven.review.ReviewEntity;

@Repository
public interface productEvaluationRepository extends JpaRepository<ProductEvaluationEntity, Long>{
	
	// 분석내용 상품아이디로 조회
	List<ProductEvaluationEntity> findAllByProductBoard_id(long productBoard_id);
	
	

}
