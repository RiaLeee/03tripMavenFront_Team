package com.tripmaven.auth.model;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersRepository;

import io.jsonwebtoken.Jwts;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class JWTUtil {
	private SecretKey secretKey;
	private final MembersRepository membersRepository;

    // @Value : application.yml에서의 특정한 변수 데이터를 가져올 수 있음
    // string key는 jwt에서 사용 안하므로 객체 키 생성!
    // "${spring.jwt.secret}" : application.yml에 저장된 spring: jwt: secret 에 저장된 암호화 키 사용
    public JWTUtil(@Value("${jwt.secret}") String secret, MembersRepository membersRepository) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
        this.membersRepository = membersRepository;
    }

    // 사용자의 이메일을 기반으로 JWT를 생성합니다.
    public String generateToken(String userEmail,String category, Long expiredMs) {
        // UserRepository를 사용해 사용자 정보를 조회합니다.
        Optional<MembersEntity> memeber = membersRepository.findByEmail(userEmail);

        // 사용자 정보가 없는 경우, UsernameNotFoundException을 발생시킵니다.
        if (memeber.isEmpty()) {
            throw new UsernameNotFoundException("User with email " + userEmail + " not found");
        }

        // 사용자의 관리자 여부를 확인합니다.
        boolean isAdmin = memeber.get().getRole().equalsIgnoreCase("admin");
        boolean isguide = memeber.get().getRole().equalsIgnoreCase("guide");
        
        Map<String, Object> payloads = new HashMap<>();
        payloads.put("admin", isAdmin);
        payloads.put("guide", isguide);
        payloads.put("category", category);
        
        Map<String, Object> headers = new HashMap();
		headers.put("typ","JWT");
		headers.put("alg","HS256");

        // JWT를 생성합니다. 여기서는 사용자 이메일을 주체(subject)로, 관리자 여부를 클레임으로 추가합니다.
        return Jwts.builder().header().add(headers).and()
        		.claims(payloads)
        		.subject(userEmail)
        		.expiration(new Date(System.currentTimeMillis() + expiredMs)) // 만료 시간을 설정합니다.
				.signWith(secretKey,Jwts.SIG.HS256) // 비밀키와 HS256 알고리즘으로 JWT를 서명합니다.
				.compact(); // JWT 문자열을 생성합니다.
               
    }

    // JWT에서 사용자 이메일을 추출합니다.
    public String getUserEmailFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getSubject();
    }

    // JWT의 만료 여부를 검증합니다.
    public boolean isTokenExpired(String token) {        
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().getExpiration().before(new Date());
    }

    // JWT에서 사용자의 관리자 여부를 확인합니다.
    public boolean isAdminFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("admin", Boolean.class);
    }
    
    // JWT에서 사용자의 가이드 여부를 확인합니다.
    public boolean isguideFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("guide", Boolean.class);
    }

    // JWT에서 사용자의 카테고리를 확인합니다.
    public String getCategoryFromToken(String token) {
        return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload().get("category", String.class);
    }

}
