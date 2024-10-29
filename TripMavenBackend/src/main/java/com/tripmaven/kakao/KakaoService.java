package com.tripmaven.kakao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Service
public class KakaoService {
	
	@Value("${kakao.api.key}")
    private String kakaoApiKey;

    private final WebClient webClient;

    public KakaoService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://dapi.kakao.com").build();
    }

    public Mono<String> getHotelAddress(String hotel) {
    	System.out.println("서비스 잘 들어옴");
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/local/search/keyword.json")
                        .queryParam("query", hotel)
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoApiKey)
                .retrieve()
                .bodyToMono(String.class);
    }
	
	

}
