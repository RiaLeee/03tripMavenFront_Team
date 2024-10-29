import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from '../../styles/registerguidepage/RegisterGuide.module.css';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { filesPost, fetchLicenseFile } from '../../utils/fileData';
import { Box, Button, TextField, Typography, Divider } from '@mui/material';
import { ocr, verifyLicense } from '../../utils/PythonServerAPI';
import LinearProgress from '@mui/material/LinearProgress';
import { fetchedData, toGuide, updateProfile } from '../../utils/memberData';
import { TemplateContext } from '../../context/TemplateContext';

const RegisterGuidePage = ({userId, handleClose}) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [previewUrl, setPreviewUrl] = useState([]);
  const [loading, setLoading] = useState(false); //로딩 스테이트
  const [loading2, setLoading2] = useState(false); //로딩 스테이트
  const [ocrResult, setOcrResult] = useState({});
  const [pendingLicense, setPendingLicense] = useState(false);
  const fileInputRef = useRef(null);
  const { memberInfo, setMemberInfo } = useContext(TemplateContext);
  const [verifyResult, setVerifyResult] = useState({});
  const isGuide = useRef(false);
  
  //input 타입 파일 선택
  const handleFileChange_ = async (event) => {
    const files = Array.from(event.target.files);
    setSelectedFile(files);
    setPreview(files)
    fileOCR(files);
  };

  // 미리보기 URL 설정
  const setPreview =(files) =>{
    const filePreview = files.map((file) => {
      return {
        name: file.name,
        url: URL.createObjectURL(file),
      };
    });
    setPreviewUrl(filePreview);
  };

  //파일 OCR API 요청
  const fileOCR = async (fileList) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image',fileList[0]);
    formData.append('ocrValue','ocr');
    let responseData = '';
    try {
      const respData = await ocr(formData);
      responseData = respData;
      if(respData.success == true){
        setOcrResult((prev)=>({...prev, name:respData.data.name, number:respData.data.number, subject:respData.data.subject}));
      }
    }
    catch (error) {console.error('Error uploading file:', error);}
    setLoading(false);
    return responseData;
  };

  //자격증 확인사이트 결과 받기
  const verifyOCRResult = async(ocrResult)=>{
    const formData = new FormData();
    formData.append('subject',ocrResult.subject);
    formData.append('name',ocrResult.name);
    formData.append('number',ocrResult.number);
    return await verifyLicense(formData);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        if(userId){ //회원 목록에서 누른 모달창일 경우(관리자가 누르는 것)
          const userInfo = await fetchedData(userId); 
          if(userInfo.role==='USER') setPendingLicense(true); //라이센스 인증 중
          const encodedFilename = encodeURIComponent(userInfo.guidelicense); //한글이름파일 인코딩
          const {fileUrl, file} = await fetchLicenseFile(encodedFilename); //서버에서 파일 받아오기
          console.log(fileUrl); //가이드 인증 파일 url

          setPreviewUrl([{
            name: userInfo.guidelicense,
            url: fileUrl
          }]);

          const respData = await fileOCR([file]) //ocr해서 결과 보여주기
          console.log(respData);

          //자격증 확인 페이지 결과 반환
          setLoading2(true);
          const result = await verifyOCRResult(respData.data);  
          setVerifyResult(prev => ({...prev, success:result}));
          setLoading2(false);
        }
        else if(memberInfo && memberInfo.guidelicense){ //헤더에서 열었을 경우
          if(memberInfo.role==='USER') setPendingLicense(true); //라이센스 인증 중
          const encodedFilename = encodeURIComponent(memberInfo.guidelicense); //한글이름파일 인코딩
          const {fileUrl, file} = await fetchLicenseFile(encodedFilename); //서버에서 파일 받아오기
          //console.log('자격등 등록 url: ',fileUrl); //가이드 인증 파일 url
          setPreviewUrl([{
            name: memberInfo.guidelicense,
            url: fileUrl
          }]);
          await fileOCR([file]) //ocr해서 결과 보여주기
        }
      }
      catch (error) {console.error('에러났당', error);}
    };

    getData();
    setPreview(selectedFile);
  }, [memberInfo]);
  
  /*
  useEffect(()=>{
    // 메모리 누수 방지: 컴포넌트 언마운트 시 URL 객체 해제
    return () => {
      previewUrl.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [previewUrl]);
  */

  /*
  const handleFileChange2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType === 'application/pdf' ||
        fileType.startsWith('image/')
      ) {
        setFormData(formData.fileName = file.name);

      } else {
        setFormData(formData.fileName = '');
        alert('이미지 파일(jpg, jpeg, png, gif) 또는 PDF 파일만 업로드 가능합니다.');
      }
    }
  };
  */
  const submitToGuide = async () => {
    if(!userId){
      //멤버 디비에 파일 이름 저장
      const updateData = {
        'guidelicense': previewUrl[0].name
      };
      const resp = await updateProfile(localStorage.getItem("membersId"),updateData);
      setMemberInfo(resp);

      //디비에 실제 파일 업로드
      const formData = new FormData();
      console.log(selectedFile);
      if (selectedFile && selectedFile.length > 0) formData.append('files',selectedFile[0]);
      formData.append('type','guidelicense');
      const resp2 = await filesPost(formData);
      if(resp2.success) setPendingLicense(false);
    }
    else{
      //가이드로 변경
      const response = await toGuide(userId);
      alert('가이드로 변경되었습니다');
      handleClose();
    }
  };

  const rejectGuide = async () => {
    //회원정보 수정(가이드라이센스 컬럼값 삭제)
    const formData = new FormData();
    formData.append('guidelicense',null);
    await updateProfile(userId, formData);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>가이드 등록</h1>
      <div className={styles.contentFrame}>
        <Box sx={{ mt: 1, width:'50%'}}>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            ref={fileInputRef}
            multiple
            style={{ display: 'none' }}  // Hide the file input
            onChange={handleFileChange_}
            
          />
          <label htmlFor="file-input">
            <Button
              variant="outlined"
              component="span"
              sx={{ mt: 1,border:'1px solid #0066ff', '&:hover': {color:'#ffffff', backgroundColor: '#0066ff' } }}
            >
              파일 찾기
            </Button>
          </label>

          {/* 선택된 파일명 표시 */}
          {selectedFile.length > 0 && (
            <Box sx={{ mt: 1 }}>
              {selectedFile.map((file, index) => (
                <Typography key={index} sx={{ mb: 1 }}>
                  미리보기: {file.name}
                </Typography>
              ))}
            </Box>
          )}

          {/* 이미지 미리보기 표시 */}
          {previewUrl.length > 0 && (
            <Box sx={{ mt: 2 , paddingLeft:0}}>
              {previewUrl.map((file, index) => (
                <img
                  key={index}
                  src={file.url}  
                  alt={`파일 미리보기 ${index + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '550px', objectFit: 'cover', marginBottom: '10px',border:'3px solid #f1f1f1' }}
                />
              ))}
            </Box>
          )}
        </Box>

        <div className={styles.licenseInfoConfirm}>
          <Box sx={{ mt: 8 }}>
            <Typography variant="h7" gutterBottom sx={{fontWeight:'bold'}}>자격증 정보 확인</Typography>
            {loading ? (
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
            ) : 
            (<>
              <TextField fullWidth label="자격증명" margin="normal"  defaultValue={!ocrResult?'not detected':ocrResult.subject==='default'?'not detected':ocrResult.subject }
                InputProps={{
                  readOnly: true,
                }}
                disabled={pendingLicense}
              />
              <TextField fullWidth label="성명" margin="normal" defaultValue={!ocrResult?'not detected':ocrResult.name==='default'?'not detected':ocrResult.name}
                disabled={pendingLicense}
              />
              <TextField fullWidth label="관리 번호" margin="normal"  defaultValue={!ocrResult?'not detected':ocrResult.number==='default'?'not detected':ocrResult.number}
                disabled={pendingLicense}
              />
              <Typography variant="h7" gutterBottom sx={{fontSize:'12px', color:'#666'}}>*성명과 관리번호를 확인 후 제출해주세요</Typography>

              {userId ? 
              (<Box sx={{ marginTop:'10px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop:'10px' }}>
                  { (pendingLicense && loading2 ) ?
                    (<Box sx={{ width: '100%' }}>
                        <LinearProgress />
                      </Box>) :
                    (<Box sx={{ display: 'flex', justifyContent: 'center', marginTop:'20px' }}>
                        <Typography variant="h7" gutterBottom sx={{fontWeight:'bold'}}>확인결과: {verifyResult.success ? '확인 완료':'확인 불가'}</Typography>
                      </Box>)
                  }
                </Box>
                <Button variant="contained" sx={{ backgroundColor: '#0066ff', marginTop:'20px'}} onClick={submitToGuide}>가이드 변경</Button>
              </Box>
              )
              :
              (<>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop:'10px' }}>
                  <Button variant="contained" sx={{ backgroundColor: '#0066ff' }} onClick={()=>{fileOCR(fileInputRef.current.files)}} disabled={pendingLicense}>재인식</Button>
                  <Button variant="contained" sx={{ backgroundColor: '#0066ff' }} onClick={submitToGuide} disabled={pendingLicense}>등록 요청</Button>
                </Box>
                {pendingLicense && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop:'20px' }}>
                  <Typography variant="h7" gutterBottom sx={{fontWeight:'bold'}}>관리자 승인 대기 중</Typography>
                </Box>
                )}
              </>)}
            </>)}
          </Box>
          
        </div>
      </div>

      {/*
      <div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>자기소개</label>
          <textarea
            className={styles.textarea} name="introduce" value={formData.introduce}
            placeholder="자기소개를 입력해주세요 30자 이상 500자 이하"
            onChange={handleChange}
          />
        </div>
        <div className={styles.buttonblock}>
          <button className={styles.button} onClick={submitToGuide}>등록</button>
        </div>
      </div>
       */}

    </div>

  );
};

export default RegisterGuidePage;
