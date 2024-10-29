import axios from 'axios';

// 문제 가져오기
export const fetchData = async () => {
    try {
      const res = await axios.get('/spring/quiz');
      console.log("서버 응답 데이터:", res.data);  // 응답 데이터 확인
      return res.data;
    } catch (error) {
      console.error('에러났당', error);
      throw error;
    }
  };

// 사용자 답안 저장
export const submitAnswer  = async (id, userAnswer) => {
    try {
        const res = await axios.post('/spring/quiz', {id, userAnswer });  // 프록시 설정에 맞게 /spring 경로 유지
        return res.data;
    } catch (error) {
        console.error('에러났당', error);
        throw error;
    }
  }
