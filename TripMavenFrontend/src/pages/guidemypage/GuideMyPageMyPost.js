import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Pagination } from '@mui/material';
import { postGetByEmail } from '../../utils/postData';
import { fetchedData } from '../../utils/memberData';
import Loading from '../../components/LoadingPage';

const GuideMyPageMyPost = () => {
  const [posts, setPosts] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const membersId = localStorage.getItem('membersId');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('id: ', membersId)

    // 회원 이메일로 상품 조회 >> 내 게시글 관리
    const getData = async () => {
      try {
        const fetchData = await fetchedData(localStorage.getItem('membersId'));
        const postData = await postGetByEmail(fetchData.email);
        setPosts(postData);
        console.log('posts: ', postData);
      } catch (error) {
        console.error('에러났당', error);
      }
    };

    getData();
  }, [membersId]);

  const handleClick = (post) => {
    navigate(`/mypage/PostDetails/${post.id}`, { state: post });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (!posts) {
    return <Loading />;
  }

  // Pagination
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = posts.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <Box sx={{ maxWidth: 1200, p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          내 게시물 관리
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}
          onClick={() => navigate(`/mypage/guide/post/${membersId}`)}
        >
          게시물 등록 하기
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:'#f9f9f9'}}>
            <TableRow>
              <TableCell>작성번호</TableCell>
              <TableCell>지역</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>평가 여부</TableCell>
              <TableCell>등록 여부</TableCell>
              <TableCell>찜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((post, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleClick(post)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': { backgroundColor: '#D0F0FF' },
                }}
              >
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.city}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.createdAt.split('T')[0]}</TableCell>
                <TableCell>{post.isEvaluation}</TableCell>
                <TableCell>{post.isActive ? '유' : '무'}</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(posts.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  );
};

export default GuideMyPageMyPost;
