package com.tripmaven.report;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;


import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ReportService {
	
	private final ReportRepository reportRepository;  
	private final ObjectMapper objectMapper;
	

	//신고 등록
	@Transactional
	public ReportDto create(ReportDto reportDto) {
		return ReportDto.toDto(reportRepository.save(reportDto.toEntity()));
	}


    //전체 조회
	@Transactional(readOnly = true)
	public List<ReportDto> listAll() {
		List<ReportEntity> inquireEntityList= reportRepository.findAll();	
		// 엔터티 리스트를 dto 로 변환
		return objectMapper.convertValue(inquireEntityList,
										objectMapper.getTypeFactory().defaultInstance()
										.constructCollectionLikeType(List.class, ReportDto.class));
	}
	
	
	// 신고내역 조회 아이디 (해당 게시글 )
	public ReportDto findByMemberIdAndProductId(Long memberId,Long productId) {
		
		Optional<ReportEntity> optional = reportRepository.findByMember_IdAndProductBoard_Id(memberId, productId);
		System.out.println(optional.isPresent());
		ReportDto dto = null;
		if(optional.isPresent()) {
			dto = ReportDto.toDto(optional.get());
		}
		
		return dto;
	}
	
	// 신고내역 조회 (해당 게시글 )
		public List<ReportDto> findByProductId(Long productId) {		
			List<ReportEntity> list = reportRepository.findByProductBoard_Id(productId);
			return objectMapper.convertValue(list,objectMapper.getTypeFactory().defaultInstance().constructCollectionLikeType(List.class, ReportDto.class));
		}
}
