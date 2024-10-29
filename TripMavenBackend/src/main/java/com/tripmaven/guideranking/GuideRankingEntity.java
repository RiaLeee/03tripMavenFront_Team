package com.tripmaven.guideranking;

import org.hibernate.annotations.DynamicInsert;

import com.tripmaven.members.model.MembersEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "GuideRanking")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
public class GuideRankingEntity {
	
	/**랭킹 고유 번호. PK*/
	@Id
	@SequenceGenerator(name="seq_guideRanking", sequenceName = "seq_guideRanking", allocationSize = 1,initialValue = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE,generator = "seq_guideRanking")
	private long id;
	
	
	/**가이드 고유 번호*/
	@ManyToOne(optional = false)
	@JoinColumn(name="membersentity_id")
	private MembersEntity member;
	
	/** 평균 별점*/
	
	@Column(nullable = false)
	private double averageRating;
	
	
	

}
