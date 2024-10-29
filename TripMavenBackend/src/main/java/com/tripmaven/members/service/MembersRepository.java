package com.tripmaven.members.service;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tripmaven.members.model.MembersEntity;

@Repository
public interface MembersRepository extends JpaRepository<MembersEntity, Long>{
    
	//아이디 조회용(단일 레코드 반환:Optional<엔터티타입>)
	Optional<MembersEntity> findByEmail(String email);
    
	List<MembersEntity> findByName(String name);
	
	//이메일 존재 여부용(WHERE eMail=?):서비스단의 중복아이디 검증용
	boolean existsByEmail(String email);

	Optional<MembersEntity> findByEmailAndLoginType(String email, String string);
	
	



}
