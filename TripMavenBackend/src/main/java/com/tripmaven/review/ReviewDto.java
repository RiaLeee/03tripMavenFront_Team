package com.tripmaven.review;

import java.time.LocalDateTime;

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
public class ReviewDto {


	//필드
	private long id;
	private MembersEntity member;
	private ProductBoardEntity productBoard;
	private double ratingScore;
	private String title;
	private String comments;
	private LocalDateTime createdAt;
	private String isactive;
	private LocalDateTime updatedAt;
	private String isupdate;
	private LocalDateTime deletedAt;
	private String isdelete;

	//DTO를 ENTITY로 변환하는 메소드
	public ReviewEntity toEntity() {
		return ReviewEntity.builder()
				.id(id)
				.member(member)
				.productBoard(productBoard)
				.ratingScore(ratingScore)
				.title(title)
				.comments(comments)
				.createdAt(createdAt)
				.isactive(isactive)
				.updatedAt(updatedAt)
				.isupdate(isupdate)
				.deletedAt(deletedAt)
				.isdelete(isdelete)
				.build();
	}

	//ENTITY를 DTO로 변환하는 메소드
	public static ReviewDto toDto(ReviewEntity reviewEntity) {
		return ReviewDto.builder()
				.id(reviewEntity.getId())
				.member(reviewEntity.getMember())
				.productBoard(reviewEntity.getProductBoard())
				.ratingScore(reviewEntity.getRatingScore())
				.title(reviewEntity.getTitle())
				.comments(reviewEntity.getComments())
				.createdAt(reviewEntity.getCreatedAt())
				.isactive(reviewEntity.getIsactive())
				.updatedAt(reviewEntity.getUpdatedAt())
				.isupdate(reviewEntity.getIsupdate())
				.deletedAt(reviewEntity.getDeletedAt())
				.isdelete(reviewEntity.getIsdelete())
				.build();
	}
}
