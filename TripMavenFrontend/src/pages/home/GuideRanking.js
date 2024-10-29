import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button } from '@mui/material';
import styles from '../../styles/home/GuideRanking.module.css';

const GuideRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get('/api/guide-ranking');
                setRanking(response.data);
            } catch (error) {
                console.error('가이드 랭킹을 가져오는 중 오류 발생:', error);
            }
        };

        fetchRanking();
    }, []);

    const currentRanking = ranking.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const totalPages = Math.ceil(ranking.length / rowsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <Box className={styles.leaderboardContainer} sx={{ bgcolor: '#ffffff' }}>
            <Paper className={styles.leaderboardTitle} elevation={3} sx={{ bgcolor: '#5da7f7' }}>
                <Typography variant="h4" align="center" className={styles.titleText} sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    LEADERBOARD
                </Typography>
            </Paper>
            <Box className={styles.leaderboardContent}>
                {currentRanking.map((guide, index) => {
                    const globalIndex = (currentPage - 1) * rowsPerPage + index;
                    const isFirstPlace = globalIndex === 0;

                    return (
                        <Paper
                            key={guide.id}
                            className={`${styles.leaderboardItem} ${isFirstPlace ? styles.firstPlaceItem : ''}`}
                            elevation={2}
                            sx={{
                                bgcolor: isFirstPlace ? '#57af7a' : '#ffffff',
                                color: isFirstPlace ? '#ffffff' : '#000000',
                            }}
                        >
                            <Box className={styles.rankingNumber} sx={{ bgcolor: '#0095ff', color: '#ffffff' }}>
                                {globalIndex + 1}
                            </Box>
                            <Box className={styles.rankingInfo}>
                                <Typography variant="h6" sx={{ color: 'inherit' }}>
                                    {guide.member.name} {/* 이름을 가져오려면 적절히 수정 */}
                                    {isFirstPlace && (
                                        <img
                                            src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true"
                                            alt="Gold Medal"
                                            className={styles.goldMedal}
                                        />
                                    )}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'inherit' }}>
                                    별점: {guide.averageRating.toFixed(2)} {/* 별점 표시 */}
                                </Typography>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
            <Box className={styles.paginationButtons}>
                <Button
                    onClick={handleFirstPage}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                    sx={{ bgcolor: '#ffffff', color: '#000000', '&:disabled': { bgcolor: '#ffffff' } }}
                >
                    &lt;&lt;
                </Button>
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                    sx={{ bgcolor: '#5c5be5', color: '#ffffff', '&:disabled': { bgcolor: '#b3b3b3' } }}
                >
                    &lt;Prev
                </Button>
                <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                    sx={{ bgcolor: '#5c5be5', color: '#ffffff', '&:disabled': { bgcolor: '#b3b3b3' } }}
                >
                    Next&gt;
                </Button>
                <Button
                    onClick={handleLastPage}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                    sx={{ bgcolor: '#ffffff', color: '#000000', '&:disabled': { bgcolor: '#ffffff' } }}
                >
                    &gt;&gt;
                </Button>
            </Box>
        </Box>
    );
};

export default GuideRanking;
