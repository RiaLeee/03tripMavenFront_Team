import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Rating } from '@mui/material';
import { reviewDelete, reviewGetByReviewId, reviewPutByReviewId } from '../../../utils/reviewData';
import { Box, Typography, Divider } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment'; // 리뷰 작성 아이콘
import InfoIcon from '@mui/icons-material/Info'; // 상품명 아이콘
import styles from '../../../styles/usermypage/UserReviewDetails.module.css'; // CSS 모듈

const ReviewDetailsUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 리뷰 id
  const [data, setData] = useState(null); // 상품 정보
  const [ratingValue, setRatingValue] = useState(0); // 별점 상태 관리

  const titleRef = useRef(null);
  const commentsRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = await reviewGetByReviewId(id);
        console.log('fetchedData: ', fetchedData);
        setData(fetchedData);

        // ref 초기화 값 세팅
        if (titleRef.current) titleRef.current.value = fetchedData.title || '';
        if (commentsRef.current) commentsRef.current.value = fetchedData.comments || '';
        setRatingValue(fetchedData.ratingScore || 0);
      } catch (error) {
        console.error('리뷰id로 가져온 리뷰 데이터 오류:', error);
      }
    };

    getData();
  }, [id]);

  const updateRatingValue = (event, newValue) => {
    if (newValue !== null) {
      console.log('변경할 ratingValue : ',newValue);
      setRatingValue(newValue);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const title = titleRef.current ? titleRef.current.value : '';
    const comments = commentsRef.current ? commentsRef.current.value : '';

    if (!title) {
      newErrors.title = "리뷰 제목을 입력해주세요. 최대 20자까지 제한합니다.";
    } else if (title.length > 20) {
      newErrors.title = "리뷰 제목은 최대 20자까지 입력 가능합니다.";
    }

    if (ratingValue <= 0) newErrors.ratingScore = "최소 0.5점 이상의 점수를 입력해주세요.";
    if (!comments) newErrors.comments = "리뷰 내용을 입력해주세요.";

    return newErrors;
  };

  const handleData = async () => {
    try {
      const validationErrors = validateFields();
      if (Object.keys(validationErrors).length > 0) {
        console.log('유효성 오류:', validationErrors);
        return;
      }

      console.log('handleData의 ratingValue: ',ratingValue);
      const updatedData = {
        title: titleRef.current ? titleRef.current.value : '',
        ratingScore: ratingValue,
        comments: commentsRef.current ? commentsRef.current.value : '',
        productboard_id: data ? data.productBoard.id : '',
        member_id: localStorage.getItem('membersId')
      };
      console.log('수정할 데이터', updatedData);
      await reviewPutByReviewId(id, updatedData);
      navigate('/userreview');

    } catch (error) {
      console.error('리뷰 데이터 수정 실패:', error);
    }
  };

  const deleteData = async () => {
    window.confirm('작성하신 리뷰를 삭제하시겠습니까?');
    if(window.confirm) {
        // 아직 삭제 안함.
        await reviewDelete(id);
        alert('작성하신 리뷰가 삭제되었습니다.')
        navigate('/userreview');
    }
  };

  return (
    <div className={styles.container}>
      {/* 좌측 상단에 "REVIEW 수정" */}
      <Typography variant="h2" className={styles.reviewTitle}>
        REVIEW 수정
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
            value={data && data.productBoard ? data.productBoard.title : ''}
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
            onChange={() => {}}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="rating" className={styles.label}>
            별점
          </label>
          <div className={styles.starRating}>
            <Rating
              name="half-rating"
              value={ratingValue}
              precision={0.5}
              onChange={updateRatingValue}
            />
            <span className={styles.ratingNumber}>{ratingValue}</span>
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
            onChange={() => {}} 
          ></textarea>
        </div>

        <button type="button" className={styles.submitButton} onClick={handleData}>
          수정 완료
        </button>
        <button type="button" className={`${styles.submitButton} ${styles.deleteButton}`} onClick={deleteData}>
         리뷰 삭제
        </button>
      </Box>
    </div>
  );
};

export default ReviewDetailsUpdate;
