import React, { useEffect, useState } from 'react';
import styles from '../../../styles/usermypage/UserLike.module.css';
import { useNavigate } from 'react-router-dom';
import { getLikey, postGetById } from '../../../utils/postData';
import { fetchFile } from '../../../utils/fileData';
import { reviewGetByProductId } from '../../../utils/reviewData';
import Loading from '../../../components/LoadingPage';
import { Box, Typography } from '@mui/material';

const UserLike = () => {
  const navigate = useNavigate();
  const membersId = localStorage.getItem('membersId');
  const [products, setProducts] = useState([]); // 상품 목록을 관리하는 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [hasMore, setHasMore] = useState(false); // 더 가져올 데이터가 있는지 여부
  const [sortOrder, setSortOrder] = useState('latest'); // 정렬 기준 관리
  const [sortedProducts, setSortedProducts] = useState([]); // 정렬된 상품 목록을 관리하는 상태 변수

  useEffect(() => {

    const likeyList = async () => {
      setLoading(true); // 데이터 로딩 시작
      try {
        const likes = await getLikey(membersId);

        // 내가 찜한 게시글 정보 가져오기
        const resultPosts = [];
        for (const like of likes) {
          const resultPost = await postGetById(like.productBoard.id);
          resultPosts.push(resultPost);
        }

        // 파일 이미지 및 리뷰 데이터 가져오기
        const postsWithImages = await Promise.all(
          resultPosts.map(async (product) => {
            const file = product.files.split(',')[0];
            const image = await fetchFile(file, product.id);
            //console.log('게시글 파일 이미지 가져오기 image: ', image);

            // 해당 상품의 리뷰 데이터 조회
            let reviews = [];
            try {
              reviews = await reviewGetByProductId(product.id);
              //console.log('리뷰 데이터: ', reviews);
            } catch (error) {
              console.error(`Error fetching reviews for product ID ${product.id}: `, error);
            }

            return {
              ...product,
              image,
              reviews,
            };
          })
        );

        console.log('postsWithImages: ', postsWithImages);
        // 게시글 세팅
        setProducts(postsWithImages);
        setHasMore(false); // 로딩 완료 후 더 가져올 데이터가 없는 상태로 설정
      } catch (error) {
        console.error('찜목록 및 게시글 데이터 가져오기 중 에러: ', error);
      } finally {
        setLoading(false); // 데이터 로딩 종료
      }
    };

    likeyList();
  }, [membersId]);

  // products 또는 sortOrder 변경 시 정렬 처리
  useEffect(() => {
    const sorted = [...products].sort((a, b) => {
      if (sortOrder === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt); // 최근 순
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt); // 오래된 순
      }
    });
    setSortedProducts(sorted);
  }, [sortOrder, products]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          찜 목록
          <img className={styles.likeicon} src="../../../images/likeicon.png" alt="Like Icon" />
        </Typography>
      </Box>

      <div className={styles.controls}>
        <select
          className={styles.sortSelect}
          value={sortOrder} // select 요소에 현재 정렬 기준 설정
          onChange={(e) => setSortOrder(e.target.value)} // 선택 변경 시 상태 업데이트
        >
          <option value="latest">최근 순</option>
          <option value="oldest">오래된 순</option>
        </select>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="상품명 또는 태그로 검색"
        />
      </div>


      <div className={styles.productList}>
        {loading ? (
          <Loading />
        ) : (
          sortedProducts.map((product) => {
            // 리뷰 점수와 개수 계산
            const totalScore = product.reviews.reduce((sum, review) => sum + review.ratingScore, 0);
            const averageScore = product.reviews.length > 0 ? (totalScore / product.reviews.length).toFixed(1) : "0";
            const reviewCount = product.reviews.length;

            return (
              <div key={product.id} className={styles.productItem}
                onClick={() => navigate(`/postDetails/${product.id}`)}
              >
                <img src={product.image || '../../../images/travel.jpg'} alt="likey" />
                <div>
                  <p>[{product.city} {product.day}]</p>
                  <h3>{product.title}</h3>
                  <div className={styles.hashtags}>
                    {product.hashtag.split('#').map((tag, index) => (
                      tag.trim() !== '' && (
                        <div key={index} className={styles.hashtagBox}>
                          #{tag.trim()}
                        </div>
                      )
                    ))}
                  </div>
                  <div className={styles.rating}>
                    {/* 리뷰 점수 및 리뷰 개수 표시 */}
                    <span>⭐ {averageScore} / 5.0</span>
                    <span> ({reviewCount}건의 리뷰)</span>
                  </div>
                </div>
                <img
                  className={`${styles.likeicon1} ${styles.likeicon}`}
                  src="../../../images/likeicon.png" // 하트 이미지를 항상 채워진 상태로 표시
                  alt="Like Icon"
                />
              </div>
            );
          })
        )}
        {/* 로딩 중 텍스트 표시 */}
        <div ref={(ref) => ref} className={styles.loadingIndicator}>
          {hasMore && <Loading />}
        </div>
      </div>
    </Box>
  );
};

export default UserLike;
