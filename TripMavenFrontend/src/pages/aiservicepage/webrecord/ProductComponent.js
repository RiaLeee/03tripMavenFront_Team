import React, { useEffect, useState } from 'react';
import { Box, Typography, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../../../styles/aiservicepage/webrecord/ProductComponent.module.css';
import { fetchedData } from '../../../utils/memberData';
import { postGetByEmail } from '../../../utils/postData';
import { fetchFiles } from '../../../utils/fileData';

const ProductComponent = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // 여러 제품을 배열로 관리

  useEffect(() => {
    const getData = async () => {
      try {
        const memberId = localStorage.getItem('membersId');
        const fetchData = await fetchedData(memberId);
        const postData = await postGetByEmail(fetchData.email);

        // 게시글마다 파일 데이터를 가져와서 결합
        const productsWithFiles = await Promise.all(
          postData.map(async (product) => {
            const fileData = await fetchFiles(product.id);
            return {
              ...product,
              fileUrl: fileData.length > 0 ? fileData[0] : './images/travel.jpg', // 파일이 있으면 첫 번째 파일 URL, 없으면 기본 이미지
              isEvaluated: false, // AI 평가 여부를 여기서 추가
              aiScore: 4.7, // 임의의 AI 점수 (나중에 실제 데이터로 대체)
            };
          })
        );
        
        setProducts(productsWithFiles);
      } catch (error) {
        console.error('데이터 로딩 중 에러 발생:', error);
      }
    };

    getData();
  }, []); // 컴포넌트가 처음 로드될 때만 실행

  return (
    <Box className={styles.compactProductList}>

    {/* 상단에 메시지 추가 */}
    <Typography variant="h5" align="center" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
            AI 평가를 받을 여행 상품을 선택하세요.
        </Typography>


      {products.map((product, index) => (
        <Box
          key={index}
          className={styles.compactProductItem}
          onClick={() => navigate(`/realTestPage/${product.id}`)}
        >
          <img
            src={product.fileUrl || './images/travel.jpg'}
            alt={product.title}
            className={styles.compactProductImage}
          />
          <Box className={styles.compactProductInfo}>
            <Typography variant="h6" className={styles.compactTitle}>
              [{product.city}] [{product.day}] {product.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <Typography variant="body2" sx={{ marginRight: '10px' }}>
                AI 평가: {product.isEvaluated ? '완료' : '미완료'}
              </Typography>
              {product.isEvaluated && (
                <Rating
                  name="half-rating-read"
                  defaultValue={product.aiScore}
                  precision={0.5}
                  readOnly
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: 'blue',
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default ProductComponent;
