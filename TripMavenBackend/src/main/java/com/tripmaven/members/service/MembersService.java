package com.tripmaven.members.service;


import java.util.List;
import java.util.Optional;

import java.util.Random;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.email.EmailService;
import com.tripmaven.email.EmailVerificationResult;
import com.tripmaven.email.RedisService;
import com.tripmaven.members.model.MembersDto;
import com.tripmaven.members.model.MembersEntity;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MembersService {

	private final MembersRepository membersRepository;
	private final ObjectMapper objectMapper;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	 private static final String AUTH_CODE_PREFIX = "AuthCode "; //이메일 인증 코드와 관련된 데이터를 Redis에 저장할 때 이 상수를 사용
	 private final EmailService emailService;
	 private final RedisService redisService;

	 @Value("${spring.mail.auth-code-expiration-millis}")
	    private long authCodeExpirationMillis;

	
	//CREATE
	//회원가입
	@Transactional
	public MembersDto signup(MembersDto dto) {
		
		boolean isDuplicated = membersRepository.existsByEmail(dto.getEmail()); //증복확인
		if(!isDuplicated) {
			//암호화
			dto.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
			//역할 DTO에서 받아왔잖아~
			
			return MembersDto.toDto(membersRepository.save(dto.toEntity()));
		}
		else {
			MembersDto findMember = MembersDto.toDto(membersRepository.findByEmail(dto.getEmail()).get());
			boolean isSocial = findMember.getLoginType()!=null && !findMember.getLoginType().equalsIgnoreCase("local") ; //소셜인지 확인.
			if(isDuplicated && !isSocial) return null;
			if(isSocial) {
				findMember.setName(dto.getName());
				findMember.setPassword(dto.getPassword());
				findMember.setInterCity(dto.getInterCity());
				findMember.setGender(dto.getGender());
				findMember.setBirthday(dto.getBirthday());
				findMember.setAddress(dto.getAddress());
				dto=findMember;
				
			}
			//암호화
			dto.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
			//역할 DTO에서 받아왔잖아~
			
			return MembersDto.toDto(membersRepository.save(dto.toEntity()));
		}
	}
	
	
	
	//READ
	//모든 회원 조회
	@Transactional(readOnly = true)
	public List<MembersDto> membersAll() {
		List<MembersEntity> membesrEntityList1 = membersRepository.findAll();
		return objectMapper.convertValue(membesrEntityList1, objectMapper.getTypeFactory().defaultInstance().constructCollectionType(List.class,MembersDto.class));
	}
	
	//한사람 회원 이메일으로 검색
	@Transactional(readOnly = true)
	public MembersDto searchByMemberEmail(String email) {		
		return MembersDto.toDto(membersRepository.findByEmail(email).orElse(null));
	}
	
	//모든 회원 닉네임으로 검색
	@Transactional(readOnly = true)
	public List<MembersDto> searchByMemberName(String name) {		
		List<MembersEntity> membersEntityList2 = membersRepository.findByName(name);
		return objectMapper.convertValue(membersEntityList2, objectMapper.getTypeFactory().defaultInstance().constructCollectionType(List.class,MembersDto.class));
	}
	
	//회원 아이디로 검색
	@Transactional(readOnly = true)
	public MembersDto searchByMemberID(Long id) {
		//System.out.println(id);
		return MembersDto.toDto(membersRepository.findById(id).orElse(null));
	}
	
	//로그인 아이디를 통해 멤버 DTO구하기
	public MembersDto getLoginMemberByLoginId(String loginId) {
		if(loginId == null) return null;
		MembersEntity membersEntity= membersRepository.findByEmail(loginId).get();
		return MembersDto.toDto(membersEntity);
	}
	
	
	//UPDATE
	//회원 정보 수정
	@Transactional
	public MembersDto updateByMemberId(Long id, MembersDto dto) {
		MembersEntity members=membersRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Member not found with id: " + id));
		
		if (dto.getName() != null) members.setName(dto.getName());
	    if (dto.getAddress() != null) members.setAddress(dto.getAddress());
	    if (dto.getBirthday() != null) members.setBirthday(dto.getBirthday());
	    if (dto.getGender() != null) members.setGender(dto.getGender());
	    if (dto.getIntroduce() != null) members.setIntroduce(dto.getIntroduce());
	    if (dto.getKeywords() != null) members.setKeywords(dto.getKeywords());
	    if (dto.getProfile() != null) members.setProfile(dto.getProfile());
	    if (dto.getTelNumber() != null) members.setTelNumber(dto.getTelNumber());
	    if (dto.getInterCity() != null) members.setInterCity(dto.getInterCity());
	    if (dto.getGuidelicense() != null) members.setGuidelicense(dto.getGuidelicense());
	    if (dto.getPassword() != null ) members.setPassword(bCryptPasswordEncoder.encode(dto.getPassword()));
		return MembersDto.toDto(membersRepository.save(members));
	}
	
	//가이드 변환 로직
	@Transactional
	public MembersDto toguide(MembersDto findMember) {
		return MembersDto.toDto(membersRepository.save(findMember.toEntity()));
	}
	
	//DELETE
	//회원 정보 삭제
	@Transactional
	public MembersDto deleteByMemberId(Long id) {
		MembersDto deletedDto=MembersDto.toDto(membersRepository.findById(id).get());
		membersRepository.deleteById(id);
		return deletedDto;
	}
	
	

	//isdelete와 isactive를 수정합니다.
	@Transactional
	public MembersDto setIsDelete(Long id) {
		
		Optional<MembersEntity> optional = membersRepository.findById(id);
		
		if(optional.isPresent()) {
			MembersEntity entity = optional.get();
			entity.setIsdelete("1");
			entity.setIsactive("0");
			return MembersDto.toDto(membersRepository.save(entity));
		}
		return null;
		
	}

	//isactive를 수정합니다.
	@Transactional
	public MembersDto activeOnOff(Long id) {
		Optional<MembersEntity> optional = membersRepository.findById(id);	
		if(optional.isPresent()) {
			MembersEntity entity = optional.get();
			System.out.println("tjqltm"+entity.getIsactive().equals("1"));
			if(entity.getIsactive().equals("1")) {
				entity.setIsactive("0");
				return MembersDto.toDto(membersRepository.save(entity));
			}
			if(entity.getIsactive().equals("0")) {
				entity.setIsactive("1");
				return MembersDto.toDto(membersRepository.save(entity));
			}			
			
		}
		return null;
	}


	
	// sendCodeToEmail(): 인증 코드를 생성 후 수신자 이메일로 발송하는 메서드.
	// 이후 인증 코드를 검증하기 위해 생성한 인증 코드를 Redis에 저장
    public void sendCodeToEmail(String toEmail) {
        this.checkDuplicatedEmail(toEmail);
        String title = "TripMaven이메일 인증 번호";
        String authCode = this.createCode();
        emailService.sendEmail(toEmail, title, authCode);
        // 이메일 인증 요청 시 인증 번호 Redis에 저장 ( key = "AuthCode " + Email / value = AuthCode )
        redisService.setDataExpire(AUTH_CODE_PREFIX + toEmail, authCode, this.authCodeExpirationMillis / 1000); // 밀리초를 초로 변환

    }
    //checkDuplicatedEmail(): 회원가입하려는 이메일로 이미 가입한 회원이 있는지 확인하는 메서드. 
    //  만약 해당 이메일을 가진 회원이 존재하면 예외를 발생한다.
    private void checkDuplicatedEmail(String email) {
        Optional<MembersEntity> member = membersRepository.findByEmail(email);
        if (member.isPresent()) {
        System.out.println("이미 사용 중인 이메일입니다: " + email);
        }
    }
    
	// creatCode(): 6자리의 랜덤한 인증 코드를 생성하여 반환하는 메서드
    private String createCode() {
        int length = 6;
        Random random = new Random();  // SecureRandom이란게 있는데....
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < length; i++) {
            builder.append(random.nextInt(10));  
        }
        return builder.toString();
    }

    
   
    public EmailVerificationResult verifiedCode(String email, String authCode) {
        this.checkDuplicatedEmail(email);
        String redisAuthCode = redisService.getData(AUTH_CODE_PREFIX + email);
        boolean authResult =  redisAuthCode != null && redisAuthCode.equals(authCode);;

        String message = authResult ? "인증 성공" : "인증 실패";
        
        return new EmailVerificationResult(authResult, message);
       
    }
    
     //////
}////
