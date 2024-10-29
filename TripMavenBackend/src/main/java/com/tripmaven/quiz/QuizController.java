package com.tripmaven.quiz;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:58338")
public class QuizController {

	private final QuizService quizService;

	@GetMapping("/quiz")	
	public ResponseEntity<List<QuizDto>> getQuizsAll(){
		try {
			List<QuizDto> quizList = quizService.quizAll();
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json").body(quizList);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

    @PostMapping("/quiz")
    public void submitQuiz(@RequestBody Map<String, Object> map) {
    	Long quizId = ((Number) map.get("id")).longValue();
        String userAnswer = (String) map.get("userAnswer");
        quizService.saveUserAnswer(quizId, userAnswer);
    }

}
