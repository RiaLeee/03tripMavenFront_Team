import axios from 'axios';

// 멤버 가져오기
export const fetchData = async () => {
  try {
    const res = await axios.get('/spring/members');
    return res.data;
  }
  catch (error) {
    console.error('에러났당', error);
    throw error;
  }
};

// 아이디로 멤버 가져오기
export const fetchedData = async (id) => {
  try {
    const res = await axios.get(`/spring/members/id/${id}`);
    return res.data;
  }
  catch (error) {
    console.error('에러났당', error);
    throw error;
  }
};


// 이메일로 멤버 가져오기
export const findMemberbyEmail = async (email) => {
  try {
    const res = await axios.get(`/spring/members/email/${email}`);
    return res.data;
  }
  catch (error) {
    console.error('에러났당', error);
    throw error;
  }
};

// 회원가입
export const SignUp = async (form) => {
  await axios.post('/spring/signup', form)
    .then(response => {
      alert('가입 완료! 가입한 계정으로 로그인해주세요.');
      window.location.href = "/login";
    })
    .catch(error => {
      if (error.code === 'ERR_BAD_REQUEST') alert('중복된 아이디입니다.');
    });
};

// 이메일 코드 전송
export const sendEmailCode = async (email) => {
  try {
    await axios.post('/spring/emails/coderequests', null, {
      params: { email }
    });
    // alert 제거
  } catch (error) {
    console.error('Error: ', error.response || error.message);
  }
};

// 이메일 인증 확인
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await axios.get('/spring/emails/verifications', {
      params: { email, code },
    });
    console.log(response.data);  // 백엔드에서 오는 응답을 출력하여 확인
    return response.data === true;  // true/false 반환
  } catch (error) {
    console.error(error);  // 에러 발생 시 콘솔에 출력
    return false;
  }
};


// 폼 로그인
export const FormLogin = async (form) => {
  const response = await axios.post('http://localhost:9099/login', form, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  const token = response.headers['authorization'] || response.headers['Authorization'];
  if (token) {
    const pureToken = token.split(' ')[1];
    window.localStorage.setItem("token", pureToken);
    let role = "USER";
    if (response.data.isAdmin) role = "ADMIN";
    else if (response.data.isGuide) role = "GUIDE";
    window.localStorage.setItem("role", role);
    window.localStorage.setItem("membersId", response.data.membersId);
    window.localStorage.setItem("refresh", response.data.refresh);
    window.localStorage.setItem("loginType", "local");
  }

  return response;
};

// 로그아웃
export const logout = async () => {
  await axios.post('/spring/logout')
    .then(res => {
      return res;
    })
    .catch(error => {
      if (error.code === 'ERR_BAD_REQUEST') alert('중복된 아이디입니다.');
    });
};

// 가이드 등록
export const toGuide = async (memberId) => {
  await axios.put(`/spring/toguide/${memberId}`)
    .then(res => {
      window.localStorage.setItem("role", res.data.role);
      console.log(res.data.role);
      return res.data.role;
    })
    .catch(error => {
      console.error('에러났당', error);
      throw error;
    });
};

// 프로필 업데이트
export const updateProfile = async (id, updatedData) => {
  try {
    const res = await axios.put(`/spring/members/${id}`, updatedData,
      {headers: {'Content-Type': 'application/json'}}
    );
    return res.data;
  } catch (error) {
    console.error('프로필 업데이트 중 에러났당', error);
    throw error;
  }
};

// 회원 탈퇴
export const deleteProfile = async (id) => {
  try {
    const res = await axios.put(`/spring/members/delete/${id}`);
    logout();
    localStorage.clear();
    return res.data;
  } catch (error) {
    console.error('회원 탈퇴 중 에러났당', error);
    throw error;
  }
};

// 활동 온오프
export const activeOnOff = async (id) => {
  try {
    const res = await axios.put(`/spring/members/activeonoff/${id}`);
    return res.data;
  } catch (error) {
    console.error('회원 탈퇴 중 에러났당', error);
    throw error;
  }
};
