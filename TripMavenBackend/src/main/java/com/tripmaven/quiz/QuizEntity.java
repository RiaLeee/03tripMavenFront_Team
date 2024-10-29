package com.tripmaven.quiz;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "quiz")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizEntity {
	
	/** 퀴즈 고유 번호 PK*/
	@Id
	@SequenceGenerator(name="seq_quiz",sequenceName = "seq_quiz",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_quiz")
	private long id;
	
	/** 질문 */
	@Column(nullable = false)
    private String question;
    
	/** 보기1 */
    @Column(nullable = false)
    private String options1;
    
    /** 보기2 */
    @Column(nullable = false)
    private String options2;
    
    /** 보기3 */
    @Column(nullable = false)
    private String options3;
    
    /** 보기4 */
    @Column(nullable = false)
    private String options4;
    
    /** 정답 */
    @Column(nullable = false)
    private String answer;
    
    /**사용자가 선택한 정답 */
    @Column
    private String userAnswer;

}
