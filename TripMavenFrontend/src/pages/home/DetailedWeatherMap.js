import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Select, MenuItem, Typography, CircularProgress, Grid } from '@mui/material';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import moment from 'moment';

// GeoJSON 파일들을 import
import seoulGeo from '../../data/Seoul.geojson';
import busanGeo from '../../data/BuSan.geojson';
import daeguGeo from '../../data/DaeGu.geojson';
import incheonGeo from '../../data/InCheon.geojson';
import gwangjuGeo from '../../data/GwangJu.geojson';
import daejeonGeo from '../../data/DaeJeon.geojson';
import ulsanGeo from '../../data/UlSan.geojson';
import sejongGeo from '../../data/SeJong.geojson';
import gyeonggiGeo from '../../data/GyeongGi.geojson';
import gangwonGeo from '../../data/GangWon.geojson';
import chungbukGeo from '../../data/ChungBuk.geojson';
import chungnamGeo from '../../data/ChungNam.geojson';
import jeonbukGeo from '../../data/JeonBuk.geojson';
import jeonnamGeo from '../../data/JeonNam.geojson';
import gyeongbukGeo from '../../data/GyeongBuk.geojson';
import gyeongnamGeo from '../../data/GyeongNam.geojson';
import jejuGeo from '../../data/JeJu.geojson';
import Loading from '../../components/LoadingPage';

const API_KEY = '48c33cc2626bc56bc2e94df1221b05b1';

const cityNameMapping = {
  '서울특별시': 'Seoul,KR',
  '부산광역시': 'Busan,KR',
  '대구광역시': 'Daegu,KR',
  '인천광역시': 'Incheon,KR',
  '광주광역시': 'Gwangju,KR',
  '대전광역시': 'Daejeon,KR',
  '울산광역시': 'Ulsan,KR',
  '세종특별자치시': 'Sejong,KR',
  '경기도': 'Suwon,KR',
  '강원도': 'Chuncheon,KR',
  '충청북도': 'Cheongju,KR',
  '충청남도': 'Hongseong,KR',
  '전라북도': 'Jeonju,KR',
  '전라남도': 'Muan,KR',
  '경상북도': 'Andong,KR',
  '경상남도': 'Changwon,KR',
  '제주특별자치도': 'Jeju City,KR'
};

//서울 정보
const seoulDistricts = {
  '서울특별시 종로구': 'Jongno-gu,Seoul,KR',
  '서울특별시 중구': 'Jung-gu,Seoul,KR',
  '서울특별시 용산구': 'Yongsan-gu,Seoul,KR',
  '서울특별시 성동구': 'Seongdong-gu,Seoul,KR',
  '서울특별시 광진구': 'Gwangjin-gu,Seoul,KR',
  '서울특별시 동대문구': 'Dongdaemu-gu,Seoul,KR',
  '서울특별시 중랑구': 'Jungnang-gu,Seoul,KR',
  '서울특별시 성북구': 'Seongbuk-gu,Seoul,KR',
  '서울특별시 강북구': 'Gangbuk-gu,Seoul,KR',
  '서울특별시 도봉구': 'Dobong-gu,Seoul,KR',
  '서울특별시 노원구': 'Nowon-gu,Seoul,KR',
  '서울특별시 은평구': 'Eunpyeong-gu,Seoul,KR',
  '서울특별시 서대문구': 'Seodaemun-gu,Seoul,KR',
  '서울특별시 마포구': 'Mapo-gu,Seoul,KR',
  '서울특별시 양천구': 'Yangcheon-gu,Seoul,KR',
  '서울특별시 강서구': 'Gangseo-gu,Seoul,KR',
  '서울특별시 구로구': 'Guro-gu,Seoul,KR',
  '서울특별시 금천구': 'Geumcheon-gu,Seoul,KR',
  '서울특별시 영등포구': 'Yeongdeungpo-gu,Seoul,KR',
  '서울특별시 동작구': 'Dongjak-gu,Seoul,KR',
  '서울특별시 관악구': 'Gwanak-gu,Seoul,KR',
  '서울특별시 서초구': 'Seocho-gu,Seoul,KR',
  '서울특별시 강남구': 'Gangnam-gu,Seoul,KR',
  '서울특별시 송파구': 'Songpa-gu,Seoul,KR',
  '서울특별시 강동구': 'Gangdong-gu,Seoul,KR'
};

//부산 정보
const busanDistricts = {
  '부산광역시 중구': 'Jung District,KR',
  '부산광역시 서구': 'Seo District,KR',
  '부산광역시 동구': 'Dong District,KR',
  '부산광역시 영도구': 'Yeongdo District,KR',
  '부산광역시 부산진구': 'Busanjin District,KR',
  '부산광역시 동래구': 'Dongnae District,KR',
  '부산광역시 남구': 'Nam District,KR',
  '부산광역시 북구': 'Buk District,KR',
  '부산광역시 해운대구': 'Haeundae District,KR',
  '부산광역시 사하구': 'Saha District,KR',
  '부산광역시 금정구': 'Geumjeong District,KR',
  '부산광역시 강서구': 'Gangseo District,KR',
  '부산광역시 연제구': 'Yeonje District,KR',
  '부산광역시 수영구': 'Suyeong District,KR',
  '부산광역시 사상구': 'Sasang District,KR',
  '부산광역시 기장군': 'Gijang,KR'
};

//강원 정보
const gangwonDistricts = {
  '강원특별자치도 춘천시': 'Chuncheon, KR',
  '강원특별자치도 원주시': 'Wonju, KR',
  '강원특별자치도 강릉시': 'Gangneung, KR',
  '강원특별자치도 동해시': 'Wonju, KR',
  '강원특별자치도 태백시': "T'aebaek, KR",
  '강원특별자치도 속초시': 'Sokcho, KR',
  '강원특별자치도 삼척시': 'Wonju, KR',
  '강원특별자치도 홍천군': 'Hongcheon-gun, KR',
  '강원특별자치도 횡성군': 'Hoengseong-gun, KR',
  '강원특별자치도 영월군': 'Yeongwol-gun, KR',
  '강원특별자치도 평창군': 'Pyeongchang-gun, KR',
  '강원특별자치도 정선군': 'Jeongseon-gun, KR',
  '강원특별자치도 철원군': 'Cheorwon-gun, KR',
  '강원특별자치도 화천군': 'Hwacheon-gun, KR',
  '강원특별자치도 양구군': 'Yanggu-gun, KR',
  '강원특별자치도 인제군': 'Inje-gun, KR',
  '강원특별자치도 고성군': 'Goseong-gun, KR',
  '강원특별자치도 양양군': 'Yangyang-gun, KR'
};

//인천 정보
const incheonDistricts = {
  '인천광역시 중구': 'Jung-gu, KR',
  '인천광역시 동구': 'Dong-gu, KR',
  '인천광역시 미추홀구': 'Nam-gu,KR',
  '인천광역시 연수구': 'Yeonsu-gu,KR',
  '인천광역시 남동구': 'Namdong-gu,KR',
  '인천광역시 부평구': 'Bupyeong-gu,KR',
  '인천광역시 계양구': 'Gyeyang-gu,KR',
  '인천광역시 서구': 'Seo-gu,KR',
  '인천광역시 강화군': 'Ganghwa-gun,KR',
  '인천광역시 옹진군': 'Ongjin, KP'
};

//광주 정보
const gwangjuDistricts = {
  '광주광역시 동구': 'Gwangju, KR',
  '광주광역시 서구': 'Jeonju, KR',
  '광주광역시 남구': 'Gwangju, KR',
  '광주광역시 북구': 'Jeonju, KR',
  '광주광역시 광산구': 'Gwangju, KR'
};

//대구 정보
const daeguDistricts = {
  '대구광역시 중구': 'Jung-gu, KR',
  '대구광역시 동구': 'Dong District, KR',
  '대구광역시 서구': 'Seo District, KR',
  '대구광역시 남구': 'namgu, KR',
  '대구광역시 북구': 'Buk District, KR',
  '대구광역시 수성구': 'Daegu, KR',
  '대구광역시 달서구': 'Daegu, KR',
  '대구광역시 달성군': 'Daegu, KR',
  '대구광역시 군위군': 'Gunwi, KR'
};

//대전 정보
const daejeonDistricts = {
  '대전광역시 동구': 'Daejeon, KR',
  '대전광역시 중구': 'Jung-gu, KR',
  '대전광역시 서구': 'Daejeon, KR',
  '대전광역시 유성구': 'Seo-gu, KR',
  '대전광역시 대덕구': 'Daejeon, KR'
};

//울산 정보
const ulsanDistricts = {
  '울산광역시 중구': 'Ulsan, KR',
  '울산광역시 남구': 'Ulsan, KR',
  '울산광역시 동구': 'Ulsan, KR',
  '울산광역시 북구': 'Ulsan, KR',
  '울산광역시 울주군': 'Ulju, KR'
};

//세종 정보
const sejongDistricts = {
  '세종특별자치시': 'Sejong, KR'
};

//경기 정보
const gyeonggiDistricts = {
  '경기도 수원시 장안구': 'Jangan-gu, KR',
  '경기도 수원시 권선구': 'Gwonseon-gu, Suwon-si, KR',
  '경기도 수원시 팔달구': 'Paldal-gu, KR',
  '경기도 수원시 영통구': 'Yeongtong-gu, KR',
  '경기도 성남시 수정구': 'Sujeong-gu, KR',
  '경기도 성남시 중원구': 'Jungwon-gu, KR',
  '경기도 성남시 분당구': 'Bundang-gu, KR',  
  '경기도 고양시 덕양구': 'Deogyang-gu, KR',
  '경기도 고양시 일산동구': 'Ilsandong-gu, KR',
  '경기도 고양시 일산서구': 'Ilsanseo-gu, KR',
  '경기도 용인시 처인구': 'Cheoin-gu, KR',
  '경기도 용인시 기흥구': 'Giheung-gu, KR',
  '경기도 용인시 수지구': 'Suji-gu, KR',
  '경기도 부천시': 'Bucheon-si, KR',
  '경기도 안산시 상록구': 'Sangnok-gu, KR',
  '경기도 안산시 단원구': 'Danwon-gu, KR',
  '경기도 안양시 만안구': 'Manan-gu, KR',
  '경기도 안양시 동안구': 'Dongan-gu, KR',
  '경기도 남양주시': 'Namyangju, KR',
  '경기도 화성시': 'Hwaseong-si, KR',
  '경기도 평택시': 'Pyeongtaek, KR',
  '경기도 의정부시': 'Uijeongbu-si, KR',
  '경기도 시흥시': 'Yongin, KR',
  '경기도 파주시': 'Paju, KR',
  '경기도 김포시': 'Gimpo-si, KR',
  '경기도 광명시': 'Gwangmyeong-si, KR',
  '경기도 광주시': 'Gwangju, KR',
  '경기도 군포시': 'Gunpo, KR',
  '경기도 오산시': 'Osan, KR',
  '경기도 하남시': 'Hanam, KR',
  '경기도 이천시': 'Icheon-si, KR',
  '경기도 양주시': 'Yangju-si, KR',
  '경기도 구리시': 'Guri-si, KR',
  '경기도 안성시': 'Anseong, KR',
  '경기도 포천시': 'Pocheon-si, KR',
  '경기도 의왕시': 'Uiwang, KR',
  '경기도 여주시': 'Yeoju, KR',
  '경기도 동두천시': 'Dongducheon-si, KR',
  '경기도 과천시': 'Gwacheon, KR',
  '경기도 가평군': 'Gapyeong, KR',
  '경기도 양평군': 'Yangpyeong-gun, KR',
  '경기도 연천군': 'Yeoncheon-gun, KR'
};

//충북 정보
const chungbukDistricts = {
  '충청북도 청주시 상당구': 'Sangdang-gu, KR',
  '충청북도 청주시 서원구': 'Seowon-gu, KR',
  '충청북도 청주시 흥덕구': 'Heungdeok-gu, KR',
  '충청북도 청주시 청원구': 'Cheongwon-gu, KR',
  '충청북도 충주시': 'Chungju, KR',
  '충청북도 제천시': 'Teisen, KR',
  '충청북도 보은군': 'Chungju, KR',
  '충청북도 옥천군': 'Okcheon, KR',
  '충청북도 영동군': 'Yeongdong, KR',
  '충청북도 진천군': 'Cheongju-si, KR',
  '충청북도 괴산군': 'Teisen, KR',
  '충청북도 음성군': 'Okcheon, KR',
  '충청북도 단양군': 'Chungju, KR',
  '충청북도 증평군': 'Cheongju-si, KR'
};

//충남 정보 - 변환한 geojson이 너무커서 느려짐 방법 찾는중
const chungnamDistricts = {

};

//전북 정보
const jeonbukDistricts = {
  '전북특별자치도 전주시 덕진구': 'Jeonju, KR',
  '전북특별자치도 전주시 완산구': 'Jeonju, KR',
  '전북특별자치도 군산시': 'Gunsan, KR',
  '전북특별자치도 익산시': 'Iksan, KR',
  '전북특별자치도 정읍시': 'Gunsan, KR',
  '전북특별자치도 남원시': 'Namwon, KR',
  '전북특별자치도 김제시': 'Gimje, KR',
  '전북특별자치도 완주군': 'Wanju, KR',
  '전북특별자치도 진안군': 'Jinan-gun, KR',
  '전북특별자치도 무주군': 'Muju, KR',
  '전북특별자치도 장수군': 'Jangsu, KR',
  '전북특별자치도 임실군': 'Imsil, KR',
  '전북특별자치도 순창군': 'Sunchang, KR',
  '전북특별자치도 고창군': 'Gochang, KR',
  '전북특별자치도 부안군': 'Buan-gun, KR'
};

//전남 정보 - 변환한 geojson이 너무커서 느려짐 방법 찾는중 2
const jeonnamDistricts = {

};

//경북 정보
const gyeongbukDistricts = {
  '경상북도 포항시 남구': 'Pohang, KR',
  '경상북도 포항시 북구': 'Pohang, KR',
  '경상북도 경주시': 'Gyeongju, KR',
  '경상북도 김천시': 'Gimcheon, KR',
  '경상북도 안동시': 'Andong, KR',
  '경상북도 구미시': 'Gumi, KR',
  '경상북도 영주시': 'Yeongju-si, KR',
  '경상북도 영천시': 'Yeongju-si, KR',
  '경상북도 상주시': 'Sangju, KR',
  '경상북도 문경시': 'Mungyeong, KR',
  '경상북도 경산시': 'Gyeongsan, KR',
  '경상북도 군위군': 'Gunwi, KR',
  '경상북도 의성군': 'Uiseong, KR',
  '경상북도 청송군': 'Cheongsong, KR',
  '경상북도 영양군': 'Yeongyang, KR',
  '경상북도 영덕군': 'Cheongsong, KR',
  '경상북도 청도군': 'Cheongdo, KR',
  '경상북도 고령군': 'Goryeong, KR',
  '경상북도 성주군': 'Seongju, KR',
  '경상북도 칠곡군': 'Waegwan, KR',
  '경상북도 예천군': 'Yecheon, KR',
  '경상북도 봉화군': 'Bonghwa, KR',
  '경상북도 울진군': 'Seongju, KR',
  '경상북도 울릉군': 'Goryeong, KR'
};

//경남 정보
const gyeongnamDistricts = {
  '경상남도 창원시 의창구': 'Changwon, KR',
  '경상남도 창원시 성산구': 'Changwon, KR',
  '경상남도 창원시 마산합포구': 'Masan, KR',
  '경상남도 창원시 마산회원구': 'Changwon, KR',
  '경상남도 창원시 진해구': 'Changwon, KR',
  '경상남도 진주시': 'Chinju, KR',
  '경상남도 통영시': 'Tongyeong-si, KR',
  '경상남도 사천시': 'Sacheon, KR',
  '경상남도 김해시': 'Kimhae, KR',
  '경상남도 밀양시': 'Miryang, KR',
  '경상남도 거제시': 'Sacheon, KR',
  '경상남도 양산시': 'Yangsan, KR',
  '경상남도 의령군': 'Uiryeong, KR',
  '경상남도 함안군': 'Haman, KR',
  '경상남도 창녕군': 'Changnyeong, KR',
  '경상남도 고성군': 'Goseong, KR',
  '경상남도 남해군': 'Namhae, KR',
  '경상남도 하동군': 'Hadong-eup Samuso, KR',
  '경상남도 산청군': 'Goseong, KR',
  '경상남도 함양군': 'Hamyang, KR',
  '경상남도 거창군': 'Haman, KR',
  '경상남도 합천군': 'Hapcheon, KR'
};

//제주 정보
const jejuDistricts ={
  '제주도 제주시': 'Jeju City, KR',
  '제주도 서귀포시': 'Jeju City, KR'
};

const regionSettings = {
  '서울특별시': { scale: 49000, center: [126.9895, 37.5651], geoData: seoulGeo },
  '부산광역시': { scale: 36000, center: [129.0756, 35.1996], geoData: busanGeo },
  '대구광역시': { scale: 18000, center: [128.6014, 35.9954], geoData: daeguGeo },
  '인천광역시': { scale: 20000, center: [126.5232, 37.4963], geoData: incheonGeo },
  '광주광역시': { scale: 55000, center: [126.8516, 35.1601], geoData: gwangjuGeo },
  '대전광역시': { scale: 45000, center: [127.3845, 36.3504], geoData: daejeonGeo },
  '울산광역시': { scale: 31000, center: [129.2514, 35.5584], geoData: ulsanGeo },
  '세종특별자치시': { scale: 40000, center: [127.2894, 36.5700], geoData: sejongGeo },
  '경기도': { scale: 10000, center: [127.0096, 37.6150], geoData: gyeonggiGeo },
  '강원도': { scale: 8000, center: [128.2000, 37.8000], geoData: gangwonGeo },
  '충청북도': { scale: 10000, center: [127.9000, 36.7000], geoData: chungbukGeo },
  '충청남도': { scale: 12000, center: [126.8000, 36.5500], geoData: chungnamGeo },
  '전라북도': { scale: 12000, center: [127.1500, 35.7200], geoData: jeonbukGeo },
  '전라남도': { scale: 7500, center: [126.7500, 34.7600], geoData: jeonnamGeo },
  '경상북도': { scale: 8000, center: [128.7000, 36.4000], geoData: gyeongbukGeo },
  '경상남도': { scale: 9000, center: [128.2500, 35.2600], geoData: gyeongnamGeo },
  '제주특별자치도': { scale: 25000, center: [126.5500, 33.4190], geoData: jejuGeo }
};

const allDistricts = {
  '서울특별시': seoulDistricts,
  '부산광역시': busanDistricts,
  '대구광역시': daeguDistricts,
  '인천광역시': incheonDistricts,
  '광주광역시': gwangjuDistricts,
  '대전광역시': daejeonDistricts,
  '울산광역시': ulsanDistricts,
  '세종특별자치시': sejongDistricts,
  '경기도': gyeonggiDistricts,
  '강원도': gangwonDistricts,
  '충청북도': chungbukDistricts,
  '충청남도': chungnamDistricts,
  '전라북도': jeonbukDistricts,
  '전라남도': jeonnamDistricts,
  '경상북도': gyeongbukDistricts,
  '경상남도': gyeongnamDistricts,
  '제주특별자치도': jejuDistricts
};

const getWeatherIcon = (iconCode) => {
  return `http://openweathermap.org/img/wn/${iconCode}.png`;
};

const DetailedWeatherMap = ({ selectedRegion: externalSelectedRegion }) => {
  const [selectedRegion, setSelectedRegion] = useState(externalSelectedRegion || '부산광역시');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clickedDistrict, setClickedDistrict] = useState(null);

  useEffect(() => {
    if (externalSelectedRegion) {
      setSelectedRegion(externalSelectedRegion);
    }
  }, [externalSelectedRegion]);

  useEffect(() => {
    if (selectedRegion) {
      const regionName = cityNameMapping[selectedRegion] || selectedRegion;
      fetchWeatherData(regionName);
    }
  }, [selectedRegion]);

  const fetchWeatherData = async (locationName) => {
    setLoading(true);
    setError(null);
    try {
      const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${API_KEY}&units=metric`);
      setCurrentWeather(currentWeatherResponse.data);

      const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&appid=${API_KEY}&units=metric`);
      const formattedForecast = forecastResponse.data.list.map(item => ({
        time: moment(item.dt * 1000).format('MM-DD HH:mm'),
        temp: item.main.temp,
        description: item.weather[0].description,
        pop: item.pop * 100,
        weatherIcon: item.weather[0].icon
      }));
      setForecast(formattedForecast.slice(0, 32));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('날씨 데이터를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (event) => {
    const newRegion = event.target.value;
    setSelectedRegion(newRegion);
    setCurrentWeather(null);
    setForecast([]);
    setClickedDistrict(null);
  };

  const handleDistrictClick = useCallback((geo) => {
    const districtName = geo.properties.SGG_NM;
    setClickedDistrict(districtName);
    
    const regionDistricts = allDistricts[selectedRegion];
    if (regionDistricts && regionDistricts[districtName]) {
      fetchWeatherData(regionDistricts[districtName]);
    } else {
      console.log(`No weather data available for ${districtName} in ${selectedRegion}`);
      setError(`${districtName}의 날씨 데이터를 불러올 수 없습니다.`);
    }
  }, [selectedRegion]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: 'white', padding: 1, border: '1px solid #ccc' }}>
          <Typography variant="body2">{`시간: ${label}`}</Typography>
          <Typography variant="body2">{`온도: ${payload[0].value}°C`}</Typography>
          <Typography variant="body2">{`강수확률: ${payload[1].value.toFixed(1)}%`}</Typography>
          <Typography variant="body2">{`날씨: ${payload[0].payload.description}`}</Typography>
          <img src={getWeatherIcon(payload[0].payload.weatherIcon)} alt="Weather icon" />
        </Box>
      );
    }
    return null;
  };

  const memoizedGeoData = useMemo(() => {
    if (selectedRegion && regionSettings[selectedRegion]) {
      return regionSettings[selectedRegion].geoData;
    }
    return null;
  }, [selectedRegion]);

  if (!memoizedGeoData) {
    return <Loading />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, margin: 'auto', padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            fullWidth
            size="small"
            defaultValue="부산광역시"
          >
            {Object.keys(cityNameMapping).map((region) => (
              <MenuItem key={region} value={region}>{region}</MenuItem>
            ))}
          </Select>

          {selectedRegion && regionSettings[selectedRegion] && (
            <Box sx={{ marginTop: 2, height: 300, border: '1px solid #ccc', overflow: 'hidden' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: regionSettings[selectedRegion].scale,
                  center: regionSettings[selectedRegion].center,
                }}
                width={400}
                height={300}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              >
                <Geographies geography={memoizedGeoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={clickedDistrict === geo.properties.SGG_NM ? "#afe859" : "#66ccff"}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#afe859" },
                          pressed: { outline: "none" },
                        }}
                        onClick={() => handleDistrictClick(geo)}
                      />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            </Box>
          )}

          {clickedDistrict && (
            <Typography variant="body2" sx={{ mt: 1 }}/>
          )}

          {loading}
          {error && <Typography color="error" variant="body2">{error}</Typography>}

          {currentWeather && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="subtitle1">선택된 지역: {clickedDistrict || selectedRegion}</Typography>
              <Box display="flex" alignItems="center">
                <img src={getWeatherIcon(currentWeather.weather[0].icon)} alt="Weather icon" 
                style={{ width: '60px', height: '60px', backgroundColor:'lightgray'}}/>
                <Box ml={1}>
                  <Typography variant="body2">온도: {currentWeather.main.temp}°C</Typography>
                  <Typography variant="body2">날씨: {currentWeather.weather[0].description}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          {forecast.length > 0 && (
            <Box sx={{ height: 400 }}>
              <Typography variant="subtitle1" gutterBottom>4일간 기상 예보</Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecast}>
                  <XAxis
                    dataKey="time" 
                    angle={0}
                    textAnchor="end"
                    height={70}
                    interval={5}
                    allowDataOverflow={false}
                    allowDecimals={true}
                    allowDuplicatedCategory={true}
                  />
                  <YAxis 
                    yAxisId="left"
                    orientation="left"
                    domain={['auto', 'auto']}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    domain={[0, 100]}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#8884d8" name="온도 (°C)" />
                  <Line yAxisId="right" type="monotone" dataKey="pop" stroke="#82ca9d" name="강수확률 (%)" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetailedWeatherMap;
