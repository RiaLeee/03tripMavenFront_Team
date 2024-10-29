package com.tripmaven.JoinProductEvaluation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productevaluation.ProductEvaluationDto;
import com.tripmaven.productevaluation.ProductEvaluationEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JoinProductEvaluationService {
	
	private final JoinProductEvaluationRepository joinProductEvaluationRepository;
	private final ObjectMapper objectMapper;
	  
	//그룹화를 위한 아이디 생성
	public JoinProductEvaluationEntity create(JoinProductEvaluationEntity entity) {  
		//그룹화할 id 생성(id는 자동생성돼서 엔터티 생성만 하고 바로 리포지토리 호출만 하면 됨)
		JoinProductEvaluationEntity createdJoinProductEvaluation = joinProductEvaluationRepository.save(entity);
		return createdJoinProductEvaluation;
	}

	//아이디로 조회 조회
	public JoinProductEvaluationDto getById(long id) {
		return JoinProductEvaluationDto.toDto(joinProductEvaluationRepository.findById(id).get()) ;
	}

	public List<JoinProductEvaluationDto> getAllByProductId(long productId) {
		List<JoinProductEvaluationEntity> entityList = joinProductEvaluationRepository.findAllByProductBoard_id(productId);
		List<JoinProductEvaluationDto> dtoList = new ArrayList<>();
		for(JoinProductEvaluationEntity entity: entityList) {
			dtoList.add(JoinProductEvaluationDto.toDto(entity)); 
		}
		return dtoList;
	}

	public List<JoinProductEvaluationDto> getAllByMemberId(long memberId) {
		List<JoinProductEvaluationEntity> entityList = joinProductEvaluationRepository.findAllByMember_id(memberId);
		List<JoinProductEvaluationDto> dtoList = new ArrayList<>();
		for(JoinProductEvaluationEntity entity: entityList) {
			dtoList.add(JoinProductEvaluationDto.toDto(entity)); 
		}
		return dtoList;
	}

	

}
