package com.tripmaven.report;


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
public class ReportDto {

    private long id;
    private ProductBoardEntity productBoard;
    private MembersEntity member;
    private String etc;
    private String isactive;
    private String attitude;
    private String information;
    private String disgust;
    private String offensive;
    private String noShow;
    private LocalDateTime createdAt;
	
	//DTO를 ENTITY로 변환하는 메소드
    public ReportEntity toEntity() {
        return ReportEntity.builder()
                .id(id)
                .productBoard(productBoard)
                .member(member)
                .etc(etc)
                .isactive(isactive)
                .attitude(attitude)
                .information(information)
                .disgust(disgust)
                .offensive(offensive)
                .noShow(noShow)
                .createdAt(createdAt)
                .build();
    }
	//ENTITY를 DTO로 변환하는 메소드
    public static ReportDto toDto(ReportEntity reportEntity) {
        return ReportDto.builder()
                .id(reportEntity.getId())
                .productBoard(reportEntity.getProductBoard())
                .member(reportEntity.getMember())
                .etc(reportEntity.getEtc())
                .isactive(reportEntity.getIsactive())
                .attitude(reportEntity.getAttitude())
                .information(reportEntity.getInformation())
                .disgust(reportEntity.getDisgust())
                .offensive(reportEntity.getOffensive())
                .noShow(reportEntity.getNoShow())
                .createdAt(reportEntity.getCreatedAt())
                .build();
    }
}