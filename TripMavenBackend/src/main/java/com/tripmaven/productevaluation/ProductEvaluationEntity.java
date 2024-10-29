
package com.tripmaven.productevaluation;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.tripmaven.JoinProductEvaluation.JoinProductEvaluationEntity;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "ProductEvaluation")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
public class ProductEvaluationEntity {

	/** AI평가 고유 번호. PK */
	@Id
	@SequenceGenerator(name = "seq_productevaluation", sequenceName = "seq_productevaluation", allocationSize = 1, initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_productevaluation")
	private long id;
	
	/** 조인테이블의 아이디를 FK로 한다 */
	@ManyToOne(optional = false)
	@JoinColumn(name = "joinProductEvaluationEntity_id")
	private JoinProductEvaluationEntity joinProductEvaluation;

	/** 회원 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="membersentity_id")
	private MembersEntity member;
	
	/** 가이드 상품 고유 번호. FK */
	@ManyToOne(optional = false)
	@JoinColumn(name = "productboardentity_id")
	private ProductBoardEntity productBoard;

	/** 평가 날짜. */
	@ColumnDefault("SYSDATE")
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	/** 삭제 유무. */
	@Column(length = 1)
	@ColumnDefault("0")
	private String isDelete;
	
	/** 전체 평균 점수. */
	@Column(nullable = false)
	private int score;

	/* 발음 점수 */
	@Column(nullable = false)
	private int pronunciation;
	
	/* 발음 점수 */
	@Column(nullable = false)
	private float speed;
	
	/** 톤 변화 그래프 */
	@Lob
	@Column(nullable = true)
	private String voice_graph;
	
	/** 톤 높낮이 평균 */
	@Column(nullable = true)
	private int tone_mean;
	
	/** 톤 높낮이에 대한 내용. */
	@Column(nullable = true)
	private String tone;

	/** 불필요한 단어사용에 대한 내용. */
	@Column(nullable = true, columnDefinition = "VARCHAR2(255) DEFAULT ''")
	private String fillerwords;
	
	@Column(nullable = true, columnDefinition = "VARCHAR2(255) DEFAULT ''")
	private String fillerweights;

	/** 평서문 대한 내용. */
	@Column(nullable = false)
	private int formal_speak;

	/** 의문문 대한 내용. */
	@Column(nullable = false)
	private int question_speak;

	/* 워드 클라우드 글자 */
	@Column(nullable = false)
	private String text;

	/* 워드 클라우드 글자 언급 횟수 */
	@Column(nullable = false)
	private String weight;
	
	/** 광대 변화율. */
	@Lob
	@Column(nullable = true)
	private String cheek;
	
	/** 입 변화율. */
	@Lob
	@Column(nullable = true)
	private String mouth;
	
	/** 미간 변화율. */
	@Lob
	@Column(nullable = true)
	private String brow;
		
	/** 팔자주름 변화율. */
	@Lob
	@Column(nullable = true)
	private String nasolabial;
	
	/** 눈 깜박임 횟수. */
	@Lob
	@Column(nullable = true)
	private String eye;

	/** 눈 깜박임 횟수 코멘트 */
	@Lob
	@Column(nullable = true)
	private String commentEye;
	
	/** 표정 분석 코멘트 */
	@Lob
	@Column(nullable = true)
	private String commentsFace;
	
	/** 표정 분석 코멘트 */
	@Column(nullable = true)
	private float total_time;
	
	/** 파일이름 */
	@Column(nullable = true)
	private String filename;
}
