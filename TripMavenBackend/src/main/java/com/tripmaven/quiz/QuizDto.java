package com.tripmaven.quiz;

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
public class QuizDto {

	private long id;
	private String question;
	private String options1;
	private String options2;
	private String options3;
	private String options4;
	private String answer;
	private String userAnswer;

	// DTO를 ENTITY로 변환하는 메소드
	public QuizEntity toEntity() {
		return QuizEntity.builder()
				.id(id)
				.question(question)
				.options1(options1)
				.options2(options2)
				.options3(options3)
				.options4(options4)
				.answer(answer)
				.userAnswer(userAnswer)
				.build();
	}

	// ENTITY를 DTO로 변환하는 메소드
	public static QuizDto toDto(QuizEntity quizEntity) {
	        return QuizDto.builder()
	        		.id(quizEntity.getId())
	        		.question(quizEntity.getQuestion())
	        		.options1(quizEntity.getOptions1())
	        		.options2(quizEntity.getOptions2())
	        		.options3(quizEntity.getOptions3())
	        		.options4(quizEntity.getOptions4())
	        		.answer(quizEntity.getAnswer())
	        		.userAnswer(quizEntity.getUserAnswer())
	        		.build();
	}
}
