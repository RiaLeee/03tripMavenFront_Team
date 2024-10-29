package com.tripmaven.members.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
public class MembersDto {

	private long id;
	private String email;
	private String name;
	private String password;
	private String gender;
	private LocalDate birthday;
	private String telNumber;
	private String address;
	private String profile;
	private String introduce;
	private String keywords;
	private String isactive;
	private LocalDateTime createdAt;
	private String role;
	private String guidelicense;
	private String loginType;
	private String snsAccessToken;
	private String interCity;
	
	//DTO를 ENTITY로 변환하는 메소드.
	public MembersEntity toEntity() {
		return MembersEntity.builder()
				.id(id)
				.email(email)
				.name(name)
				.password(password)
				.gender(gender)
				.birthday(birthday)
				.telNumber(telNumber)
				.address(address)
				.profile(profile)
				.introduce(introduce)
				.keywords(keywords)
				.isactive(isactive)
				.createdAt(createdAt)
				.role(role)
				.guidelicense(guidelicense)
				.loginType(loginType)
				.snsAccessToken(snsAccessToken)
				.interCity(interCity)
				.build();
	}
		
	//Entity를 DTO로 변환하는 메소드
	public static MembersDto toDto(MembersEntity membersEntity) {
		return MembersDto.builder()
				.id(membersEntity.getId())
				.email(membersEntity.getEmail())
				.name(membersEntity.getName())
				.password(membersEntity.getPassword())
				.gender(membersEntity.getGender())
				.birthday(membersEntity.getBirthday())
				.telNumber(membersEntity.getTelNumber())
				.address(membersEntity.getAddress())
				.profile(membersEntity.getProfile())
				.introduce(membersEntity.getIntroduce())
				.keywords(membersEntity.getKeywords())
				.isactive(membersEntity.getIsactive())
				.createdAt(membersEntity.getCreatedAt())
				.role(membersEntity.getRole())
				.guidelicense(membersEntity.getGuidelicense())
				.loginType(membersEntity.getLoginType())
				.snsAccessToken(membersEntity.getSnsAccessToken())
				.interCity(membersEntity.getInterCity())
				.build();
	}

}
