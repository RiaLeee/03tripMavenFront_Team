package com.tripmaven.productevaluation;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripmaven.JoinProductEvaluation.JoinProductEvaluationDto;
import com.tripmaven.JoinProductEvaluation.JoinProductEvaluationEntity;
import com.tripmaven.JoinProductEvaluation.JoinProductEvaluationService;
import com.tripmaven.joinchatting.JoinChattingDto;
import com.tripmaven.members.model.MembersEntity;
import com.tripmaven.members.service.MembersService;
import com.tripmaven.productboard.ProductBoardEntity;
import com.tripmaven.productboard.ProductService;
import com.tripmaven.review.ReviewDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/evaluation")
public class ProductEvaluationController {

	private final ProductService productService;
	private final MembersService membersService;
	private final ProductEvaluationService productEvaluationService;
	private final ObjectMapper mapper;
	private final JoinProductEvaluationService joinProductEvaluationService;

	// 분석내용 등록
	@PostMapping
	public ResponseEntity<JoinProductEvaluationDto> createEvaluation(@RequestBody Map<String, Object> map) {
		try {
			System.out.println("조인프로덕트 컨트롤러 들어왔당");
			String member_id = map.get("member_id").toString();
		    MembersEntity members =  membersService.searchByMemberID(Long.parseLong(member_id)).toEntity();

		    String productboard_id = map.get("productboard_id").toString();
		    ProductBoardEntity productboard = productService.usersById(Long.parseLong(productboard_id)).toEntity();
			
			//생성한 아이디로 그룹화 하면 됨
			//두번째에는 맵에 id를 넣어서 보내고 그걸로 판단하면 됨
			JoinProductEvaluationEntity createdJoinProductEvaluation = JoinProductEvaluationEntity.builder()
																						.member(members)
																						.productBoard(productboard)
																						.build();
			if(map.get("group_id").toString().equals("0")) { //처음 결과 있을때 요청에 groupId를 넣지 말고 보내기
				createdJoinProductEvaluation = joinProductEvaluationService.create(createdJoinProductEvaluation);
			}
			else { //두번째 결과에서는 gruopId를 키로 해서 넣고 분석결과를 넣으면 같은 아이디로 생성이 된다.
				createdJoinProductEvaluation  = joinProductEvaluationService.getById(Long.parseLong(map.get("group_id").toString())).toEntity();
			}

		    ProductEvaluationDto productEvaluationDto = mapper.convertValue(map, ProductEvaluationDto.class);
		    productEvaluationDto.setMember(members);
		    productEvaluationDto.setProductBoard(productboard);
		    productEvaluationDto.setJoinProductEvaluation(createdJoinProductEvaluation);

		    ProductEvaluationDto dto = productEvaluationService.create(productEvaluationDto);
		    
		    //반환값은 joinProductEvaluation 으로 반환하기
		    return ResponseEntity.ok(joinProductEvaluationService.getById(createdJoinProductEvaluation.getId()));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 분석내용 전체조회
	@GetMapping
	public ResponseEntity<List<ProductEvaluationDto>> getEvaluationAll() {
		try {
			List<ProductEvaluationDto> evaluation = productEvaluationService.evaluationAll();
			return ResponseEntity.status(200).header(HttpHeaders.CONTENT_TYPE, "application/json").body(evaluation);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	// 분석내용 평가id(PK)로 조회(조인어쩌구 테이블의 아이디로 조회하면 끝)
	@GetMapping("/{id}")
	public ResponseEntity<ProductEvaluationDto> getEvaluationById(@PathVariable("id") long id) {
		try {
			ProductEvaluationDto dto = productEvaluationService.getById(id);
			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	
	// 분석내용 상품id(FK)로 조회
	@GetMapping("/product/{productId}")
	public ResponseEntity<List<JoinProductEvaluationDto>> getEvaluationByProductId(@PathVariable("productId") long productId) {
		try {
			List<JoinProductEvaluationDto> dto = joinProductEvaluationService.getAllByProductId(productId);
			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	
	// 분석내용 회원id(FK)로 조회
	@GetMapping("/member/{memberId}")
	public ResponseEntity<List<JoinProductEvaluationDto>> getEvaluationByMemberId(@PathVariable("memberId") long memberId) {
		try {
			List<JoinProductEvaluationDto> dto = joinProductEvaluationService.getAllByMemberId(memberId);
			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
	
	
	// 조인 평가 id로 평가 결과 조회 (즉, 첫번째 및 두번째 분석 결과 가져오기)
	@GetMapping("/join/{id}")
	public ResponseEntity<JoinProductEvaluationDto> getEvaluationByJoinId(@PathVariable("id") long id) {
		try {
			JoinProductEvaluationDto dto = joinProductEvaluationService.getById(id);
			return ResponseEntity.ok(dto);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}	
}
