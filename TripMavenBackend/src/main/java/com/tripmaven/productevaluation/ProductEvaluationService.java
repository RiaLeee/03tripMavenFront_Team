package com.tripmaven.productevaluation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.review.ReviewDto;
import com.tripmaven.review.ReviewEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductEvaluationService {

	private final productEvaluationRepository productevaluationRepository;
	private final ObjectMapper objectMapper;

	// 분석내용 등록
	public ProductEvaluationDto create(ProductEvaluationDto dto) {
		return ProductEvaluationDto.toDto(productevaluationRepository.save(dto.toEntity()));
	}

	// 분석내용 전체조회
	@Transactional(readOnly = true)
	public List<ProductEvaluationDto> evaluationAll() {
		List<ProductEvaluationEntity> evaluations = productevaluationRepository.findAll();
		return evaluations.stream().map(evaluation -> ProductEvaluationDto.toDto(evaluation))
				.collect(Collectors.toList());
	}

	// 분석내용 아이디로 조회
	@Transactional(readOnly = true)
	public ProductEvaluationDto getById(long id) {
		return ProductEvaluationDto.toDto(productevaluationRepository.findById(id).get());
	}
	
	// 분석내용 상품아이디로 조회
	@Transactional(readOnly = true)
	public List<ProductEvaluationDto> findByProductId(long productBoard_id) {
		// 리포지토리 호출
		List<ProductEvaluationEntity> evaluationEntityList= productevaluationRepository.findAllByProductBoard_id(productBoard_id);	
		// 엔터티 리스트를 dto 로 변환
		return objectMapper.convertValue(evaluationEntityList,
										objectMapper.getTypeFactory().defaultInstance()
										.constructCollectionLikeType(List.class, ProductEvaluationDto.class));
	}


}
