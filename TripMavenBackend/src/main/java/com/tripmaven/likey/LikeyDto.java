package com.tripmaven.likey;


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
public class LikeyDto {

	private long id;
	private ProductBoardEntity productBoard;
	private MembersEntity member;
	
	//DTO를 ENTITY로 변환하는 메소드
	public LikeyEntity toEntity() {
		return LikeyEntity.builder()
				.id(id)
				.productBoard(productBoard)
				.member(member)
				.build();
	}
	//ENTITY를 DTO로 변환하는 메소드
	public static LikeyDto toDto(LikeyEntity likeyEntity) {
		return LikeyDto.builder()
				.id(likeyEntity.getId())
				.productBoard(likeyEntity.getProductBoard())
				.member(likeyEntity.getMember())
				.build();
	}
}
