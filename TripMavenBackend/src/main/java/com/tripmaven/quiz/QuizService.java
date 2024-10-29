package com.tripmaven.quiz;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizService {

	private final QuizRepository quizRepository;
	private final ObjectMapper objectMapper;


	//모든 퀴즈 조회
	@Transactional
	public List<QuizDto> quizAll() {
		List<QuizEntity> quizEntityList = quizRepository.findAll();

		return objectMapper.convertValue(quizEntityList, objectMapper.getTypeFactory().defaultInstance().constructCollectionType(List.class,QuizDto.class));
	}

	@Transactional
	public void saveUserAnswer(Long id, String userAnswer) {
		QuizEntity quiz = quizRepository.findById(id).orElse(null);
		if (quiz != null) {
			quiz.setUserAnswer(userAnswer);
			quizRepository.save(quiz);
		}
	}

}
