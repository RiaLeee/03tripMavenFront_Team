package com.tripmaven.csboard;

import java.time.LocalDateTime;

import com.tripmaven.members.model.MembersEntity;

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
public class CSBoardDto {

    private long id;
    private MembersEntity member;
    private String title;
    private String content;
    private String comments;
    private LocalDateTime createdAt;
    private String isActive;
    private LocalDateTime updatedAt;
    private String isUpdate;
    private LocalDateTime deletedAt;
    private String isDelete;
    
  //DTO를 ENTITY로 변환하는 메소드
  	public CSBoardEntity toEntity() {
  		return CSBoardEntity.builder()
  				.id(id)
  				.member(member)
  				.title(title)
  				.content(content)
  				.comments(comments)
  				.createdAt(createdAt)
  				.isActive(isActive)
  				.updatedAt(updatedAt)
  				.isUpdate(isUpdate)
  				.deletedAt(deletedAt)
  				.isDelete(isDelete)
  				.build();
  	}
  	
  	//ENTITY를 DTO로 변환하는 메소드
	public static CSBoardDto toDto(CSBoardEntity csBoardEntity) {
		return CSBoardDto.builder()
  				.id(csBoardEntity.getId())
  				.member(csBoardEntity.getMember())
  				.title(csBoardEntity.getTitle())
  				.content(csBoardEntity.getContent())
  				.comments(csBoardEntity.getComments())
  				.createdAt(csBoardEntity.getCreatedAt())
  				.isActive(csBoardEntity.getIsActive())
  				.updatedAt(csBoardEntity.getUpdatedAt())
  				.isUpdate(csBoardEntity.getIsUpdate())
  				.deletedAt(csBoardEntity.getDeletedAt())
  				.isDelete(csBoardEntity.getIsDelete()) 				
  				.build();
	}
}
