package com.tripmaven.auth.controller;

import java.io.IOException;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.auth.model.JWTTOKEN;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersRepository;
import com.tripmaven.token.TokenEntity;
import com.tripmaven.token.TokenService;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
@Slf4j
public class OAuthController {
	
	@Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String naverClientId;

    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String naverSecret;
    
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;
    
    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleScrect;
    
    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;
    
    private final MembersRepository membersRepository;
    private final TokenService tokenService;
    private final JWTTOKEN jwttoken;
    private final ObjectMapper mapper;
   
    @CrossOrigin
    @GetMapping("/oauth2/code/naver")
    public void naverLogin(@RequestParam("code") String code,@RequestParam("state") String state, HttpServletResponse response) throws IOException, ParseException {
        log.info("code = {}", code);

        // 액세스 토큰을 요청하기 위한 URL 및 헤더 설정
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String tokenRequestBody = "grant_type=authorization_code"
                + "&client_id=" + naverClientId
                + "&client_secret=" + naverSecret
                + "&code=" + code
                + "&state=" + state;

        // 토큰 요청
        HttpEntity<String> tokenRequestEntity = new HttpEntity<>(tokenRequestBody, tokenHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequestEntity, String.class);
        log.info("token response = {}", tokenResponse.getBody());

        Map<String, Object> tokenJson = mapper.readValue(tokenResponse.getBody(), Map.class);
        String accessToken = tokenJson.get("access_token").toString();
        log.info("accessToken = {}", accessToken);

        // 사용자 정보를 요청하기 위한 URL 및 헤더 설정
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.set("Authorization", "Bearer " + accessToken);

        // 사용자 정보 요청
        HttpEntity<String> userInfoRequestEntity = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoRequestEntity, String.class);
        log.info("user info response = {}", userInfoResponse.getBody());

        Map<String, Object> userJson = mapper.readValue(userInfoResponse.getBody(), Map.class);
        Map<String, Object> userJsonRes = (Map<String, Object>) userJson.get("response");
        
        String email = userJsonRes.get("email").toString().trim();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate birthday = LocalDate.parse(userJsonRes.get("birthyear").toString() + "-" + userJsonRes.get("birthday").toString(), formatter);
        System.out.println("Parsed Birthday: " + birthday);
        String uniname = userJsonRes.get("name").toString();
       
        
        
        StringBuilder name = new StringBuilder();
        for (int i = 0; i < uniname.length(); i++) {
            if (uniname.charAt(i) == '\\' && i + 5 < uniname.length() && uniname.charAt(i + 1) == 'u') {
                // \\uXXXX 형식의 유니코드인지 확인
                String unicodeValue = uniname.substring(i + 2, i + 6);
                int charCode = Integer.parseInt(unicodeValue, 16);
                name.append((char) charCode);
                i += 5; 
            } else {
            	name.append(uniname.charAt(i));
            }
        }
        
        System.out.println(name.toString());
        
        log.info("email = {}", email);

        // 'naver'로 loginType을 설정해야 합니다.
        Optional<MembersEntity> optionalMembers = membersRepository.findByEmail(email);

        if (optionalMembers.isPresent()) {
            MembersEntity membersEntity = optionalMembers.get();
            membersEntity.setLoginType("naver");
            membersEntity.setSnsAccessToken(accessToken);
            membersRepository.save(membersEntity);

            // JWT 토큰 발급
            Long accessExpiredMs = 600000L;
            String accessTokenJwt = jwttoken.generateToken(email, "access", accessExpiredMs);
            Long refreshExpiredMs = 86400000L;
            String refreshTokenJwt = jwttoken.generateToken(email, "refresh", refreshExpiredMs);

            TokenEntity token = TokenEntity.builder()
                    .status("activated")
                    .userAgent(response.getHeader("User-Agent"))
                    .members(membersEntity)
                    .tokenValue(refreshTokenJwt)
                    .expiresIn(refreshExpiredMs)
                    .build();

            tokenService.save(token);

            // 로그인 성공 후 URL에 토큰 정보 포함
            String redirectUrl = String.format("http://localhost:58337/login/success?access=%s&refresh=%s&role=%s&membersId=%s",
    				accessTokenJwt, refreshTokenJwt, membersEntity.getRole(),membersEntity.getId());

            response.sendRedirect(redirectUrl);
            log.info("로그인 성공: {}", email);
        } else {
            log.info("회원가입 필요: {}", email);
            MembersEntity newMember = new MembersEntity().builder()
					.email(email)
					.loginType("naver")
					.name(name.toString())
					.profile(userJsonRes.get("profile_image").toString())
					.telNumber(userJsonRes.get("mobile").toString())
					.birthday(birthday)
					.gender(userJsonRes.get("gender").toString().equalsIgnoreCase("M")?"male":"female")
					.role("USER")
					.password("OAUTH2_LOGIN")
					.build();
            membersRepository.save(newMember);
    		log.info("회원가입 성공: {}", email);
    		
    		
            String logoutUrl = String.format("https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=%s&client_secret=%s&access_token=%s&service_provider=NAVER",naverClientId,naverSecret,accessToken);
            HttpHeaders logoutHeaders = new HttpHeaders();
            logoutHeaders.set("Content-Type", "application/x-www-form-urlencoded");
            logoutHeaders.set("Accept", "application/json");
            HttpEntity<String> logoutRequestEntity = new HttpEntity<>(logoutHeaders);
            ResponseEntity<String> logoutResponse = restTemplate.exchange(logoutUrl, HttpMethod.POST, logoutRequestEntity, String.class);
            log.info("logout response = {}", logoutResponse.getBody());
            
            
            response.sendRedirect("http://localhost:58337/login/signup?email="+email);
        }
    }
    
    @CrossOrigin
    @GetMapping("/oauth2/code/google")
    public void googleLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException{
        log.info("code = {}", code);

        // 액세스 토큰을 요청하기 위한 URL 및 헤더 설정
        String tokenUrl = "https://oauth2.googleapis.com/token";
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        String tokenRequestBody = "grant_type=authorization_code"
                + "&client_id=" + googleClientId
                + "&client_secret=" + googleScrect
                + "&redirect_uri=" + googleRedirectUri
                + "&code=" + code;

        // 토큰 요청
        HttpEntity<String> tokenRequestEntity = new HttpEntity<>(tokenRequestBody, tokenHeaders);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequestEntity, String.class);
        log.info("token response = {}", tokenResponse.getBody());

        Map<String, Object> tokenJson = mapper.readValue(tokenResponse.getBody(), Map.class);
        String accessToken = tokenJson.get("access_token").toString();
        log.info("accessToken = {}", accessToken);

        // 사용자 정보를 요청하기 위한 URL 및 헤더 설정
        String userInfoUrl = "https://www.googleapis.com/userinfo/v2/me";
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.set("Authorization", "Bearer " + accessToken);

        // 사용자 정보 요청
        HttpEntity<String> userInfoRequestEntity = new HttpEntity<>(userInfoHeaders);
        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoRequestEntity, String.class);
        log.info("user info response = {}", userInfoResponse.getBody());

        Map<String, Object> userJson = mapper.readValue(userInfoResponse.getBody(), Map.class);
        String email = userJson.get("email").toString().trim();
        log.info("email = {}", email);

        // 'naver'로 loginType을 설정해야 합니다.
        Optional<MembersEntity> optionalMembers = membersRepository.findByEmail(email);

        if (optionalMembers.isPresent()) {
            MembersEntity membersEntity = optionalMembers.get();
            membersEntity.setLoginType("google");
            
            membersEntity.setSnsAccessToken(accessToken);
            membersRepository.save(membersEntity);

            // JWT 토큰 발급
            Long accessExpiredMs = 600000L;
            String accessTokenJwt = jwttoken.generateToken(email, "access", accessExpiredMs);
            Long refreshExpiredMs = 86400000L;
            String refreshTokenJwt = jwttoken.generateToken(email, "refresh", refreshExpiredMs);

            TokenEntity token = TokenEntity.builder()
                    .status("activated")
                    .userAgent(response.getHeader("User-Agent"))
                    .members(membersEntity)
                    .tokenValue(refreshTokenJwt)
                    .expiresIn(refreshExpiredMs)
                    .build();

            tokenService.save(token);

            // 로그인 성공 후 URL에 토큰 정보 포함
            String redirectUrl = String.format("http://localhost:58337/login/success?access=%s&refresh=%s&role=%s&membersId=%s",
    				accessTokenJwt, refreshTokenJwt, membersEntity.getRole(),membersEntity.getId());

            response.sendRedirect(redirectUrl);
            log.info("로그인 성공: {}", email);
        } else {
            log.info("회원가입 필요: {}", email);
            MembersEntity newMember = new MembersEntity().builder()
            						.email(email)
            						.loginType("google")
            						.name((userJson.get("name")).toString())
            						.role("USER")
            						.profile((userJson.get("picture")).toString())
            						.password("OAUTH2_LOGIN")
            						.build();
            membersRepository.save(newMember);
    		log.info("회원가입 성공: {}", email);
            //구글 로그아웃 처리
            String logoutUrl = "https://oauth2.googleapis.com/revoke?token=" + accessToken;
            HttpHeaders logoutHeaders = new HttpHeaders();
            logoutHeaders.set("Content-Type", "application/x-www-form-urlencoded");

            HttpEntity<String> logoutRequestEntity = new HttpEntity<>(logoutHeaders);
            ResponseEntity<String> logoutResponse = restTemplate.exchange(logoutUrl, HttpMethod.POST, logoutRequestEntity, String.class);
            log.info("logout response = {}", logoutResponse.getBody());
            response.sendRedirect("http://localhost:58337/login/signup?email="+email);
            
        }
    }
    

    @GetMapping("/oauth2/code/kakao")
    public void kakaoLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
    	log.info("code = {}", code);


    	// 액세스 토큰을 요청하기 위한 URL 및 헤더 설정
    	String tokenUrl = "https://kauth.kakao.com/oauth/token";
    	HttpHeaders tokenHeaders = new HttpHeaders();
    	tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
    	String tokenRequestBody = "grant_type=authorization_code"
    			+ "&client_id=" + kakaoClientId
    			+ "&redirect_uri=" + kakaoRedirectUri
    			+ "&code=" + code;

    	System.out.println("토큰 요청 전");
    	System.out.println("토큰 kakaoClientId 전"+kakaoClientId);
    	System.out.println("토큰 kakaoRedirectUri 전"+kakaoRedirectUri);
    	// 토큰 요청
    	HttpEntity<String> tokenRequestEntity = new HttpEntity<>(tokenRequestBody, tokenHeaders);
    	System.out.println("tokenRequestEntity"+tokenRequestEntity);
    	RestTemplate restTemplate = new RestTemplate();
    	System.out.println("restTemplate"+restTemplate);
    	ResponseEntity<String> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequestEntity, String.class);
    	System.out.println("tokenResponse"+tokenResponse);
    	log.info("token response = {}", tokenResponse.getBody());

    	Map<String, Object> tokenJson = mapper.readValue(tokenResponse.getBody(), Map.class);
    	String accessToken = tokenJson.get("access_token").toString();
    	log.info("accessToken = {}", accessToken);

    	// 사용자 정보를 요청하기 위한 URL 및 헤더 설정
    	String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
    	HttpHeaders userInfoHeaders = new HttpHeaders();
    	userInfoHeaders.set("Authorization", "Bearer " + accessToken);

    	// 사용자 정보 요청
    	HttpEntity<String> userInfoRequestEntity = new HttpEntity<>(userInfoHeaders);
    	ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoRequestEntity, String.class);
    	log.info("user info response = {}", userInfoResponse.getBody());

    	Map<String, Object> userJson = mapper.readValue(userInfoResponse.getBody(), Map.class);
    	// 이메일 정보 추출
    	Map<String, Object> kakaoAccount = (Map<String, Object>) userJson.get("kakao_account");
    	String email =  kakaoAccount.get("email").toString().trim();
    	log.info("email = {}", email);

    	Optional<MembersEntity> optionalMembers = membersRepository.findByEmail(email);

    	if (optionalMembers.isPresent()) {
    		MembersEntity membersEntity = optionalMembers.get(); 
			membersEntity.setLoginType("kakao");
			membersEntity.setSnsAccessToken(accessToken);
			membersRepository.save(membersEntity);
			//
			//            // JWT 토큰 발급
			Long accessExpiredMs = 600000L;
			String accessTokenJwt = jwttoken.generateToken(email, "access", accessExpiredMs);
			Long refreshExpiredMs = 86400000L;
			String refreshTokenJwt = jwttoken.generateToken(email, "refresh", refreshExpiredMs);

			TokenEntity token = TokenEntity.builder()
				.status("activated")
				.userAgent(response.getHeader("User-Agent"))
				.members(membersEntity)
				.tokenValue(refreshTokenJwt)
				.expiresIn(refreshExpiredMs)
				.build();

			tokenService.save(token);

		// 로그인 성공 후 URL에 토큰 정보 포함
			String redirectUrl = String.format("http://localhost:58337/login/success?access=%s&refresh=%s&role=%s&membersId=%s",
				accessTokenJwt, refreshTokenJwt, membersEntity.getRole(),membersEntity.getId());
			response.sendRedirect(redirectUrl);
			log.info("로그인 성공: {}", email);
    	
    	} else {
    		log.info("회원가입 필요: {}", email);
    		MembersEntity newMember = new MembersEntity().builder()
					.email(email)
					.loginType("kakao")
					.name(kakaoAccount.get("name").toString())
					.profile(((Map)kakaoAccount.get("profile")).get("thumbnail_image_url").toString())
					.gender(kakaoAccount.get("gender").toString())
					.role("USER")
					.password("OAUTH2_LOGIN")
					.build();
    		membersRepository.save(newMember);
    		log.info("회원가입 성공: {}", email);
    		// 카카오 로그아웃 처리
            String logoutUrl = "https://kapi.kakao.com/v1/user/logout";
            HttpHeaders logoutHeaders = new HttpHeaders();
            logoutHeaders.set("Authorization", "Bearer " + accessToken);

            HttpEntity<String> logoutRequestEntity = new HttpEntity<>(logoutHeaders);
            ResponseEntity<String> logoutResponse = restTemplate.exchange(logoutUrl, HttpMethod.POST, logoutRequestEntity, String.class);
            log.info("logout response = {}", logoutResponse.getBody());
            response.sendRedirect("http://localhost:58337/login/signup?email="+email);
    	}
    }

}
