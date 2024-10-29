import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { csDelte, csGet } from '../../utils/csData';
import Loading from '../../components/LoadingPage';
import { TemplateContext } from '../../context/TemplateContext';

const AskDetailsView = () => {

    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);
    const navigate = useNavigate();
    const { memberInfo } = useContext(TemplateContext);
    useEffect(() => {
        const getCSData = async () => {
            try {
                const fetchedData = await csGet(id);
                setInquiry(fetchedData);
            } catch (error) {
                console.error('에러났당', error);
            }
        };

        getCSData();
    }, [id]);

    if (!inquiry) {
        return <Loading />; // 로딩 중 처리
    }

    const deleteInquiry = async () => {
        const confirmed = window.confirm("진짜 삭제?");
        if (confirmed) {
            try {
                await csDelte(id);
                navigate('/mypage/askall');
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
            }
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, p: 3, mt: 3 }}>
            <Typography variant="h4" mb={4} fontWeight="bold" >
                문의 내역 <Typography variant="subtitle1" component="span" sx={{ ml: 2 }}>상세보기</Typography>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9' }}>작성번호</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{inquiry.id}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9' }}>분류</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{inquiry.member.role ? '사용자' : '가이드'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9' }}>아이디</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{inquiry.member.email} (<small>{inquiry.member.name})</small></TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9' }}>작성일</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>{inquiry.createdAt.split('T')[0]}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9' }}>제목</TableCell>
                            <TableCell sx={{ textAlign: 'center' }} colSpan={3}>{inquiry.title}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9' }} colSpan={4}>내용</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }} colSpan={4}>{inquiry.content}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', backgroundColor: '#f9f9f9', color: '#000' }} colSpan={4}>답변</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }} colSpan={4}>{inquiry.comments}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {memberInfo.role != 'ADMIN' ?
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button variant="contained" sx={{ backgroundColor: '#E72727' }} onClick={deleteInquiry}>
                        삭제 하기
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" sx={{ backgroundColor: '#0066ff' }} onClick={() => navigate(`/askupdate/${inquiry.id}`,{inquiry})}>
                        수정 하기
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" sx={{ backgroundColor: '#0066ff' }} onClick={() => navigate('/mypage/askall')}>
                        목록
                    </Button>
                </Grid>
            </Grid>
            :
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button variant="contained" sx={{backgroundColor:'#0066ff','&:hover' : {backgroundColor:'#0056b3'}}}  onClick={() => navigate(`/mypage/admin/answer/${inquiry.id}`)}>
                    답변 등록 및 수정하기
                </Button>
                <Button variant="contained" sx={{backgroundColor:'#0066ff','&:hover' : {backgroundColor:'#0056b3'}}} onClick={() => navigate('/mypage/askall')}>
                    목록
                </Button>
            </Box>
            }
        </Box>
    );
};

export default AskDetailsView;
