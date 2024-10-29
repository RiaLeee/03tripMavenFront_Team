package com.tripmaven.kakao;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin
public class KakaoController {
	
	private final KakaoService kakaoService;
		
	// 주소 반환
	@GetMapping("/product/address")
	public ResponseEntity<String> getHotelAddress(@RequestParam("hotel") String hotel) {
		return kakaoService.getHotelAddress(hotel)
	           .map(ResponseEntity::ok)
	           .defaultIfEmpty(ResponseEntity.notFound().build())
	           .block(); // 블로킹 방식으로 결과를 처리하여 반환
	    }
	
}
