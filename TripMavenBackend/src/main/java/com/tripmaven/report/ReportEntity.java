package com.tripmaven.report;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "Report")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
public class ReportEntity {

	/** 신고 고유 번호 PK*/
	@Id
	@SequenceGenerator(name="seq_report",sequenceName = "seq_report",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_report")
	private long id;
	
	/** 가이드 상품 고유 번호 FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name = "productboard_id")
	private ProductBoardEntity productBoard;
	
	/** 회원 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="member_id")
	private MembersEntity member;
	
	/** 기타 */
	@Column(length = 20)
	private String etc;
	
	/** 신고 날짜 */
	@ColumnDefault("SYSDATE")
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	/** 활성화 여부 */
	@Column(length = 1)			
	@ColumnDefault("1")
	private String isactive;
	
	/** 평가항목 : 불친절한 태도 */
	@Column(nullable = true, length = 20)
	private String attitude;
	
	/** 평가항목 : 부정확한 정보 */
	@Column(nullable = true, length = 20)
	private String information;
	
	/** 평가항목 : 혐오발언 */
	@Column(nullable = true, length = 20)
	private String disgust;
	
	/** 평가항목 : 공격적인 언어 */
	@Column(nullable = true, length = 20)
	private String offensive;
	
	/** 평가항목 : 예약 불이행 */
	@Column(nullable = true, length = 20)
	private String noShow;

	//
}
