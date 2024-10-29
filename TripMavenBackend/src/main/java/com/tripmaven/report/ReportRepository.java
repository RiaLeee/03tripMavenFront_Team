package com.tripmaven.report;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ReportRepository extends JpaRepository<ReportEntity, Long>{
	
    Optional<ReportEntity> findByMember_IdAndProductBoard_Id(Long memberId, Long productBoardId);

	List<ReportEntity> findByProductBoard_Id(Long productId);

}
