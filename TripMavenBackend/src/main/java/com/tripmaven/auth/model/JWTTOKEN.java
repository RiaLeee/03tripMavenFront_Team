package com.tripmaven.auth.model;


import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersRepository;

import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JWTTOKEN {
	private static SecretKey secretKey;
	public static final String AUTHORIZATION = "Authorization";
	public static final String BEARER = "Bearer ";
	private final MembersRepository membersRepository;
		
	public JWTTOKEN(@Value("${jwt.secret}")String secret, MembersRepository membersRepository) {
		// 비밀키를 초기화합니다. 이 비밀키는 JWT의 서명에 사용됩니다.
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.membersRepository = membersRepository; // 사용자 정보를 조회하기 위한 UserRepository 인스턴스를 초기화합니다.
	}
	
	 // 사용자의 이메일을 기반으로 JWT를 생성합니다.
    public String generateToken(String userEmail, String category, Long expiredMs) {
        // UserRepository를 사용해 사용자 정보를 조회합니다.
        Optional<MembersEntity> memberEntity = membersRepository.findByEmail(userEmail);

        // 사용자 정보가 없는 경우, UsernameNotFoundException을 발생시킵니다.
        if (memberEntity.isEmpty()) {
            throw new UsernameNotFoundException("User with email " + userEmail + " not found");
        }
        
        
        // 사용자의 관리자 여부를 확인합니다.
        String role = memberEntity.get().getRole();
        
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("role", role);
        payloads.put("category", category);
        
        
        Map<String, Object> headers = new HashMap();
		headers.put("typ","JWT");
		headers.put("alg","HS256");
		
		// JWT를 생성합니다. 여기서는 사용자 이메일을 주체(subject)로, 관리자 여부를 클레임으로 추가합니다.
		return Jwts.builder().header().add(headers).and()
					.claims(payloads)
					.subject(userEmail)
					.expiration(new Date(System.currentTimeMillis() + expiredMs))
					.signWith(secretKey,Jwts.SIG.HS256)
					.compact();
    }
    
	public Map<String,Object> getToKenPayloads(String token) {
		Map<String,Object> claims = new HashMap();
		
		try {
			claims = Jwts.parser()
					.verifyWith(secretKey).build() // 서명한 비밀키로 검증
					.parseSignedClaims(token)
					.getPayload();
			
		}catch (Exception e) {
			claims.put("invalid", "유효하지 않은 토큰");
		}
		
		return claims;
		//loginId를 얻고 싶으면 .get("loginId").toString()
		//role을 얻고 싶으면 .get("role").toString()
	}

	/**
	 * 유효한 토큰인지 검증하는 메소드
	 * @param token 발급토큰
	 * @return 유요한 토큰이면 true, 만료가 됬거나 변조된 토큰인 경우 false반환
	 */
	public static boolean verifyToken(String token) {
		try {
			//JWT토큰 파싱 및 검증
			Jws<Claims> claims= Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token);
			System.out.println("만기일자:"+claims.getPayload().getExpiration());
			return true;
		}
		catch(JwtException | IllegalArgumentException e) {
			//System.out.println("유효하지 않은 토큰입니다:"+e);
		}
		return false;
	}
	
	/**
	 * 안쓰면 지울거야~
	 * @param request HttpServletRequest객체
	 * @param tokenName web.xml에 등록한 컨텍스트 초기화 파라미터 값(파라미터명은 "TOKEN-NAME")
	 * @return 발급받은 토큰 값 
	 */
	public static String getTokenInCookie(HttpServletRequest request, String tokenName) {
		Cookie[] cookies = request.getCookies();
		String token = "";
		if(cookies != null){
			for(Cookie cookie:cookies){
				if(cookie.getName().equals(tokenName)){
					token = cookie.getValue();
				}
			}
		}
		return token;
	}//
	
	
	
}
