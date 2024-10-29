import axios from "axios";


const baseUrl = "http://192.168.0.108:9099"

// 파일만 전송
export const filesPost = async (formData) => {
    try {
      //console.log('filesPost 의 formData: ',formData)
        const response = await axios.post(`${baseUrl}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        //console.log('서버 응답:', response.data);
        return { success: true, data: response.data };
      } catch (error) {
        console.error('업로드 중 오류 발생:', error);
        return { success: false, error: error.message };
      }

};


// 여러 파일 가져오기
export const fetchFiles = async (productboardId) => {
  try {
    // 서버에서 파일 목록을 JSON으로 가져옵니다.
    const response = await axios.get(`${baseUrl}/uploads/${productboardId}`, {
      responseType: 'json' // 서버가 JSON으로 파일 목록을 반환하는 경우
    });

    //console.log('여러파일 response: ', response.data); // 파일 이름 배열 형태로 반환

    // 파일 이름들을 각각 인코딩하고, fetchFile을 호출하여 Blob URL을 가져옵니다.
    const promises = response.data.map((filename) => fetchFile(filename, productboardId));
    //console.log(promises.data)
    // 모든 파일에 대한 Promise를 처리하고 결과를 얻습니다.
    const fileUrls = await Promise.all(promises);

    //console.log('fileUrls: ', fileUrls); // 실제 Blob URL 배열
    return fileUrls; // Blob URL 배열 반환

  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};
   

// 1개 파일 가져오기 
export const fetchFile = async (filename,productboardId) => {
  try {
    //console.log('파일이므리: ',filename);
    const response = await axios.get(`${baseUrl}/upload/${productboardId}/${filename}`, {
       responseType: 'blob'
    });
    
    //console.log('파일이르미 응답: ',response.data)
    // Blob 데이터를 Blob URL로 변환하여 반환
    let blobUrl = URL.createObjectURL(response.data);
    //console.log('blobUrl: ', blobUrl);
    return blobUrl;
  } catch (error) {
    console.error('Error fetching file:', error);
    throw error;
  }
};

// 파일 가져오기(가이드 인증용 파일 이름으로 가져오기, guidelicense)
export const fetchLicenseFile = async (filename) => {
  try {
      //console.log('파일 이름: ',filename);
      const response = await axios.get(`${baseUrl}/downloadlicense/${filename}`, {
        responseType: 'blob' // 서버에서 Blob으로 파일 데이터를 받아옴
      });
      
      const fileUrl = URL.createObjectURL(response.data);
      return {fileUrl, file:response.data};
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
};
