import axios from 'axios';
const baseUrl = "http://localhost:9099/report"

// 신고 등록
export const reportPost = (createData) => {
    //console.log('신고 axios 넘어간 데이타: ',createData);
    return axios.post(`${baseUrl}/post`,createData).then(res =>{
        console.log('res:', res);
        return res;
    })
}

// 신고 전체조회(관리자)
export const reportAllget = () => {
    return axios.get(baseUrl).then(res =>{
        return res.data;
    })
}

// 신고 조회( 내가 신고했던가..)
export const reportGet = (memberId,productId ) => {
    return axios.get(`${baseUrl}/${memberId}/${productId}`).then(res =>{
        return res.data;
    })
}

// 신고 조회 한 게시글만
export const findByProductId = (productId ) => {
    return axios.get(`${baseUrl}/${productId}`).then(res =>{
        return res.data;
    })
}