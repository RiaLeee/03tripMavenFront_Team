package com.tripmaven.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

	List<NotificationEntity> findAllByMemberId(Long myId);

	List<NotificationEntity> findAllByMemberIdAndSenderId(long memberId, long senderId);

}
