package com.tripmaven.productboard;


import java.time.LocalDateTime;

import java.util.List;

import java.util.Vector;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.csboard.CSBoardDto;

import com.tripmaven.members.model.MembersDto;
import com.tripmaven.members.service.MembersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final MembersRepository membersRepository;
	private final ObjectMapper objectMapper;

	//CREATE (게시글 등록)
	@Transactional
	public ProductBoardDto create(ProductBoardDto dto) {
		return ProductBoardDto.toDto(productRepository.save(dto.toEntity()));
	}

	

	//READ 관리자 측 전체 게시글 조회
	@Transactional(readOnly = true)
	public Page<ProductBoardDto> listAll(String page, String size) {
		// 리포지토리 호출
		Page<ProductBoardEntity> postEntityList= productRepository.findAll(PageRequest.of(Integer.parseInt(page), Integer.parseInt(size), Sort.by(Sort.Direction.ASC, "id")));	
		// 엔터티 리스트를 dto 로 변환
		return postEntityList.map(post->ProductBoardDto.toDto(post));
//		return objectMapper.convertValue(postEntityList.getContent(),
//										objectMapper.getTypeFactory().defaultInstance()
//										.constructCollectionLikeType(List.class, ProductBoardDto.class));
	}
	
	
	// READ 가이드 측 게시글 조회(회원엔터티 FK_email로 조회)
	@Transactional(readOnly = true)
	public MembersDto usersByEmail(String email) {
		return MembersDto.toDto(membersRepository.findByEmail(email).get());
	}
	

	
	// READ 가이드 측 게시글 가져오기
	@Transactional(readOnly = true)
	public List<ProductBoardDto> findAllById(long memberId) {
		// 리포지토리 호출
		List<ProductBoardEntity> postEntityList= productRepository.findAllByMemberId(memberId);	
		System.out.println("상품 서비스 postEntityList : "+postEntityList.size());
		// 엔터티 리스트를 dto 로 변환
		return objectMapper.convertValue(postEntityList,
										objectMapper.getTypeFactory().defaultInstance()
										.constructCollectionLikeType(List.class, ProductBoardDto.class));
	}
	
	
	
	// READ 가이드 측 내 상품 조회(cs엔터티 PK_id로)	
	public ProductBoardDto usersById(Long id) {
		return ProductBoardDto.toDto(productRepository.findById(id).get());
	}
	
	
	
	
	//UPDATE (게시글 수정)
	@Transactional
	public ProductBoardDto update(Long id,ProductBoardDto dto) {
		ProductBoardEntity productBoardEntity=productRepository.findById(id).get();
		
		productBoardEntity.setTitle(dto.getTitle());
		productBoardEntity.setContent(dto.getContent());
		productBoardEntity.setDay(dto.getDay());
		productBoardEntity.setHashtag(dto.getHashtag());
		productBoardEntity.setFiles(dto.getFiles());
		productBoardEntity.setCity(dto.getCity());
		productBoardEntity.setIsUpdate("1"); //수정여부
		productBoardEntity.setUpdatedAt(LocalDateTime.now()); //수정시간
		
		return ProductBoardDto.toDto(productRepository.save(productBoardEntity));
	}
	
	//DELETE (게시글 삭제)
	@Transactional
	public ProductBoardDto delete(long id) {
		ProductBoardDto deletedDto=ProductBoardDto.toDto(productRepository.findById(id).get());
		productRepository.deleteById(id);
		return deletedDto;
	}
	

	
	
	//게시글 검색	
	//게시글 검색 -제목
	@Transactional(readOnly = true)
	public List<ProductBoardDto> searchByTitle(String findTitle) {
		List<ProductBoardEntity> products = productRepository.findByTitleContaining(findTitle);
		List<ProductBoardDto> productsDto = new Vector<>();
		for(ProductBoardEntity product : products) {
			productsDto.add(ProductBoardDto.toDto(product));
		} 
		return productsDto;
	}

	public CSBoardDto searchByProductId(long long1) {
		
		return null;
	}
	

	//게시글 검색 -도시
	@Transactional(readOnly = true)
	public List<ProductBoardDto> searchByCity(String findCity, String page, String size) {
		Page<ProductBoardEntity> products=productRepository.findByCityContaining(findCity, PageRequest.of(Integer.parseInt(page), Integer.parseInt(size)));
		return objectMapper.convertValue(products.getContent(),
				objectMapper.getTypeFactory().defaultInstance()
				.constructCollectionLikeType(List.class, ProductBoardDto.class));
	}
	


	
	//게시글 검색 -제목+내용
	@Transactional(readOnly = true)
	public List<ProductBoardDto> searchByKeyword(String keyword, String page, String size) {
		Page<ProductBoardEntity> products = productRepository.findByTitleContainingOrContentContainingOrCityContainingOrMember_NameContainingOrHashtagContaining(keyword,keyword,keyword,keyword,keyword, PageRequest.of(Integer.parseInt(page), Integer.parseInt(size), Sort.by(Sort.Direction.DESC, "createdAt")));
		return objectMapper.convertValue(products.getContent(),
				objectMapper.getTypeFactory().defaultInstance()
				.constructCollectionLikeType(List.class, ProductBoardDto.class));
	}


	




	

	



	


}
