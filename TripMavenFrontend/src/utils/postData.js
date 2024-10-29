import axios from 'axios';
const baseUrl = "http://localhost:9099/product"
// 상품 등록
export const postPost = (createData) => {
  return axios.post(baseUrl,createData).then(res =>{
      return res;
  })
}
// 상품id로 상품 조회
export const postGetById = (id) => {
  return axios.get(baseUrl + `/${id}`).then(res =>{
      return res.data;
  })
}

// 회원 이메일로 상품 조회
export const postGetByEmail = (email) => {
  return axios.get(baseUrl + `/member/${email}`).then(res =>{
      return res.data;
  })
}
// 상품 전체 얻어오기(20개씩 얻어오기)
export const postsAllGet = (page) => {
  return axios.get(baseUrl + `/all/${page}`).then(res =>{
      return res.data.content;
  })
}

// 상품 도시로 검색(20개씩 얻어오기)
export const postsCityGet = (city, page) => {
  return axios.get(baseUrl + `/city/${city}?page=${page}`).then(res =>{
      return res.data;
  })
}

// 상품 전체검색 색인으로 검색(20개씩 얻어오기)
export const postsSearchWordGet = (searchword, page) => {
  return axios.get(baseUrl+`/search/${searchword}?page=${page}`).then(res =>{
      return res.data;
  })
}

// 상품 수정
export const postPut = (updateData) => {
  console.log('postData의 updateData: ',updateData);
  console.log('상품번호: ',updateData.id);
  return axios.put(baseUrl + `/${updateData.id}`,updateData).then(res =>{
      return res.data;
  })
}
// 상품 삭제
export const postDelete = (id) => {
  console.log('id : ',id)
  return axios.delete(baseUrl + `/${id}`).then(res =>{
      return res;
  })
}
// 호텔 이름으로 호텔 주소 검색 컨트롤러 가져오기
export const getHotelAd = (hotel) => {
  console.log('hotel: ',hotel)
  return axios.get(baseUrl + '/address', {
    params: {
      hotel: hotel
    }
  }).then(res =>{
    console.log('res',res.data.documents)
      return res.data.documents;
  })
}

// 찜
export const postLikey = (memberId, productId) => {
  console.log('찜 POST 회원id: ',memberId);
  console.log('찜 POST 상품id: ',productId);
  return axios.post('http://localhost:9099/likey' + `/${productId}/${memberId}`).then(res =>{
      return res;
  })
}

// 찜
export const deleteLikey = (memberId, productId) => {  
  console.log('찜 DELETE 회원id: ',memberId);
  console.log('찜 DELETE 상품id: ',productId);
  return axios.delete('http://localhost:9099/likey' + `/${productId}/${memberId}`).then(res =>{
      return res;
  })
}

// 찜 목록
export const getLikey = (memberId) => {
  console.log('찜 GET 회원id: ',memberId);
  return axios.get('http://localhost:9099/likey' + `/${memberId}`).then(res =>{
      return res.data;
  })
}

