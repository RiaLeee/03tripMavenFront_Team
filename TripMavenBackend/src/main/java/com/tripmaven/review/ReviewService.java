package com.tripmaven.review;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.guideranking.GuideRankingRepository;
import com.tripmaven.guideranking.GuideRankingService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {
	
	private final ReviewRepository reviewRepository;
	private final GuideRankingService guideRankingService;
	private final ObjectMapper objectMapper;
	
	// CREATE(리뷰 등록)
	@Transactional
	public ReviewDto create(ReviewDto dto) {
		guideRankingService.addGuideRankings(dto);
		return ReviewDto.toDto(reviewRepository.save(dto.toEntity()));
	}
	
	// READ 가이드 측 게시글 조회(cs엔터티 PK_id로)	
	public ReviewDto usersById(Long id) {
		return ReviewDto.toDto(reviewRepository.findById(id).get());
	}	
	
	// READ (상품id 로 리뷰들 조회)
	@Transactional(readOnly = true)
	public List<ReviewDto> reviewByProductId(long productBoard) {
		// 리포지토리 호출
		List<ReviewEntity> reviewEntityList= reviewRepository.findAllByProductBoard_id(productBoard);	
		// 엔터티 리스트를 dto 로 변환
		return objectMapper.convertValue(reviewEntityList,
										objectMapper.getTypeFactory().defaultInstance()
										.constructCollectionLikeType(List.class, ReviewDto.class));
	}
		
	// READ (회원id 로 리뷰들 조회)
	@Transactional(readOnly = true)
	public List<ReviewDto> reviewByMemberId(long member) {
		List<ReviewEntity> reviewEntityList= reviewRepository.findAllByMember_id(member);	
		return objectMapper.convertValue(reviewEntityList,
				objectMapper.getTypeFactory().defaultInstance()
				.constructCollectionLikeType(List.class, ReviewDto.class));
	}
	
	// UPDATE (리뷰 수정)
	@Transactional
	public ReviewDto updateById(long id, ReviewDto dto) {
		ReviewEntity reviewEntity= reviewRepository.findById(id).orElse(new ReviewEntity());
		reviewEntity.setTitle(dto.getTitle());
		reviewEntity.setComments(dto.getComments());
		reviewEntity.setRatingScore(dto.getRatingScore());
		return ReviewDto.toDto(reviewRepository.save(reviewEntity));
	}
	
	// DELETE (리뷰 삭제)
	public ReviewDto deleteById(long id) {
		ReviewDto deletedDto= ReviewDto.toDto(reviewRepository.findById(id).get());
		reviewRepository.deleteById(id);
		return deletedDto;
	}


	

}
