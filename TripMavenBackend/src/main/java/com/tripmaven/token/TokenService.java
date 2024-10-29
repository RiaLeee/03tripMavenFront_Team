package com.tripmaven.token;


import java.util.Optional;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenService {
	
	private final TokenRepository tokenRepository;


    public void save(TokenEntity Token) {
        tokenRepository.save(Token);
    }

    public Optional<TokenEntity> findByTokenValue(String token) {
        return tokenRepository.findByTokenValue(token);
    }

    public Boolean existsByRefresh(String tokenValue) {
        return tokenRepository.existsByTokenValue(tokenValue);
    }

    public void deleteByRefresh(String tokenValue) {
    	tokenRepository.deleteByTokenValue(tokenValue);
    }
    
    public Optional<TokenEntity> findByMembersId(long id) {
        return tokenRepository.findByMembersId(id);
    }

}
