import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TextField, Button, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { csAnswerPut, csGet } from '../../../utils/csData';
import Loading from '../../../components/LoadingPage';

const AdminAnswer = () => {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState(null);
    const answerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getCSData = async () => {
            try {
                const fetchedData = await csGet(id);
                setInquiry(fetchedData);
                if (answerRef.current) {
                    answerRef.current.value = fetchedData.comments;
                }
            } catch (error) {
                console.error('에러났당', error);
            }
        };

        getCSData();
    }, [id]);

    if (!inquiry) {
        return <Loading />; // 로딩 중 처리
    }

    const newAnswer = () => {
        setInquiry({ ...inquiry, comments: answerRef.current.value });
    };

    const handleAnswer = async () => {
        try {
            const updatedData = { comments: answerRef.current.value };
            await csAnswerPut(id, updatedData);
            navigate('/askall');
        } catch (error) {
            console.error('에러났당:', error);
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" mb={4}>
                문의 내역 <Typography variant="subtitle1" component="span">답변 등록</Typography>
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
                            <TableCell sx={{ textAlign: 'center' }}>{inquiry.member.name}</TableCell>
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
                            <TableCell colSpan={4}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    placeholder="답변을 입력하세요"
                                    variant="outlined"
                                    inputRef={answerRef}
                                    onChange={newAnswer}
                                    defaultValue={inquiry.comments}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#C5C5C5', // 기본 아웃라인 색상을 검은색으로 설정
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'black', // 마우스 호버 시에도 검은색 유지
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'black', // 입력 필드 포커스 시에도 검은색 유지
                                            },
                                        },
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Button variant="contained" sx={{ backgroundColor: '#0066ff' }} onClick={handleAnswer}>
                        답변 완료
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminAnswer;
