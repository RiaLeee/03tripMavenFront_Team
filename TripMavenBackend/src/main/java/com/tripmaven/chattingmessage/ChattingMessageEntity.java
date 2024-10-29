package com.tripmaven.chattingmessage;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.tripmaven.chattingroom.ChattingRoomEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "ChattingMessage")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChattingMessageEntity {

	/** 채팅 메시지 고유 번호. PK*/
	@Id
	@SequenceGenerator(name="seq_chattingmessage",sequenceName = "seq_chattingmessage",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_chattingmessage")
	private long id;
	
	/** 채팅방 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="chattingroomentity_id")
	private ChattingRoomEntity chattingRoom;
	
	/** 유저 고유 번호. */
    @Column(nullable = false)
    private long sender;
    
	/** 메시지 내용. */
    @Lob
    @Column(nullable = false, length = 100)
	private String text;
    
	/** 생성 날짜. */
	@ColumnDefault("SYSDATE")
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	/** 생성 여부. */
	@Column(length = 1)
	@ColumnDefault("1")
	private String isActive;
    
	/** 삭제 날짜. */
	private LocalDateTime deletedAt;

	/** 삭제 여부. */
	@Column(length = 1)
	@ColumnDefault("0")
	private String isDelete;

	
}
