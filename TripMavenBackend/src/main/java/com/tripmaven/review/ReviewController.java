package com.tripmaven.review;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersService;

import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productboard.ProductService;


import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
@CrossOrigin
public class ReviewController {
	
	private final ReviewService reviewService;
	private final ObjectMapper mapper;
	private final MembersService membersService;
	private final ProductService productService;

	
	//CREATE (리뷰 등록)
	@PostMapping("/post")	
	public ResponseEntity<ReviewDto> createReview(@RequestBody Map map) {
		try {
			String member_id = map.get("member_id").toString();
			System.out.println("리뷰 컨트롤러 들어옴, member_id" +member_id);
			MembersEntity members =  membersService.searchByMemberID(Long.parseLong(member_id)).toEntity();
			String productboard_id = map.get("productboard_id").toString();
			ProductBoardEntity productboard = productService.usersById(Long.parseLong(productboard_id)).toEntity();		
			ReviewDto reviewDto = mapper.convertValue(map, ReviewDto.class);	
			
			reviewDto.setMember(members);
			reviewDto.setProductBoard(productboard);;
			ReviewDto createReview = reviewService.create(reviewDto);	
			return ResponseEntity.ok(createReview);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	// READ 가이드 측 게시글 조회(cs엔터티 PK_id로)	
	@GetMapping("/{id}")
	public ResponseEntity<ReviewDto> getPostById(@PathVariable("id") Long id){
		try {
			ReviewDto dto= reviewService.usersById(id);
			return ResponseEntity.ok(dto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);			
		}		
	}

	// READ (상품id 로 리뷰들 조회)
	@GetMapping("/product/{productboard_id}")
	public ResponseEntity<List<ReviewDto>> getReviewByProductId(@PathVariable("productboard_id") long productboard_id){
		try {
			System.out.println("리뷰 컨트롤러 들어옴");
			List<ReviewDto> dto= reviewService.reviewByProductId(productboard_id);
			//System.out.println("컨트롤러 dto: "+dto.getProductBoard());
			return ResponseEntity.ok(dto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);			
		}		
	}
	

	
	// READ (회원id 로 리뷰들 조회)
	@GetMapping("/member/{memberId}")
	public ResponseEntity<List<ReviewDto>> getReviewByMemberId(@PathVariable("memberId") long memberId){
		try {
			System.out.println("리뷰 컨트롤러 들어옴");
			List<ReviewDto> dto= reviewService.reviewByMemberId(memberId);
			return ResponseEntity.ok(dto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);			
		}		
	}
	
	// UPDATE (리뷰 수정)
	@PutMapping("/{id}")
	public ResponseEntity<ReviewDto> updateReviewById(@PathVariable("id") long id, @RequestBody Map map){
		try {
			ReviewDto dto = mapper.convertValue(map, ReviewDto.class);
			ReviewDto updatedDto= reviewService.updateById(id,dto);
			return ResponseEntity.ok(updatedDto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);			
		}		
	}
	
	// DELETE (리뷰 삭제)
	@DeleteMapping("/{id}")
	public ResponseEntity<ReviewDto> deleteReviewById(@PathVariable("id") long id){
		try {
			ReviewDto deletedDto= reviewService.deleteById(id);
			return ResponseEntity.ok(deletedDto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);			
		}		
	}
	
	
	
	


}
