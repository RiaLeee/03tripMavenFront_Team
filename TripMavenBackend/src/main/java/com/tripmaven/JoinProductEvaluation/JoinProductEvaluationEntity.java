package com.tripmaven.JoinProductEvaluation;

import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tripmaven.chattingmessage.ChattingMessageEntity;
import com.tripmaven.chattingroom.ChattingRoomEntity;
import com.tripmaven.joinchatting.JoinChattingEntity;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productevaluation.ProductEvaluationEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "JoinProductEvaluation")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinProductEvaluationEntity {
	
	/** 테스트 1회당 ai 평가 고유 번호.(총 2개 묶은 것 의미) PK*/
	@Id
	@SequenceGenerator(name="seq_joinproductEvaluation",sequenceName = "seq_joinproductEvaluation",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_joinproductEvaluation")
	private long id;
	
	/** 묶어줄 ai 결과들(양방향) FK*/
	@OneToMany(mappedBy = "joinProductEvaluation",cascade = CascadeType.REMOVE, orphanRemoval = true)
	@JsonIgnore
	private List<ProductEvaluationEntity> productEvaluation;
	
	/** 회원 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="membersentity_id")
	private MembersEntity member;
	
	/** 가이드 상품 고유 번호. FK */
	@ManyToOne(optional = false)
	@JoinColumn(name = "productboardentity_id")
	private ProductBoardEntity productBoard;
}
