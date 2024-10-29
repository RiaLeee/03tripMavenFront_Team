package com.tripmaven.guideranking;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/guide-ranking")
public class GuideRankingController {
    
	@Autowired
    private GuideRankingService guideRankingService;
    
    @GetMapping
    public ResponseEntity<List<GuideRankingDto>> getGuideRanking() {
        List<GuideRankingDto> ranking = guideRankingService.calculateGuideRankings();
        return ResponseEntity.ok(ranking);
    }
}
