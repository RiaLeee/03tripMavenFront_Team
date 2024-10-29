package com.tripmaven.csboard;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface CSBoardRepository extends JpaRepository<CSBoardEntity, Long>{


	// 문의 내용 검색
	// 문의 내용 검색 -제목
	List<CSBoardEntity> findByTitleContaining(String findTitle);

	// 문의 내용 검색 -내용
	List<CSBoardEntity> findByContentContaining(String findContent);

	// 문의 내용 검색 -제목+내용
	List<CSBoardEntity> findByTitleOrContentContaining(String title, String content);

	// READ 가이드 측 문의내역 조회(회원엔터티 FK_email로 조회)
	List<CSBoardEntity> findByMember_Id(long id);

	

	
	
	
	

	
	



    
}
