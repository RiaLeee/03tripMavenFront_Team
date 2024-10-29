import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Pagination } from '@mui/material';
import { TemplateContext } from '../../../context/TemplateContext';
import { reviewGet } from '../../../utils/reviewData';

const UserReview = () => {
  const navigate = useNavigate();
  const { memberInfo } = useContext(TemplateContext);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // 페이지 당 리뷰 수

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 리뷰 가져오기
        const resultReviews = await reviewGet(memberInfo.id);
        setReviews(resultReviews);
      } catch (error) {
        console.error('리뷰 데이터 조회 중 에러:', error);
      }
    };

    fetchData();
  }, [memberInfo.id]);

  // 페이지에 따른 리뷰 필터링
  const paginatedReviews = reviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          작성한 리뷰
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>상품명</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>상품 보기</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((review) => (
                <TableRow
                  key={review.id}
                  hover
                  onClick={() => navigate(`/reviewDetailsUpdate/${review.id}`)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#D0F0FF' } }}
                >
                  <TableCell>{review.id}</TableCell>
                  <TableCell>{review.productBoard.title}</TableCell>
                  <TableCell>{review.title}</TableCell>
                  <TableCell>{review.createdAt.split('T')[0]}</TableCell>
                  <TableCell
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/mypage/postDetails/${review.productBoard.id}`);
                    }}
                    sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                  >
                    바로가기
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  작성하신 리뷰가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(reviews.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          showFirstButton
          showLastButton
          siblingCount={1}
          boundaryCount={1}
        />
      </Box>
    </Box>
  );
};

export default UserReview;
