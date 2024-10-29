import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Pagination, Avatar } from '@mui/material';
import { MypageContext } from '../../context/MypageContext';
import { TemplateContext } from '../../context/TemplateContext';

const AskAll = () => {
  const [page, setPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { inquiries, totalPages } = useContext(MypageContext);
  const { memberInfo } = useContext(TemplateContext);
  const [inquery, setInquiry] = useState([]);
  const [sortOrder, setSortOrder] = useState('latest'); // 정렬 기준 관리
  const [sortedProducts, setSortedProducts] = useState([]); // 정렬된 상품 목록을 관리하는 상태 변수

  useEffect(() => {
    setInquiry(inquiries)
    if (memberInfo.role != 'ADMIN') {
      const filteredInquiries = inquiries.filter((item) => item.member.id === memberInfo.id);
      setInquiry(filteredInquiries);
    }
  }, [inquiries, memberInfo.id]);

  useEffect(() => {
    const sorted = [...inquery].sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt); // 최근 순
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt); // 오래된 순
      }
    });
    setSortedProducts(sorted);
  }, [sortOrder, inquery]);

  const handleClick = (inquiry) => {
    navigate(`/mypage/askdetailsview/${inquiry.id}`);
  };

  const paginatedInquiries = sortedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event, value) => { setPage(value); };

  const handleMouseEnter = (index) => { setHoveredRow(index); };

  const handleMouseLeave = () => { setHoveredRow(null); };




  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          문의 내역
        </Typography>
        <div className='d-flex'>
          <select className='me-4'
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px', marginRight: '10px' }}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)} >
            <option value="latest">최근 순</option>
            <option value="oldest">오래된 순</option>
          </select>

          {memberInfo.role != 'ADMIN' ?
            <Button variant="contained" sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}
              onClick={() => navigate(`/askpost/${memberInfo.id}`)}> 문의 하기 </Button>
            :
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={memberInfo.profile} sx={{ width: 32, height: 32, mr: 2 }} />
              <Typography>관리자</Typography>
            </Box>}
        </div>
      </Box>
      {memberInfo.role != 'ADMIN' ?
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell>답변 상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInquiries.map((myinquiry, index) => (
                <TableRow key={index} hover onClick={() => handleClick(myinquiry)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#D0F0FF' } }}>
                  <TableCell>{myinquiry.id}</TableCell>
                  <TableCell>{myinquiry.title}</TableCell>
                  <TableCell>{myinquiry.createdAt.split('T')[0]}</TableCell>
                  <TableCell>{myinquiry.comments ? '완료' : '대기중'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
              <TableRow>
                <TableCell>작성번호</TableCell>
                <TableCell>아이디</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>분류</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>작성일</TableCell>
                <TableCell>답변 상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedInquiries.map((myinquiry, index) => (
                <TableRow key={index} hover
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(myinquiry)}
                  sx={{
                    cursor: 'pointer', transition: 'background-color 0.3s', backgroundColor: hoveredRow === index ? '#D0F0FF' : 'inherit',
                  }}>
                  <TableCell>{myinquiry.id}</TableCell>
                  <TableCell>{myinquiry.member.email}</TableCell>
                  <TableCell>{myinquiry.member.name}</TableCell>
                  <TableCell>{myinquiry.member.role ? '고객' : '가이드'}</TableCell>
                  <TableCell>{myinquiry.title}</TableCell>
                  <TableCell>{myinquiry.createdAt.split('T')[0]}</TableCell>
                  <TableCell>{myinquiry.comments ? '완료' : '대기중'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange}
          showFirstButton showLastButton siblingCount={1} boundaryCount={1} />
      </Box>
    </Box>
  );
};

export default AskAll;
