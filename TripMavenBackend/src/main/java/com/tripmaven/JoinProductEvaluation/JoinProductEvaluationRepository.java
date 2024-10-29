package com.tripmaven.JoinProductEvaluation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JoinProductEvaluationRepository extends JpaRepository<JoinProductEvaluationEntity, Long>{
	
	// 조인 평가 id로 평가 결과 조회 (즉, 첫번째 및 두번째 분석 결과 가져오기)
	List<JoinProductEvaluationEntity> findAllById(long id);

	List<JoinProductEvaluationEntity> findAllByProductBoard_id(long productId);

	List<JoinProductEvaluationEntity> findAllByMember_id(long memberId);

}
