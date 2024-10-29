import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Rating } from '@mui/material';  // Material-UI Rating 컴포넌트 사용
import { reviewPost } from '../../../utils/reviewData';
import { postGetById } from '../../../utils/postData';
import { Box, Typography, Divider } from '@mui/material';  // Material-UI 컴포넌트 사용
import AssignmentIcon from '@mui/icons-material/Assignment';  // 리뷰 작성 아이콘
import InfoIcon from '@mui/icons-material/Info';  // 상품명 아이콘
import styles from '../../../styles/usermypage/UserReviewDetails.module.css'; // CSS 모듈

const ReviewDetails = () => {
    const navigate = useNavigate();
    const [ratingValue, setRatingValue] = useState(0);  // 별점 상태 관리
    const { id } = useParams(); // 상품 id
    const [data, setData] = useState(null); // 상품 정보

    const titleRef = useRef(null);
    const commentsRef = useRef(null);

    useEffect(() => {
        const getData = async () => {
            try {
              const fetchedData = await postGetById(id);
              console.log('fetchedData: ', fetchedData);
              setData(fetchedData);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
        };

        getData();
    }, [id]);

    const updateRatingValue = (event, newValue) => {
        if (newValue !== null) {  // newValue가 존재할 때만 상태 업데이트
            setRatingValue(newValue);
        }
    };

    const validateFields = () => {
        const newErrors = {};
        const titleValue = titleRef.current?.value;

        if (!titleValue) {
            newErrors.title = "리뷰 제목을 입력해주세요. 최대 20자까지 제한합니다.";
        } else if (titleValue.length > 20) {
            newErrors.title = "리뷰 제목은 최대 20자까지 입력 가능합니다.";
        }

        if (!ratingValue) newErrors.ratingScore = "최소 0.5점 이상의 점수를 입력해주세요.";
        if (!commentsRef.current?.value) newErrors.comments = "리뷰 내용을 입력해주세요.";

        return newErrors;
    };

    const reviewCreate = async () => {
        try {
            const validationErrors = validateFields();
            if (Object.keys(validationErrors).length > 0) {
                console.log('Validation Errors:', validationErrors);
                return;
            }

            const createData = { 
                title: titleRef.current?.value || '',
                ratingScore: ratingValue || '',
                comments: commentsRef.current?.value || '',
                productboard_id: id,
                member_id: localStorage.getItem('membersId')
            };

            console.log('createData', createData);
            await reviewPost(createData);
            navigate('/userreview');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className={styles.container}>
            {/* 좌측 상단에 "REVIEW" */}
            <Typography variant="h2" className={styles.reviewTitle}>
                REVIEW
            </Typography>

            <Box className={styles.section}>
                <Typography variant="h6" className={styles.sectionTitle}>
                    <InfoIcon className={styles.icon} /> 상품명
                </Typography>
                <Divider className={styles.divider} />
                <div className={styles.formGroup}>
                    <input
                        disabled
                        type="text"
                        className={styles.input}
                        value={data ? data.title : ''}
                    />
                </div>
            </Box>

            <Box className={styles.section}>
                <Typography variant="h6" className={styles.sectionTitle}>
                    <AssignmentIcon className={styles.icon} /> 리뷰 작성하기
                </Typography>
                <Divider className={styles.divider} />
                <div className={styles.formGroup}>
                    <label htmlFor="reviewTitle" className={styles.label}>
                        리뷰 제목
                    </label>
                    <input
                        type="text"
                        id="reviewTitle"
                        className={styles.input}
                        placeholder="리뷰 제목을 입력하세요."
                        ref={titleRef}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="rating" className={styles.label}>
                        별점
                    </label>
                    <div className={styles.starRating}>
                        <Rating
                            name="half-rating"
                            value={ratingValue}  // 현재 별점 값
                            precision={0.5}  // 0.5 단위로 조정
                            onChange={updateRatingValue}
                        />
                        <span className={styles.ratingNumber}>{ratingValue}</span> {/* 별점 값 표시 */}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="content" className={styles.label}>
                        리뷰 내용
                    </label>
                    <textarea
                        id="content"
                        className={styles.textarea}
                        placeholder="리뷰 내용을 입력하세요."
                        ref={commentsRef}
                    ></textarea>
                </div>

                <button type="button" className={styles.submitButton} onClick={reviewCreate}>
                    등록 하기
                </button>
            </Box>
        </div>
    );
};

export default ReviewDetails;
