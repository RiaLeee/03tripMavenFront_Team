import axios from 'axios';
const baseUrl = "http://localhost:9099/review"

// 리뷰 등록
export const reviewPost = (createData) => {
    console.log('리뷰 axios 넘어간 데이타: ',createData);
    return axios.post(`${baseUrl}/post`,createData).then(res =>{
        console.log('res:', res);
        return res;
    })
}

// 리뷰 조회 (회원id 로)
export const reviewGet = (membersId) => {
    return axios.get(`${baseUrl}/member/${membersId}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}

// 리뷰 조회 (상품id 로)
export const reviewGetByProductId = (ProductId) => {
    return axios.get(`${baseUrl}/product/${ProductId}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}

// 리뷰 조회 (리뷰id 로)
export const reviewGetByReviewId = (id) => {
    console.log('리뷰 axios 넘어간 id: ', id);
    return axios.get(`${baseUrl}/${id}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}

// 리뷰 수정
export const reviewPutByReviewId = (id,updateData) => {
    console.log('postData의 updateData: ',updateData);
    console.log('상품번호: ',updateData.id);
    return axios.put(baseUrl + `/${id}`,updateData).then(res =>{
        return res.data;
    })
  }
  
// 리뷰 삭제
export const reviewDelete = (id) => {
    console.log('리뷰 axios 넘어간 id: ', id);
    return axios.delete(`${baseUrl}/${id}`).then(res => {
        return res.data;
    }).catch(err => {
        console.error('Error fetching reviews:', err);
    });
}
