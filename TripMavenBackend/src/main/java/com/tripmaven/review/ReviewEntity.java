package com.tripmaven.review;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productboard.ProductBoardEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "Review")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewEntity {

	/** 상품 고유 번호/신고 대상자. PK*/
	@Id
	@SequenceGenerator(name="seq_review",sequenceName = "seq_review",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_review")
	private long id;
	
	/** 회원 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="membersentity_id")
	private MembersEntity member;
	
	/** 가이드 상품 고유 번호 FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name = "productboardentity_id")
	private ProductBoardEntity productBoard;
	
	/** 별점매기기 */
	@Column(nullable = false)
	private double ratingScore;
	
	/** 리뷰 제목 */
	@Column(nullable = false)
	private String title;
	
	/** 리뷰 내용 */
	@Column(nullable = false)
	private String comments;
	
	/** 리뷰 날짜 */
	@ColumnDefault("SYSDATE")
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	/** 활성화 여부 */
	@Column(length = 1)
	@ColumnDefault("1")
	private String isactive;
	
	/** 수정 날짜. */
	@CreationTimestamp
	private LocalDateTime updatedAt;

	/** 수정 여부. */
	@Column(nullable = false,length = 1)
	@ColumnDefault("0")
	private String isupdate;

	/** 삭제 날짜. */
	@CreationTimestamp
	private LocalDateTime deletedAt;

	/** 삭제 여부. */
	@Column(nullable = false,length = 1)
	@ColumnDefault("0")
	private String isdelete;
	
	// DataIntegrityViolationException 에러 방지
	@PrePersist
	public void prePersist() {		
		if (this.isupdate == null) {
			this.isupdate = "0";  // 저장하기 전에 기본값 설정
		}
		if (this.isdelete == null) {
			this.isdelete = "0";  // 저장하기 전에 기본값 설정
		}
	}


}
