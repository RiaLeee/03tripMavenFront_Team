import React, { useEffect, useRef, useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { postGetById, postPut } from '../../utils/postData';


const GuideUpdatePost = () => {

  const { id } = useParams();
  const [posts, setPosts] = useState({});
  const membersId = localStorage.getItem('membersId');
  const navigate = useNavigate();

  const titleRef = useRef(null);
  const hashtagRef = useRef(null);
  const filesgRef = useRef(null);
  const dayRef = useRef(null);
  const cityRef = useRef(null);
  const hotelRef = useRef(null);
  const hotelAdRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await postGetById(id);
        setPosts(fetchedData || {});
      } catch (error) {
        console.error('에러났당', error);
      }
    };

    getData();
  }, [id]);

  const handleInputChange = (field, ref) => {
    setPosts({ ...posts, [field]: ref.current.value });
  };

  const handleFileChange = () => {
    const filename = filesgRef.current.files[0];
    setPosts({ ...posts, files: filename });
  };

  const handlePost = async () => {
    try {
      const updateData = {
        title: titleRef.current.value,
        hashtag: hashtagRef.current.value,
        files: posts.files,
        day: dayRef.current.value,
        city: cityRef.current.value,
        hotel: hotelRef.current.value,
        hotelAd: hotelAdRef.current.value,
        content: contentRef.current.value,
        member_id: membersId,
        id: posts.id
      };
      await postPut(updateData);
      navigate('/mypage/guide/post');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography sx={{ fontWeight: 'bold' }} variant="h4" mb={4}>
        게시물 수정하기 <span role="img" aria-label="edit">✍️</span>
      </Typography>

      <Paper sx={{ p: 3 }}>
        {/* 대표 내용 섹션 */}
        <Typography variant="h6" mb={2}>대표 내용</Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="제목"
              placeholder="제목을 입력하세요"
              inputRef={titleRef}
              onChange={() => handleInputChange('title', titleRef)}
              value={posts.title || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="해시태그"
              placeholder="해시태그를 입력하세요"
              inputRef={hashtagRef}
              onChange={() => handleInputChange('hashtag', hashtagRef)}
              value={posts.hashtag || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              대표 이미지 업로드
              <input
                type="file"
                hidden
                ref={filesgRef}
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
        </Grid>

        {/* 여행 주요일정 섹션 */}
        <Typography variant="h6" mb={2}>여행 주요일정</Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="일정(기간)"
              placeholder="일정을 입력하세요"
              inputRef={dayRef}
              onChange={() => handleInputChange('day', dayRef)}
              value={posts.day || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="여행도시"
              placeholder="여행 도시를 입력하세요"
              inputRef={cityRef}
              onChange={() => handleInputChange('city', cityRef)}
              value={posts.city || ''}
            />
          </Grid>
        </Grid>

        {/* 테마 소개 섹션 */}
        <Typography variant="h6" mb={2}>테마 소개</Typography>
        {[1, 2, 3].map((day) => (
          <Grid container spacing={2} mb={3} key={day}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={`${day}일차 일정`}
                placeholder={`${day}일차 일정을 입력하세요`}
                inputRef={contentRef}
                onChange={() => handleInputChange('content', contentRef)}
                value={posts.content || ''}
              />
            </Grid>
          </Grid>
        ))}

        {/* 호텔 정보 섹션 */}
        <Typography variant="h6" mb={2}>호텔 정보</Typography>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="호텔"
              placeholder="호텔 이름을 입력하세요"
              inputRef={hotelRef}
              onChange={() => handleInputChange('hotel', hotelRef)}
              value={posts.hotel || ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="주소"
              placeholder="호텔 주소를 입력하세요"
              inputRef={hotelAdRef}
              onChange={() => handleInputChange('hotelAd', hotelAdRef)}
              value={posts.hotelAd || ''}
            />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" onClick={handlePost}>
          수정하기
        </Button>
      </Paper>
    </Box>
  );
};

export default GuideUpdatePost;
