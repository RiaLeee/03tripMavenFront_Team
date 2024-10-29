package com.tripmaven.JoinProductEvaluation;

import java.util.List;

import com.tripmaven.chattingroom.ChattingRoomEntity;
import com.tripmaven.joinchatting.JoinChattingDto;
import com.tripmaven.joinchatting.JoinChattingEntity;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productevaluation.ProductEvaluationEntity;

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
public class JoinProductEvaluationDto {
	
	private long id;
	private List<ProductEvaluationEntity> productEvaluation;
	private MembersEntity member;
	private ProductBoardEntity productBoard;
	
	//DTO를 ENTITY로 변환하는 메소드
	public JoinProductEvaluationEntity toEntity() {
		return JoinProductEvaluationEntity.builder()
				.id(id)
				.productEvaluation(productEvaluation)
				.member(member)
				.productBoard(productBoard)
				.build();
	}
	//ENTITY를 DTO로 변환하는 메소드
	public static JoinProductEvaluationDto toDto(JoinProductEvaluationEntity joinProductEvaluationEntity) {
		return JoinProductEvaluationDto.builder()
				.id(joinProductEvaluationEntity.getId())
				.productEvaluation(joinProductEvaluationEntity.getProductEvaluation())
				.member(joinProductEvaluationEntity.getMember())
				.productBoard(joinProductEvaluationEntity.getProductBoard())
				.build();
	}

}
