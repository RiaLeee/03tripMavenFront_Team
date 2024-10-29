import React, { useState, useEffect } from 'react';
import styles from '../../styles/guidemypage/giudePost/ReviewList.module.css';
import { Avatar } from '@mui/material';
import { Star, StarHalf, StarBorder } from '@mui/icons-material';


const ReviewList = ({ data }) => {
  const reviews = Object.values(data)
  const renderStars = (rating) => {
    const fullStars = Math.max(0, Math.floor(rating));
    const halfStar = rating % 1 !== 0;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

    const generateStars = (count, Component) => (
      Array.from({ length: count }, (_, index) => (
        <Component className={styles.reviewRating} key={`${Component.name}-${index}`} />
      ))
    );

    return (
      <>
        {generateStars(fullStars, Star)}
        {halfStar && <StarHalf className={styles.reviewRating} key="half-star" />}
        {generateStars(emptyStars, StarBorder)}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.reviewHeader}>
        <span className={styles.reviewHeaderTitle}>리뷰</span>
        <span className={styles.reviewCount}>{reviews.length}건의 리뷰</span>
      </div>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <Avatar alt={review.member.profile} src={review.member.profile} className={styles.avatar} />
            <div className={styles.reviewDetails}>
              <div className={styles.reviewerName}>{review.member.name}</div>
              <div className={styles.reviewTitle}>{review.title}</div>
              <div className={styles.reviewText}>{review.comments}</div>
              <div className={styles.reviewRating}>
                {renderStars(review.ratingScore)} {review.ratingScore}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default ReviewList;
