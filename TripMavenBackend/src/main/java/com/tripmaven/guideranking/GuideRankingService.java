package com.tripmaven.guideranking;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.Comparator;

import org.springframework.stereotype.Service;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.review.ReviewDto;
import com.tripmaven.review.ReviewEntity;
import com.tripmaven.review.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GuideRankingService {

	// 리뷰 리포지에서 가이드별 리뷰들 조회
	private final ReviewRepository reviewRepository;
	private final GuideRankingRepository guideRankingRepository;
	
	@Transactional 
	public void addGuideRankings(ReviewDto dto) {
		GuideRankingEntity guideRankingEntity = GuideRankingEntity.builder()
													.averageRating(dto.getRatingScore())
													.member(dto.getProductBoard().getMember())
													.build();
		guideRankingRepository.save(guideRankingEntity);
	}
	
	// 평균 별점을 계산하고 랭킹 순서대로 가이드 정보 가져오기
	@Transactional 
	public List<GuideRankingDto> calculateGuideRankings() {
		
		List<GuideRankingEntity> list = guideRankingRepository.findAll();
		
		// 가이드별로 리뷰를 그룹화
		Map<MembersEntity, List<GuideRankingEntity>> guidegroups = list.stream()
				.collect(Collectors.groupingBy(GuideRankingEntity::getMember));
		
		List<GuideRankingDto> averageScoreList = guidegroups.entrySet().stream()
	            .map(entry -> {
	                MembersEntity member = entry.getKey();
	                List<GuideRankingEntity> rankings = entry.getValue();

	                // 평균 점수 계산
	                double averageScore = rankings.stream()
	                    .mapToDouble(GuideRankingEntity::getAverageRating)
	                    .average()
	                    .orElse(0.0);
	                return new GuideRankingDto(0, member, averageScore);
	            })
	            .collect(Collectors.toList());
		AtomicInteger rank = new AtomicInteger(1); // 순위 초기값 설정
	    List<GuideRankingDto> rankedList = averageScoreList.stream()
	        .sorted((dto1, dto2) -> Double.compare(dto2.getAverageRating(), dto1.getAverageRating())) // 내림차순 정렬
	        .map(dto -> {
	            dto.setId(rank.getAndIncrement()); // 순위 설정
	            return dto;
	        })
	        .collect(Collectors.toList());
	    return rankedList;

	}
}
