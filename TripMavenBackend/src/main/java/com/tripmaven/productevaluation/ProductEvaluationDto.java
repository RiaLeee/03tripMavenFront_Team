package com.tripmaven.productevaluation;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.JoinProductEvaluation.JoinProductEvaluationEntity;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;

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
public class ProductEvaluationDto {
	
	// Jackson ObjectMapper 인스턴스
	private static final ObjectMapper objectMapper = new ObjectMapper();

	//필드
	private long id;
	private MembersEntity member;
	private JoinProductEvaluationEntity joinProductEvaluation;
	private ProductBoardEntity productBoard;
	private LocalDateTime createdAt;
	private String isDelete;
	private int score;
	private int pronunciation;
	private float speed;
	private String voice_graph;
	private int tone_mean;
	private String tone;
	private String fillerwords;
	private String fillerweights;
	private int formal_speak;
	private int question_speak;
	private String text;
	private String weight;
	private String cheek;
	private String mouth;
	private String brow;
	private String eye;
	private String nasolabial;
	private String commentsFace;
	private String commentEye;
	private float total_time;
	private String filename;
	
	//DTO를 ENTITY로 변환하는 메소드
	public ProductEvaluationEntity toEntity() {
		return ProductEvaluationEntity.builder()
				.id(id)
				.joinProductEvaluation(joinProductEvaluation)
				.member(member)
				.productBoard(productBoard)
				.createdAt(createdAt)
				.isDelete(isDelete)
				.score(score)
				.pronunciation(pronunciation)
				.speed(speed)
				.voice_graph(voice_graph)
				.tone_mean(tone_mean)
				.tone(tone)
				.fillerwords(fillerwords)
				.fillerweights(fillerweights)
				.formal_speak(formal_speak)
				.question_speak(question_speak)
				.text(text)
				.weight(weight)
				.cheek(cheek)
				.mouth(mouth)
				.brow(brow)
				.nasolabial(nasolabial)
				.eye(eye)
				.commentsFace(commentsFace)
				.commentEye(commentEye)
				.total_time(total_time)
				.filename(filename)
				.build();
	}

	//ENTITY를 DTO로 변환하는 메소드
	public static ProductEvaluationDto toDto(ProductEvaluationEntity productEvaluationEntity) {
		return ProductEvaluationDto.builder()
				.id(productEvaluationEntity.getId())
				.joinProductEvaluation(productEvaluationEntity.getJoinProductEvaluation())
				.member(productEvaluationEntity.getMember())
				.productBoard(productEvaluationEntity.getProductBoard())
				.createdAt(productEvaluationEntity.getCreatedAt())
				.isDelete(productEvaluationEntity.getIsDelete())
				.score(productEvaluationEntity.getScore())
				.pronunciation(productEvaluationEntity.getPronunciation())
				.speed(productEvaluationEntity.getSpeed())
				.voice_graph(productEvaluationEntity.getVoice_graph())
				.tone_mean(productEvaluationEntity.getTone_mean())
				.tone(productEvaluationEntity.getTone())
				.fillerwords(productEvaluationEntity.getFillerwords())
				.fillerweights(productEvaluationEntity.getFillerweights())
				.formal_speak(productEvaluationEntity.getFormal_speak())
				.question_speak(productEvaluationEntity.getQuestion_speak())
				.text(productEvaluationEntity.getText())
				.weight(productEvaluationEntity.getWeight())
				.cheek(productEvaluationEntity.getCheek())
				.mouth(productEvaluationEntity.getMouth())
				.brow(productEvaluationEntity.getBrow())
				.nasolabial(productEvaluationEntity.getNasolabial())
				.eye(productEvaluationEntity.getEye())
				.commentEye(productEvaluationEntity.getCommentEye())
				.commentsFace(productEvaluationEntity.getCommentsFace())
				.total_time(productEvaluationEntity.getTotal_time())
				.filename(productEvaluationEntity.getFilename())
				.build();
	}
}
