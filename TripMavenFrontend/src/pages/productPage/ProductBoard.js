import React, { useState, useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from '../../styles/productPage/ProductBoard.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { postsAllGet, postsCityGet, postsSearchWordGet } from '../../utils/postData';
import YouTubeSearch from '../../api/YouTubeSearch';
import { fetchFiles } from '../../utils/fileData';
import { Button, Rating, Typography } from '@mui/material';
import defaultimg from '../../images/default_profile.png';
import { TemplateContext } from '../../context/TemplateContext';
import Loading from '../../components/LoadingPage';
import { reviewGetByProductId } from '../../utils/reviewData';
import { resultGetByProductId } from '../../utils/AiData';

const ProductBoard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const [sortOrder, setSortOrder] = useState('latest'); // 정렬 기준 관리
    const [sortedProducts, setSortedProducts] = useState([]); // 정렬된 상품 목록을 관리하는 상태 변수
    const keyword = params.get('keyword');
    const city = params.get('city');
    const [products, setProducts] = useState([]); // 상품 목록 스테이트
    const [page, setPage] = useState(0); // 페이지(20개씩임)
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
    const [loading, setLoading] = useState(false);
    const { memberInfo } = useContext(TemplateContext);

    const { ref, inView } = useInView({
        threshold: 0, // 요소가 100% 보일 때 트리거
    });

    // 데이터를 더 가져오는 함수
    const fetchMoreData = async () => {
        if (!hasMore || loading) return; // 이미 초기화된 상태에서만 데이터 불러오기
        setLoading(true);
        let results;
        if (city) results = await postsCityGet(city, page); // 페이지도 넘기기
        else if (keyword === '') results = await postsAllGet(page); // 페이지도 넘기기(keyword 없을 땐 전체 검색)
        else results = await postsSearchWordGet(keyword, page); // 페이지도 넘기기
        //console.log('검색 결과:', results);
        setLoading(false);

        const productsWithFiles = await Promise.all(
            results.map(async (product) => {
                const fileData = await fetchFiles(product.id);
                const productEvaluationListByProductId = await resultGetByProductId(product.id);
                //console.log('productEvaluationListByProductId:',productEvaluationListByProductId);
                let sumEvaluationScore;
                if(productEvaluationListByProductId.length>0){
                    sumEvaluationScore = productEvaluationListByProductId.reduce((sum, joinProductEvaluation)=>{
                        if(joinProductEvaluation.productEvaluation.length==1)
                            return sum+joinProductEvaluation.productEvaluation[0].score;
                        else
                            return sum+joinProductEvaluation.productEvaluation[0].score+joinProductEvaluation.productEvaluation[1].score;
                    } ,0);
                }
                const mean = sumEvaluationScore/(productEvaluationListByProductId.length * 2)/100*5
                return {
                    ...product,
                    fileUrl: fileData.length > 0 ? fileData[0] : './images/travel.jpg', // 첫 번째 파일 URL 또는 기본 이미지
                    aiScore: productEvaluationListByProductId.length>0 ? mean : 0,
                };
            })
        );


        setProducts(productsWithFiles);

        setPage((prevPage) => prevPage + 1); // 다음 페이지로 설정
        if (results.length < 20) {
            setHasMore(false);
        }

    };

    // 검색어가 바뀔 때마다 데이터를 초기화하고, 새로 가져옴
    useEffect(() => {
        const resetAndFetch = async () => {
            setProducts([]);
            setPage(0);
            setHasMore(true);
            await fetchMoreData();
        };
        resetAndFetch();
    }, [location.search]);

    // inView 상태가 변경될 때마다 데이터를 더 가져옴
    useEffect(() => {
        if (inView && hasMore) {
            fetchMoreData();
        }
        const sorted = [...products].sort((a, b) => {
            if (sortOrder === 'latest') {
                return new Date(b.createdAt) - new Date(a.createdAt); // 최근 순
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt); // 오래된 순
            }
        });
        if (JSON.stringify(sorted) !== JSON.stringify(sortedProducts)) {
            setSortedProducts(sorted);
        }
    }, [inView, hasMore, sortOrder, products]);


    useEffect(() => {
        const productsId = sortedProducts.map(product => product.id);
        const getReviews = async () => {
            try {
                // productsId에 대해 비동기 작업을 병렬로 처리
                const reviewsData = await Promise.all(productsId.map(id => reviewGetByProductId(id)));

                const updatedProducts = sortedProducts.map((product, index) => ({
                    ...product,
                    reviews: reviewsData[index]  // reviewsData의 해당 인덱스 값을 추가
                }));

                if (JSON.stringify(updatedProducts) !== JSON.stringify(sortedProducts)) {
                    setSortedProducts(updatedProducts);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        getReviews();

    }, [sortedProducts]);

    return (
        <div className={styles.container}>
            <div className="App mb-5" >
                <YouTubeSearch keyword={keyword} city={city} />
            </div>
            <div className='d-flex justify-content-between'>
                <h1 style={{ marginLeft: '40px' }}>{city} 상품 목록</h1>
                {!city && (keyword !== '' && <h3 style={{ marginLeft: '40px' }}>'{keyword}'에 대한 검색 결과입니다</h3>)}
                <div>
                    <select
                        className={styles.sortSelect}
                        value={sortOrder} // select 요소에 현재 정렬 기준 설정
                        onChange={(e) => setSortOrder(e.target.value)} // 선택 변경 시 상태 업데이트
                    >
                        <option value="latest">최근 순</option>
                        <option value="oldest">오래된 순</option>
                    </select>
                    {(memberInfo.role == 'GUIDE' || memberInfo.role == 'ADMIN') &&
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: '#0066ff', '&:hover': { backgroundColor: '#0056b3' } }}
                            onClick={() => navigate(`/productPost/${memberInfo.id}`)}
                        >
                            게시물 등록 하기
                        </Button>
                    }
                </div>
            </div>
            <div className={styles.productList}>
                {sortedProducts.map((product, index) => (
                    <div
                        key={index}
                        className={styles.productItem}
                        onClick={() => {
                            console.log('넘길때 keyword:', keyword);

                            if (keyword) {
                                navigate(`/postDetails/${product.id}?keyword=${keyword}`);
                            } else if (city) {
                                navigate(`/postDetails/${product.id}?keyword=${city}`);
                            } else {
                                navigate(`/postDetails/${product.id}`);
                            }
                        }} // 상품 상세 페이지로 이동
                    >
                        <img
                            src={product.fileUrl || './images/travel.jpg'}
                            alt={product.title}
                            className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                            <h3 style={{ fontSize: '2.5rem' }}>[{product.city}][{product.day}] {product.title}</h3>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                                {/* 프로필 이미지 (디폴트 이미지 설정) */}
                                <img
                                    src={product.member.profile || defaultimg} // 디폴트 프로필 이미지
                                    alt="profile"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginRight: '10px'
                                    }}
                                />
                                {/* 이름 */}
                                <p style={{ margin: 0 }}>{product.member.name}</p>
                                {/* 칭호 */}
                                <Box className={styles.hashtags} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml:'20px' }}>
                                    {product.member.keywords && product.member.keywords.split('*').map((keyword, index)=>
                                        <Typography variant="body2" className={styles.hashtag} key={index}>#{keyword}</Typography>
                                    )}
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                <Box sx={{ marginRight: '10px' }}>
                                    {Array.isArray(product.reviews) ? `${product.reviews.length} 건의 리뷰` : '0 건의 리뷰'}
                                </Box>
                                <Rating
                                    name="half-rating-read"
                                    value={
                                        Array.isArray(product.reviews) && product.reviews.length > 0 
                                        ? product.reviews.reduce((acc, review) => acc + review.ratingScore, 0) / product.reviews.length 
                                        : 0 // reviews가 없을 경우 기본값 0
                                    }                                    precision={0.5}
                                    readOnly
                                    sx={{ marginRight: '10px' }}
                                />
                                <Box sx={{ marginRight: '10px', ml: 3 }}>
                                    AI 점수
                                </Box>
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
                            </Box>

                            <div className={styles.tags}>
                                {product.hashtag && product.hashtag.split('#').filter(Boolean).map((tag, index) => (
                                    <span key={index} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div ref={ref} className={styles.loadingIndicator}>
                {loading && (
                    <Box>
                        <Loading />
                    </Box>
                )}
                {products.length === 0 &&
                    <h3>검색 결과가 없습니다</h3>}
            </div>


        </div>
    );
};

export default ProductBoard;
