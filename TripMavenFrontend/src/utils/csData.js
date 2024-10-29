import axios from 'axios';
const baseUrl = "/spring/cs"

// 문의 등록
export const csPost = (createData) => {
    return axios.post(baseUrl + "/post",createData).then(res =>{
        return res;
    })
}

// 문의 전체조회
export const csAllget = () => {
    return axios.get(baseUrl + "/getAll").then(res =>{
        return res.data;
    })
}

// 문의 id로 문의 조회
export const csGet = (id) => {
    return axios.get(baseUrl + `/get/${id}`).then(res =>{
        return res.data;
    })
}

// 문의 수정
export const csPut = (id,updateData) => {
    return axios.put(baseUrl + `/put/${id}`,updateData).then(res =>{
        return res;
    })
}

// 문의 삭제
export const csDelte = (id) => {
    return axios.delete(baseUrl + `/delete/${id}`).then(res =>{
        return res;
    })
}



// 답변 수정
export const csAnswerPut = (id,updateData) => {
    return axios.put(baseUrl + `/answer/${id}`,updateData).then(res =>{
        return res;
    })
}
