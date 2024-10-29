package com.tripmaven.productboard;

import java.time.LocalDateTime;
import java.util.List;

import com.tripmaven.likey.LikeyEntity;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.productevaluation.ProductEvaluationEntity;

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
public class ProductBoardDto {

	private long id;
	private MembersEntity member;
	private List<LikeyEntity> likey;
	private List<ProductEvaluationEntity> productEvaluation;
	private String day;
	private String title;
	private String content;	
	private LocalDateTime createdAt;
	private String isActive;
	private String isEvaluation;
	private String city;
	private LocalDateTime updatedAt;
	private String isUpdate;
	private LocalDateTime deletedAt;
	private String isDelete;
	private String files;
	private String hashtag;
	private String hotel;
	private String hotelAd;
	
	//DTO를 ENTITY로 변환하는 메소드
		public ProductBoardEntity toEntity() {
			return ProductBoardEntity.builder()
					.id(id)
					.member(member)
					.likey(likey)
					.productEvaluation(productEvaluation)
					.day(day)
					.title(title)
					.content(content)
					.createdAt(createdAt)
					.isActive(isActive)
					.isEvaluation(isEvaluation)
					.city(city)
					.updatedAt(updatedAt)
					.isUpdate(isUpdate)
					.deletedAt(deletedAt)
					.isDelete(isDelete)
					.files(files)
					.hashtag(hashtag)
					.hotel(hotel)
					.hotelAd(hotelAd)					
					.build();
		}
		//ENTITY를 DTO로 변환하는 메소드
		public static ProductBoardDto toDto(ProductBoardEntity productBoardEntity) {
			return ProductBoardDto.builder()
					.id(productBoardEntity.getId())
					.member(productBoardEntity.getMember())
					.likey(productBoardEntity.getLikey())
					.productEvaluation(productBoardEntity.getProductEvaluation())
					.day(productBoardEntity.getDay())
					.title(productBoardEntity.getTitle())
					.content(productBoardEntity.getContent())
					.createdAt(productBoardEntity.getCreatedAt())
					.isActive(productBoardEntity.getIsActive())
					.isEvaluation(productBoardEntity.getIsEvaluation())
					.city(productBoardEntity.getCity())
					.updatedAt(productBoardEntity.getUpdatedAt())
					.isUpdate(productBoardEntity.getIsUpdate())
					.deletedAt(productBoardEntity.getDeletedAt())
					.isDelete(productBoardEntity.getIsDelete())
					.files(productBoardEntity.getFiles())
					.hashtag(productBoardEntity.getHashtag())
					.hotel(productBoardEntity.getHotel())
					.hotelAd(productBoardEntity.getHotelAd())
					.build();
					
		}
}
