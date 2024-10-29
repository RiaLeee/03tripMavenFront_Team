package com.tripmaven.likey;

import java.util.List;


import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RestController;


import com.tripmaven.members.model.MembersDto;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersService;
import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productboard.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class LikeyController {

	private final LikeyService likeyService;
	private final MembersService membersService;
	private final ProductService productService;

	//게시글 별 찜가져오기는 양방향으로 설계해서 필요 없음
	//게시글 가져올때 같이 가져와짐
	
	//게시글 찜하기
	@PostMapping("/likey/{productId}/{memberId}")
	public ResponseEntity<LikeyDto> addWishList(
			@PathVariable("productId") Long productId,
			@PathVariable("memberId") Long memberId){
		try {
			System.out.println("productId: "+ productId);
			System.out.println("memberId: "+ memberId);
			MembersEntity member = membersService.searchByMemberID(memberId).toEntity();
			ProductBoardEntity productboard= productService.usersById(productId).toEntity();
			LikeyDto likeyDto = LikeyDto.builder().member(member).productBoard(productboard).build();
			LikeyDto createdLikeyDto = likeyService.addtoWishList(likeyDto);
			return ResponseEntity.ok(createdLikeyDto);
		}
		catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	//찜 삭제하기
	@DeleteMapping("/likey/{productId}/{memberId}")
	public ResponseEntity<String> removeFromWishlist(
			@PathVariable("productId") Long productId,
			@PathVariable("memberId") Long memberId) {
		try {
			MembersEntity member = membersService.searchByMemberID(memberId).toEntity();
			ProductBoardEntity productboard= productService.usersById(productId).toEntity();
			LikeyDto likeyDto = LikeyDto.builder().member(member).productBoard(productboard).build();
			boolean isDelete = likeyService.deletetoWishList(likeyDto);
			return ResponseEntity.ok(String.valueOf(isDelete));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("찜 제거에 실패했습니다.");
		}
	}
	
	//회원번호로 찜 가져오기 (내 찜 목록 시 사용)
	@GetMapping("/likey/{memberId}")
	public ResponseEntity<List<LikeyDto>> getLikeById (@PathVariable("memberId") Long memberId) {
		try {
			MembersDto dto= membersService.searchByMemberID(memberId);
			List<LikeyDto> likeyDto= likeyService.findAllById(dto.getId());
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json").body(likeyDto);

		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	
	
}
