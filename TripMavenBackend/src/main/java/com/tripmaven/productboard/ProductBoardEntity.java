package com.tripmaven.productboard;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tripmaven.likey.LikeyEntity;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productevaluation.ProductEvaluationEntity;
import com.tripmaven.review.ReviewEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
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

@Table(name = "ProductBoard")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
public class ProductBoardEntity {

	/** 가이드 상품 고유 번호. PK*/
	@Id
	@SequenceGenerator(name="seq_productboard",sequenceName = "seq_productboard",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_productboard")
	private long id;
	
	/** 회원 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="membersentity_id")
	private MembersEntity member;
	
	/** 찜. (양방향) FK*/
	@OneToMany(mappedBy = "productBoard",cascade = CascadeType.REMOVE)
	@OrderBy("id DESC")
	@JsonIgnore
	private List<LikeyEntity> likey;
	
	/** AI평가 고유 번호. FK (양방향)*/
	@OneToMany(mappedBy = "productBoard",cascade = CascadeType.REMOVE)
	@OrderBy("id DESC")
	@JsonIgnore
	private List<ProductEvaluationEntity> productEvaluation;
	
	/** AI평가 고유 번호. FK (양방향)*/
	@OneToMany(mappedBy = "productBoard",cascade = CascadeType.REMOVE)
	@OrderBy("id DESC")
	@JsonIgnore
	private List<ReviewEntity> review;
	
	/** 여행 일수 FK*/
	@Column(length = 20, nullable = false)
	private String day;
	/* (양방향)
	@OneToMany(mappedBy = "productBoard",cascade = CascadeType.REMOVE)
	@OrderBy("id DESC")
	@JsonIgnore
	private List<TripDaysEntity> tripDays;
	 */
	
	/** 제목 */
	@Column(length = 20, nullable = false)
	private String title;
	
	/** 내용 */
	@Lob
	@Column
	private String content;	
	
	/** 생성날짜 */
	@ColumnDefault("SYSDATE")
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	/** 활성화 유무 */
	@Column(length = 1)
	@ColumnDefault("1")
	private String isActive;
	
	/** Al평가 유무 */
	@Column(length = 1)
	@ColumnDefault("1")
	private String isEvaluation;
	
	/** 여행도시 */
	@Column(length = 30, nullable = false)
	private String city;
	
	/** 수정날짜 */
	private LocalDateTime updatedAt;
	
	/** 수정여부 */
	@Column(length = 1)
	@ColumnDefault("0")
	private String isUpdate;
	
	/** 삭제날짜 */
	private LocalDateTime deletedAt;
	
	/** 삭제여부 */
	@Column(length = 1)
	@ColumnDefault("0")
	private String isDelete;
	
	/**파일*/
	@Column
	@Lob
	private String files;
	
	/**해시태그*/
	@Column
	private String hashtag;
	
	/**호텔명*/
	@Column
	private String hotel;
	
	/**호텔 주소*/
	@Column
	private String hotelAd;
	
	
	
}
