import axios from 'axios';

const baseUrl = "/evaluation"

// 분석내용 등록
export const createEvaluation = async (formData, memberId, productboardId, keywords) => {
  try {
    //console.log('post에 전송될 keywords:', keywords);
    //console.log('post에 전송될 memberId: ',memberId);
    //console.log('post에 전송될 productboardId: ',productboardId);

      // formData에 추가 데이터 함께 보내기
      const payload = {
          ...formData, // formData에 있는 필드들
          member_id: memberId,
          productboard_id: productboardId,
          keywords: keywords
      };


      console.log('post에 전송될 payload: ',payload)

      // URL 수정 (기존의 `${baseUrl}`을 올바르게 사용)
      const response = await axios.post(`${baseUrl}`, payload, {
          headers: {
              'Content-Type': 'application/json', // 전송 데이터 타입
          },
      });

      const response2 = await axios.put(`/members/${memberId}`, payload, {
        headers: {
            'Content-Type': 'application/json', // 전송 데이터 타입
        },
    });

      console.log('response.data:', response.data);
      console.log('response2.data:', response2.data);
      console.log('response2.data.keywords:', response2.data.keywords);

      return { success: true, data: { ...response.data, keywords: response2.data.keywords } };
      
  } catch (error) {
      console.error('저장 중 오류 발생:', error);
      return { success: false, error: error.message };
  }
};


// 분석내용 조회 (상품id 로)
export const resultGetByProductId = (productId) => {
    //console.log('리뷰 axios 넘어간 productId: ', productId);
    return axios.get(`${baseUrl}/product/${productId}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}

// 분석내용 조회 ( 멤버 id 로)
export const resultGetByMemberId = (memberId) => {
    //console.log('리뷰 axios 넘어간 memberId: ', memberId);
    return axios.get(`${baseUrl}/member/${memberId}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}

// 분석내용 조회 (한 테스트 조회, id 로)
export const resultGetById = (id) => {
    console.log('리뷰 axios 넘어간 memberId: ', id);
    return axios.get(`${baseUrl}/join/${id}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}