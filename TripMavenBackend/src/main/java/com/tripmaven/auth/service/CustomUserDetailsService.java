package com.tripmaven.auth.service;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	//리포지토리 주입
		private final MembersRepository membersRepository;
		private final BCryptPasswordEncoder bCryptPasswordEncoder;
		
		
		public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
			//리포지토리 호출
			MembersEntity membersEntity = validateUser(email);
			
			//User는 UserDetails를 상속받은 Spring Security 에서 제공하는 클래스이다
			//물론 UserDetails를 직접 implements 받아서 구현해도 된다
			//직접 구현시에는 UserDetails인터페이스를 상속받아서 구현한후
			//return new MyUserDetails(users);
			
			return new CustomUserDetails(membersEntity);
			
			//조회한 사용자 정보를 저장
			
		}
		
		private MembersEntity validateUser(String email){
	        // 주어진 이메일로 사용자를 조회합니다. 사용자가 존재하지 않을 경우 UsernameNotFoundException 예외를 발생시킵니다.
	        MembersEntity membersEntity = membersRepository.findByEmail(email)
	                .orElseThrow(() -> new UsernameNotFoundException("존재하지 않는 이메일입니다: " + email));
	        // 사용자 계정이 삭제된 경우 UsernameNotFoundException 예외를 발생시킵니다.
	        if (membersEntity.getIsdelete()=="1") {
	            throw new DisabledException ("삭제된 계정입니다: " + email);
	        }
	        // 사용자 계정이 활성화되지 않은 경우 UsernameNotFoundException 예외를 발생시킵니다.
	        if (membersEntity.getIsactive()=="0") {
	            throw new LockedException("활성화되지 않은 계정입니다: " + email);
	        }
	        return membersEntity; // 유효한 사용자 정보를 반환합니다.
	    }
}
