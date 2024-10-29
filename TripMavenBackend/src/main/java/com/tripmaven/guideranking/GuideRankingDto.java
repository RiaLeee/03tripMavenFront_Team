package com.tripmaven.guideranking;


import com.tripmaven.members.model.MembersEntity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GuideRankingDto {

	
	private long id;
	private MembersEntity member;
	private Double averageRating;
	
	// DTO를 ENTITY로 변환
		public GuideRankingEntity toEntity() {
			return GuideRankingEntity.builder()
					.id(id)
					.member(member)
					.averageRating(averageRating)
					.build();
		}
		
	// ENTITY를 DTO로 변환
		public static GuideRankingDto toDto (GuideRankingEntity guideRankingEntity) {
			return GuideRankingDto.builder()
					.id(guideRankingEntity.getId())
					.member(guideRankingEntity.getMember())
					.averageRating(guideRankingEntity.getAverageRating())
					.build();
		}
}
