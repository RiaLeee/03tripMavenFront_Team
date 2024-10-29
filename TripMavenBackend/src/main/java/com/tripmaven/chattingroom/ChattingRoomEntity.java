package com.tripmaven.chattingroom;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;

import com.tripmaven.productboard.ProductBoardEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tripmaven.chattingmessage.ChattingMessageEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;


import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "ChattingRoom")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChattingRoomEntity {

	/** 채팅방 고유 번호. PK*/
	@Id
	@SequenceGenerator(name="seq_chattingroom",sequenceName = "seq_chattingroom",allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_chattingroom")
	private long id;
	
	/** 생성날짜. */
	@ColumnDefault("SYSDATE")
	@CreationTimestamp
	private LocalDateTime createdAt;
	
	/** 활성화 여부. */
	@Column(length = 1)
	@ColumnDefault("1")
	private String isActive;

	/** 삭제날짜. */
	private LocalDateTime deletedAt;

	/** 삭제 여부. */
	@Column(length = 1)
	@ColumnDefault("0")
	private String isDelete;
	
	/** 수정 날짜. */
	private LocalDateTime updatedAt;

	/** 수정 여부. */
	@Column(length = 1)
	@ColumnDefault("0")
	private String isUpdate;
	
	/** 채팅메시지 (양방향) FK*/
	@OneToMany(mappedBy = "chattingRoom",cascade = CascadeType.REMOVE)
	@OrderBy("id")
	@JsonIgnore
	private List<ChattingMessageEntity> chattingMessage;
	
	/** 상품 고유 번호. FK*/
	@ManyToOne(optional = false)
	@JoinColumn(name="productentity_id")
	private ProductBoardEntity productBoard;
	
}
