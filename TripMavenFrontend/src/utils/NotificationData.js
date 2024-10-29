import axios from "axios";

//알림 추가하기
export const postNotification = async (jsondata) => {
    try {
      const res = await axios.post('/spring/noti/', jsondata,
        {headers: {'Content-Type': 'application/json'}});
      return res.data;
    }
    catch (error) {
      console.error('에러났당', error);
      throw error; 
    }
};

//나의 모든 알림 목록 가져오기
export const getNotifications = async (myId) => {
    try {
      const res = await axios.get(`/spring/noti/${myId}`);
      return res.data;
    }
    
    catch (error) {
      console.error('에러났당', error);
      throw error; 
    }
};

//알림 읽음 처리(수정)
export const readNotification = async (jsondata) => {
    try {
      const res = await axios.put('/spring/noti/', jsondata,
        {headers: {'Content-Type': 'application/json'}});
      return res.data;
    }
    catch (error) {
      console.error('에러났당', error);
      throw error; 
    }
};