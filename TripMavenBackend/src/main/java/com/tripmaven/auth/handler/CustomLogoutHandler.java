package com.tripmaven.auth.handler;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.client.RestTemplate;

import com.tripmaven.auth.model.JWTUtil;
import com.tripmaven.members.model.MembersDto;
import com.tripmaven.members.service.MembersService;
import com.tripmaven.token.TokenEntity;
import com.tripmaven.token.TokenService;

import io.jsonwebtoken.ExpiredJwtException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomLogoutHandler implements LogoutHandler{
	
	private final JWTUtil jwtUtil;
	private final TokenService tokenService;
	private final MembersService membersService;
	
	@Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;
	
	@Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverSecret;
	
	
	public CustomLogoutHandler(JWTUtil jwtUtil, TokenService tokenService, MembersService membersService) {
		this.jwtUtil = jwtUtil;
		this.tokenService = tokenService;
		this.membersService = membersService;
	}



	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		String authorization = request.getHeader("Authorization");
		if( authorization != null && authorization.startsWith("Bearer ")) {
			String token = authorization.substring(7); // 'Bearer ' 문자 제거
			
			try {
				jwtUtil.isTokenExpired(token);
			} catch (ExpiredJwtException e) {
				log.info("Token expired during logout: {}", e.getMessage());
                // HTTP 응답을 설정하여 직접 클라이언트에게 오류 정보를 전달합니다.
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Unauthorized
                response.setContentType("application/json");
                try {
                    response.getWriter().write("{\"error\":\"Session has expired. Please log in again.\"}");
                    response.getWriter().flush();
                } catch (IOException ioException) {
                    log.error("Error writing to response", ioException);
                }
                return; // 메서드를 빠져나와 추가 처리를 중단합니다.
			}

            // 만료 여부와 상관없이 사용자 정보를 조회하여 로그아웃 처리를 합니다.
            String userName = jwtUtil.getUserEmailFromToken(token);
            MembersDto member = membersService.searchByMemberEmail(userName);
            String accessToken = member.getSnsAccessToken();
            RestTemplate restTemplate = new RestTemplate();
            if (member != null) {
                // 네이버 로그아웃 처리
                if ("naver".equals(member.getLoginType())) {
                	String logoutUrl = String.format("https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=%s&client_secret=%s&access_token=%s&service_provider=NAVER"
                			,naverClientId,naverSecret,accessToken);
                    HttpHeaders logoutHeaders = new HttpHeaders();
                    logoutHeaders.set("Content-Type", "application/x-www-form-urlencoded");
                    logoutHeaders.set("Accept", "application/json");
                    HttpEntity<String> logoutRequestEntity = new HttpEntity<>(logoutHeaders);
                    ResponseEntity<String> logoutResponse = restTemplate.exchange(logoutUrl, HttpMethod.POST, logoutRequestEntity, String.class);
                    log.info("logout response = {}", logoutResponse.getBody());
                }
                // 구글 로그아웃 처리
                if ("google".equals(member.getLoginType())) {
                	String logoutUrl = "https://oauth2.googleapis.com/revoke?token=" + accessToken;
                    HttpHeaders logoutHeaders = new HttpHeaders();
                    logoutHeaders.set("Content-Type", "application/x-www-form-urlencoded");

                    HttpEntity<String> logoutRequestEntity = new HttpEntity<>(logoutHeaders);
                    ResponseEntity<String> logoutResponse = restTemplate.exchange(logoutUrl, HttpMethod.POST, logoutRequestEntity, String.class);
                    log.info("logout response = {}", logoutResponse.getBody());
                }
                // 카카오 로그아웃 처리
                if ("kakao".equals(member.getLoginType())) {
                    String kakaoAccessToken = member.getSnsAccessToken(); // 저장된 카카오 액세스 토큰 사용
                    String kakaoLogoutUrl = "https://kapi.kakao.com/v1/user/logout";
                    HttpHeaders headers = new HttpHeaders();
                    headers.set("Authorization", "Bearer " + kakaoAccessToken);

                    HttpEntity<String> kakaoRequestEntity = new HttpEntity<>(headers);
                    ResponseEntity<String> kakaoResponse = restTemplate.exchange(kakaoLogoutUrl, HttpMethod.POST, kakaoRequestEntity, String.class);
                    log.info("Kakao logout response = {}", kakaoResponse.getBody());
                }
                
                Optional<TokenEntity> refresh = tokenService.findByMembersId(member.getId());
                refresh.ifPresent(refreshToken -> tokenService.deleteByRefresh(refreshToken.getTokenValue()));
            }
        }

        // 성공적인 로그아웃 응답을 설정합니다.
        response.setStatus(HttpServletResponse.SC_OK);
			
		}
		
	
	
	
}
