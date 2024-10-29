import React, { useContext, useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Card, CardMedia, CardContent, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import RegionEventInfo from './RegionEvent';
import GuideRankings from './GuideRanking';
import DetailedWeatherMap from './DetailedWeatherMap';
import styles from '../../styles/home/Home.module.css';
import { useFormik } from 'formik';


const Home = () => {
  const navigate = useNavigate();
  const [weatherSelectedRegion, setWeatherSelectedRegion] = useState(null);
  const [eventSelectedRegion, setEventSelectedRegion] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const cities = [
    { name: '부산', image: '/images/mainpage/1.png' },
    { name: '제주', image: '/images/mainpage/2.png' },
    { name: '서울', image: '/images/mainpage/3.png' },
    { name: '강릉', image: '/images/mainpage/4.png' },
    { name: '가평', image: '/images/mainpage/5.png' },
  ];

  useEffect(() => {
    cities.forEach(city => {
      const img = new Image();
      img.src = city.image;
    });
  }, []);

  const handleCityClick = (city) => {
    navigate(`/product?city=${city}`);
  };

  const formik = useFormik({
    initialValues: {
      keyword: '',
      days: '',
    },
    onSubmit: (values) => {
      navigate(`/product?keyword=${values.keyword}&days=${values.days}`);
    },
  });

  const handleEventRegionChange = (region) => {
    setEventSelectedRegion(region);
    setWeatherSelectedRegion(region);
  };

  const handleServiceCardClick = (path) => {
    navigate(path);
  };

  // scrollToTop 함수 구현
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleAiButtonClick = () => {
    navigate('/aipage');
    scrollToTop();
  };

  useEffect(() => {
    scrollToTop();
  }, []);


  return (
    <div>
      <div className={styles.headerimg}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 10, p: 3 }}>

          {/* 인기 여행지 */}
          <div>
            <Box sx={{
              background: '#ffffff',
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f1f1',
              mb: '45px',
              marginTop: '300px'
            }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h4" fontWeight="bold">인기 여행지</Typography>
                  <Button
                    variant="contained"
                    sx={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      backgroundColor: '#0066ff',
                      borderRadius: 2,
                      '&:hover': { backgroundColor: '#0056b3' }
                    }}
                    onClick={() => navigate('/product?keyword=')}
                  >
                    모두보기
                  </Button>
                </Box>
                <Grid container spacing={2}>
                  {cities.map((city, index) => (
                    <Grid item xs={6} sm={4} md={2.4} key={index}>
                      <Card
                        onClick={() => handleCityClick(city.name)}
                        sx={{
                          borderRadius: 3,
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease',
                          '&:hover': { transform: 'scale(1.05)' },
                          display: 'flex',
                          flexDirection: 'column',
                          height: { xs: '180px', sm: '200px', md: '220px' },
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            height: '70%',
                            objectFit: 'cover',
                          }}
                          image={city.image}
                          alt={city.name}
                        />
                        <CardContent sx={{
                          flexGrow: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '8px',
                        }}>
                          <Typography variant="subtitle2" align="center" fontWeight="bold">{city.name}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </div>

          {/* AI 소개 섹션 */}
          <Box className={styles.aiSection} sx={{
            position: 'relative',
            overflow: 'hidden',
            my: 4,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0066ff, #00ccff)',
            minHeight: isSmallScreen ? '200px' : '300px', // 최소 높이 설정
          }}>
            <div className={styles.waveContainer}>
              <svg className={styles.waves} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                <defs>
                  <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className={styles.parallax}>
                  <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(0,102,255,0.7)" />
                  <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(0,102,255,0.5)" />
                  <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(0,102,255,0.3)" />
                  <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(0,102,255,0.1)" />
                </g>
              </svg>
            </div>
            <Grid container spacing={2} alignItems="center" className={styles.aiContent}
              sx={{ position: 'relative', zIndex: 1, height: '100%', p: 3 }}>
              <Grid item xs={12} sm={4} md={3} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start', // 왼쪽 정렬
                height: '100%',
              }}>
                <Box className={styles.aiImageContainer} sx={{
                  width: '100%',
                  maxWidth: { xs: '120px', sm: '150px', md: '200px' }, // 반응형 크기
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '10px',
                }}>
                  <img
                    src="/images/aiRobot.png"
                    alt="AI Travel Planner"
                    className={styles.aiImage}
                    style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 0 10px rgba(0, 0, 0, 0.3))' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={8} md={9} sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
              }}>
                <Typography variant="h6" className={styles.aiTitle} sx={{
                  fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  mb: 2,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' }, // 작은 화면에서 숨김
                }}>
                  AI가 당신의 완벽한 가이드를 서포트합니다!
                </Typography>
                <Typography variant="body2" className={styles.aiDescription} sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                  mb: 3,
                  color: 'white',
                  display: { xs: 'none', sm: 'block' }, // 작은 화면에서 숨김
                }}>
                  우리의 AI는 당신의 가이드 능력에 맞는 최적의 서비스를 제공합니다.
                  재밌는 퀴즈, 실전 테스트! <br /> AI와 함께 특별한 경험을 체험하세요.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-end', sm: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    onClick={handleAiButtonClick}
                    className={styles.aiButton}
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      py: 1,
                      px: 3,
                      backgroundColor: 'white',
                      color: '#0066ff',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                    }}
                  >
                    AI 서비스 체험하기
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* 새로운 서비스 소개 섹션 */}
          <Box sx={{ my: 6 }}>
            <Grid container spacing={3}>
              {/* 채팅방 시스템 */}
              <Grid item xs={12} md={4}>
                <Card
                  className={styles.serviceCard}
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/chatting.png)`,
                    backgroundSize: '50%',
                    backgroundPosition: '90% ',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleServiceCardClick('/bigchat/:id')}
                >
                  <CardContent className={styles.serviceCardContent}>
                    <Typography variant="h6" className={styles.serviceTitle}>
                      실시간 채팅방
                    </Typography>
                    <Typography variant="body2" className={styles.serviceDescription}>
                      가이드와 실시간으로 소통하며 여행 계획을 세우세요. 언제 어디서나 빠른 응답을 받을 수 있습니다.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 이용 후기 */}
              <Grid item xs={12} md={4}>
                <Card
                  className={styles.serviceCard}
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/testimony.png)`,
                    backgroundSize: '50%',
                    backgroundPosition: '90% ',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleServiceCardClick('/userreview')}
                >
                  <CardContent className={styles.serviceCardContent}>
                    <Typography variant="h6" className={styles.serviceTitle}>
                      이용 후기
                    </Typography>
                    <Typography variant="body2" className={styles.serviceDescription}>
                      다른 고객님들의 생생한 경험을 확인하세요. 실제 이용 후기를 통해 최고의 여행을 계획하세요.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* 1대1 문의 */}
              <Grid item xs={12} md={4}>
                <Card
                  className={styles.serviceCard}
                  style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/images/inquiry.png)`,
                    backgroundSize: '50%',
                    backgroundPosition: '90% ',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleServiceCardClick('/mypage/askall')}
                >
                  <CardContent className={styles.serviceCardContent}>
                    <Typography variant="h6" className={styles.serviceTitle}>
                      1대1 문의
                    </Typography>
                    <Typography variant="body2" className={styles.serviceDescription}>
                      개인적인 문의사항이 있으신가요? 우리의 전문 상담원이 친절하게 답변해 드립니다.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* 정보 섹션 */}
          <Grid container spacing={5}>
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 2, borderRadius: 3,
                background: '#f9f9f9',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f1f1',
                height: { xs: '300px', md: '670px' }, // 반응형 높이 설정
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">지역 행사</Typography>
                  {eventSelectedRegion && (
                    <Button
                      variant="contained"
                      onClick={() => handleCityClick(eventSelectedRegion.name)}
                      sx={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        backgroundColor: '#0066ff',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#0056b3' }
                      }}
                    >
                      {`${eventSelectedRegion.name} - 추천 상품`}
                    </Button>
                  )}
                </Box>
                <RegionEventInfo
                  width="100%"
                  height="400px"
                  selectedRegion={eventSelectedRegion}
                  setSelectedRegion={handleEventRegionChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 3, borderRadius: 3,
                background: '#f9f9f9',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f1f1f1',
                height: { xs: '300px', md: '670px' }, // 반응형 높이 설정
              }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>가이드 순위</Typography>
                <GuideRankings />
              </Box>
            </Grid>
          </Grid>

          {/* 상세 날씨 정보 */}
          <Box sx={{
            background: '#ffffff',
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f1f1f1',
            mb: '45px',
            mt: '40px'
          }}>
            <Typography variant="h4" fontWeight="bold" mb={3}>기상 정보</Typography>
            <DetailedWeatherMap />
          </Box>
        </Box>
      </div>
    </div>
  );
};

export default Home;
