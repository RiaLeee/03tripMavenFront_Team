package com.tripmaven.guideranking;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GuideRankingRepository extends JpaRepository<GuideRankingEntity, Long> {

	
}