package com.tripmaven.filter;

import java.io.IOException;
import java.io.PrintWriter;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.tripmaven.auth.model.JWTUtil;
import com.tripmaven.auth.service.CustomUserDetails;
import com.tripmaven.members.model.MembersEntity;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@RequiredArgsConstructor

public class JWTFilter extends OncePerRequestFilter{
	private final JWTUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		// request에서 Authorization 헤더 찾음
        String authorization = request.getHeader("Authorization");
        
        String requestURI = request.getRequestURI();
        if ("/reissue".equals(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }
        // Authorization 헤더 검증
        // Authorization 헤더가 비어있거나 "Bearer " 로 시작하지 않은 경우
        if(authorization == null || !authorization.startsWith("Bearer ")){

            System.out.println("token null");
            // 토큰이 유효하지 않으므로 request와 response를 다음 필터로 넘겨줌
            filterChain.doFilter(request, response);

            // 메서드 종료
            return;
        }
		
		String token = authorization.split(" ")[1]; //bearer 제거
		
		//토큰 검증
		try {
            jwtUtil.isTokenExpired(token);
        } catch (ExpiredJwtException e) {
            //response body
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");
            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
		
		 // token에서 category 가져오기
        String category = jwtUtil.getCategoryFromToken(token);
        // 토큰 category 가 access 가 아니 라면 만료 된 토큰 이라고 판단
        if (!category.equals("access")) {

            //response body
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            //response status code
            // 응답 코드를 프론트와 맞추는 부분 401 에러 외 다른 코드로 맞춰서
            // 진행하면 리프레시 토큰 발급 체크를 빠르게 할수 있음
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        
     // 토큰에서 사용자 이메일과 관리자 여부를 추출합니다.
        String userEmail = jwtUtil.getUserEmailFromToken(token);
        String role = jwtUtil.isAdminFromToken(token)?"ADMIN":"USER";
        role = jwtUtil.isguideFromToken(token)?"GUIDE":"USER";

        // 인증에 사용할 임시 User 객체를 생성하고, 이메일과 관리자 여부를 설정합니다.
        MembersEntity user = new MembersEntity();
        user.setEmail(userEmail);
        user.setPassword("임시비번"); // 실제 인증에서는 사용되지 않는 임시 비밀번호를 설정합니다.
        user.setRole(role);

        // User 객체를 기반으로 CustomUserDetails 객체를 생성합니다.
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        // Spring Security의 Authentication 객체를 생성하고, SecurityContext에 설정합니다.
        // 이로써 해당 요청에 대한 사용자 인증이 완료됩니다.
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 필터 체인을 계속 진행합니다.
        filterChain.doFilter(request,response);
		
		
	}
	
	
}
