package com.tripmaven.members.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.email.EmailVerificationResult;
import com.tripmaven.members.model.MembersDto;
import com.tripmaven.members.service.MembersService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;





@RestController
@RequiredArgsConstructor
public class MembersController {

	private final MembersService membersService;
	private final ObjectMapper mapper;
	
	
	//CREATE
	//회원가입
	@CrossOrigin
	@PostMapping("/signup")
	public ResponseEntity<MembersDto> signUp(@RequestBody Map map){ //RequestParam에서 Body로 변경
		try {
			//맵을 DTO로 변환하는 코드 (파라미터 명과 필드명을 일치시켜야 함 아마?)  
			//System.out.println(map.get("password"));
			MembersDto dto= mapper.convertValue(map, MembersDto.class);
			MembersDto insertedDto = membersService.signup(dto);
			if(insertedDto == null)	{
				Map<String, String> response = new HashMap<>();
			    response.put("message", "중복된 아이디입니다.");
			    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			    
			}
			return ResponseEntity.ok(insertedDto);			
		}
		catch (Exception e) {			
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	//가이드가 되어라!
	/** 라이센스 파일 업로드 필요.*/
	@PutMapping("/toguide/{membersid}")
	public ResponseEntity<MembersDto> toGuide(@PathVariable("membersid") String membersid){
		long membersId = Long.parseLong(membersid);
		MembersDto findMember =  membersService.searchByMemberID(membersId);		
		findMember.setRole("GUIDE");
		System.out.println(findMember);
		return ResponseEntity.ok(membersService.toguide(findMember));
	}
	
	//관리자가 되어라!
	@PutMapping("/toadmin/{membersid}")
	public ResponseEntity<MembersDto> toAdmin(@PathVariable("membersid") String membersid){
		MembersDto findMember =  membersService.searchByMemberID(Long.valueOf(membersid));
		findMember.setRole("ADMIN");
		System.out.println(findMember);
		return ResponseEntity.ok(membersService.toguide(findMember));
	}
	
	//READ
	//모든 회원 조회
	@CrossOrigin
	@GetMapping("/members")	
	public ResponseEntity<List<MembersDto>> getMembersAll(){
		try {
			List<MembersDto> usersList = membersService.membersAll();
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json").body(usersList);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	
	//회원 이메일 검색
	@CrossOrigin
	@GetMapping("/members/email/{email}")
	public ResponseEntity<MembersDto> getMemberByMemberEmail (@PathVariable("email") String email) {
		try {
			MembersDto dto = membersService.searchByMemberEmail(email);
			return ResponseEntity.ok(dto);
		}
		catch(Exception e) {	
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	} 	
	
	//회원 닉네임 검색
	@CrossOrigin
	@GetMapping("/members/name/{name}")
	public ResponseEntity<List<MembersDto>> getMemberByMemberName (@PathVariable("name") String name) {
		try {
			List<MembersDto> searchName = membersService.searchByMemberName(name);
			return ResponseEntity.ok(searchName);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	} 	
	
	//회원 아이디 검색
	@CrossOrigin
	@GetMapping("/members/id/{id}")
	public ResponseEntity<MembersDto> getMemberByMemberId (@PathVariable("id") Long id){
		try {
			System.out.println(id);
			MembersDto dto = membersService.searchByMemberID(id);
			return ResponseEntity.ok(dto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
			
	//UPDATE
	//회원 정보 수정
	@CrossOrigin
	@PutMapping("/members/{id}")	
	public ResponseEntity<MembersDto> usersUpdate(@PathVariable("id") Long id,@RequestBody MembersDto dto){
		try {
			MembersDto updatedDto = membersService.updateByMemberId(id,dto);
			return ResponseEntity.ok(updatedDto);
			
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	
	@CrossOrigin
	@PutMapping("/members/delete/{id}")	
	public ResponseEntity<MembersDto> usersdelete(@PathVariable("id") Long id){
		try {
			if(!membersService.searchByMemberID(id).getLoginType().equalsIgnoreCase("local")) {
				MembersDto deletedDto = membersService.deleteByMemberId(id);
				return ResponseEntity.ok(deletedDto);
			};
			MembersDto dto = membersService.setIsDelete(id);
			if(dto == null) {
				Map<String, String> response = new HashMap<>();
			    response.put("message", "삭제에 실패했습니다.");
			    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
			}
			return ResponseEntity.ok(dto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	@PutMapping("/members/activeonoff/{id}")	
	public ResponseEntity<MembersDto> activeOnOff(@PathVariable("id") Long id){
		try {
			MembersDto affecteddto = membersService.activeOnOff(id);
			System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+affecteddto.getIsactive());
			return ResponseEntity.ok(affecteddto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
	
	//DELETE
	//회원 정보 삭제
	@CrossOrigin
	@DeleteMapping("/members/{id}")	
	public ResponseEntity<MembersDto> removeMemberByMembersId(@PathVariable("id") Long id){
		try {
			MembersDto deletedDto = membersService.deleteByMemberId(id);
			return ResponseEntity.ok(deletedDto);
		}
		catch(Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	
	
	//이메일 인증 코드 요청
	// sendMessage(): 이메일 전송 API. 이메일을 파라미터로 받아 해당 membersService.sendCodeToEmail() 메서드로 넘겨준
	@CrossOrigin
	@PostMapping("/emails/coderequests")
	public ResponseEntity<String> sendMessage(@RequestParam("email") @Valid @Email String email) {
	    membersService.sendCodeToEmail(email);  // 이메일 코드 전송 로직

	    return ResponseEntity.ok("이메일 전송 성공");  // 성공 메시지 반환
	}

	
	//이메일 인증 검증 
	//verificationEmail(): 이메일 인증을 진행하는 API. 이메일과 사용자가 작성한 인증 코드를 파라미터로 받아 
	// MemberService.verifiedCode() 메서드로 넘긴. 성공하면true,실패 false반환
	@CrossOrigin
	@GetMapping("/emails/verifications")
	public ResponseEntity<Boolean> verificationEmail(@RequestParam("email") @Valid @Email String email,
			@RequestParam("code") String authCode) {
		EmailVerificationResult response = membersService.verifiedCode(email, authCode);  // EmailVerificationResult 객체 반환
		boolean isVerified = response.isSuccess();  // success 필드 값으로 인증 여부 확인

		return ResponseEntity.ok(isVerified);  // true 또는 false 반환
	}



	
}
