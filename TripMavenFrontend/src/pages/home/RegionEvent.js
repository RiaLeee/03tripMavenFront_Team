import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import dummyImg from '../../images/dummyImg.png';
import styles from '../../styles/home/RegionEvent.module.css';
import { TemplateContext } from '../../context/TemplateContext';
import Loading from '../../components/LoadingPage';

const API_KEY = 'fxK0NInA37%2B5%2FUmqb3ZtIqKfeJDzlDS9iU9A25kDySbSG2wyyzESFN8pUjf1G3sBAqnKnI0ZkDOCaNC8PDJTxg%3D%3D';
const BASE_URL = 'https://apis.data.go.kr/B551011/KorService1';

const changeRegionKorName = {
	  "seoul":'서울', 
	  "incheon":'인천', 
	  "daejeon":'대전', 
	  "daegu":'대구', 
	  "gwangju":'광주',
	  "busan":'부산', 
	  "ulsan":'울산', 
	  "sejong":'세종특별자치시', 
	  "gyeonggi":'경기도',
	  "gangwon":'강원특별자치도', 
	  "chungbuk":'충청북도', 
	  "chungnam":'충청남도',
	  "gyeongbuk":'경상북도', 
	  "gyeongnam":'경상남도', 
	  "jeonbuk":'전북특별자치도',
	  "jeonnam":'전라남도', 
	  "jeju":'제주도'
}

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '20px', borderRadius: '8px',
        width: '90%', maxWidth: '700px', height: '90%', maxHeight: '750px',
        overflow: 'auto', position: 'relative', display: 'flex', flexDirection: 'column'
      }}>
        <button onClick={onClose} style={{ 
          position: 'absolute', top: '10px', right: '10px',
          background: 'none', border: 'none', cursor: 'pointer'
        }}>
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

const extractUrl = (htmlString) => {
  const match = htmlString.match(/href="([^"]*)/);
  return match ? match[1] : null;
};

const RegionEventInfo = ({ width = "100%", height = "400px", setSelectedRegion, selectedRegion }) => {
  const [regions, setRegions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [eventDetails, setEventDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState('next');
  const { memberInfo } = useContext(TemplateContext);
  const selectbox = useRef(null);

  useEffect(() => {
    const mountFunc = async () => {
      await fetchRegions();
	  //console.log(memberInfo);
      const changedRegionName = changeRegionKorName[memberInfo.interCity] //회원 관심지역 한글 이름
      const select = selectbox.current;
      if (select && changedRegionName) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].innerText == changedRegionName) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      else if(changedRegionName === undefined){  //관심지역 없거나, 로그인 안됐을때 부산으로 (나중에 인기 관광지 있으면 거기로)
        select.selectedIndex = 5; // 부산
      }
    };
    mountFunc();
  }, [memberInfo]);

  useEffect(() => {
    const changedRegionName = changeRegionKorName[memberInfo.interCity]
    if(changedRegionName === undefined){
      const selectedRegionObject = regions.find(region => region.name === '부산');
      if (selectedRegionObject && setSelectedRegion) {setSelectedRegion(selectedRegionObject);}
    }
    else {
      const selectedRegionObject = regions.find(region => region.name === changedRegionName);
      if (selectedRegionObject && setSelectedRegion) {setSelectedRegion(selectedRegionObject);}
    }
  }, [regions]);

  useEffect(() => {
    if (selectedRegion) {
      fetchEvents(selectedRegion.code);
    } else {
      setEvents([]);
    }
  }, [selectedRegion]);

  const formatDate = (dateString) => {
    if (!dateString || dateString.length !== 8) return dateString;
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}.${month}.${day}`;
  };

  const fetchRegions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/areaCode1`, {
        params: {
          serviceKey: decodeURIComponent(API_KEY),
          numOfRows: 20, pageNo: 1, MobileOS: 'ETC', MobileApp: 'TestApp', _type: 'json'
        },
        headers: { 'Accept': 'application/json' }
      });  
      const { response: apiResponse } = response.data;
      if (apiResponse && apiResponse.header.resultCode === "0000") {
        const regions_ = apiResponse.body.items.item;
        setRegions(regions_);
      }
      else {throw new Error(apiResponse?.header?.resultMsg || '알 수 없는 API 오류');}
    }
    catch (error) {setError('지역 정보를 불러오는데 실패했습니다: ' + error.message);}
  };

  const fetchEvents = async (areaCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/searchFestival1`, {
        params: {
          serviceKey: decodeURIComponent(API_KEY),
          numOfRows: 10, pageNo: 1, MobileOS: 'ETC', MobileApp: 'AppTest',
          arrange: 'A', listYN: 'Y', areaCode: areaCode, eventStartDate: '20240926', _type: 'json'
        },
        headers: { 'Accept': 'application/json' }
      });
  
      const { response: apiResponse } = response.data;
  
      if (apiResponse && apiResponse.header.resultCode === "0000") {
        const items = apiResponse.body.items.item;
        const fetchedEvents = Array.isArray(items) ? items : items ? [items] : [];
        setEvents(fetchedEvents);
        setCurrentEventIndex(0);
      } else {
        throw new Error(apiResponse?.header?.resultMsg || '알 수 없는 API 오류');
      }
    } catch (error) {
      console.error('행사 정보 로딩 실패:', error);
      setError('행사 정보를 불러오는데 실패했습니다: ' + (error.response?.data?.response?.header?.resultMsg || error.message));
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEventDetails = async (contentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/detailCommon1`, {
        params: {
          serviceKey: decodeURIComponent(API_KEY),
          contentId: contentId, MobileOS: 'ETC', MobileApp: 'TestApp',
          defaultYN: 'Y', firstImageYN: 'Y', areacodeYN: 'Y', catcodeYN: 'Y',
          addrinfoYN: 'Y', mapinfoYN: 'Y', overviewYN: 'Y', _type: 'json'
        },
        headers: { 'Accept': 'application/json' }
      });

      const { response: apiResponse } = response.data;

      if (apiResponse && apiResponse.header.resultCode === "0000") {
        const details = apiResponse.body.items.item[0];
        setEventDetails(details);
        setIsModalOpen(true);
      } else {
        throw new Error(apiResponse?.header?.resultMsg || '알 수 없는 API 오류');
      }
    } catch (error) {
      console.error('이벤트 상세 정보 로딩 실패:', error);
      setError('이벤트 상세 정보를 불러오는데 실패했습니다: ' + error.message);
    }
  };

  const handleRegionChange = (e) => {
    const selectedCode = e.target.value;
    const selectedRegionObject = regions.find(region => region.code === selectedCode);
    if (selectedRegionObject && setSelectedRegion) {
      setSelectedRegion(selectedRegionObject);
    }
  };

  const handlePrevEvent = () => {
    setSlideDirection('prev');
    setCurrentEventIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : events.length - 1
    );
  };

  const handleNextEvent = () => {
    setSlideDirection('next');
    setCurrentEventIndex((prevIndex) => 
      prevIndex < events.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleEventClick = () => {
    if (events[currentEventIndex]) {
      fetchEventDetails(events[currentEventIndex].contentid);
    }
  };

  return (
    <div style={{ width, height, overflow: 'hidden' }}>
	  {/*
      .searchInput {
        flex: 1;
        padding-left: 20px;
        border: 1px solid #ccc;
        width: 100%;
        height: 35px;
        border-radius: 8px;
      }
      */}
	  
      <select 
        ref={selectbox}
        value={selectedRegion ? selectedRegion.code : ''} 
        onChange={handleRegionChange}
        className={styles.selectBox}
      >
        <option value="">지역을 선택하세요</option>
        {regions.map((region) => (
          <option key={region.code} value={region.code}>
            {region.name}
          </option>
        ))}
      </select>
  
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 40px)' }}>
          <Loading />
        </Box>
      )}
  
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && events.length > 0 && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          height: 'calc(100% - 40px)',
          overflow: 'hidden'
        }}>
          <button onClick={handlePrevEvent} style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>
            <ChevronLeft size={24} />
          </button>
          <div style={{ 
            width: 'calc(100% - 60px)', 
            height: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {events.map((event, index) => {
              let position = index - currentEventIndex;
              if (slideDirection === 'prev') {
                if (position === -1) position = events.length - 1;
                else if (position === events.length - 1) position = -1;
              }
              return (
                <div
                  key={event.contentid}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${position * 100}%`,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    opacity: position === 0 ? 1 : 0,
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: '250px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <img 
                      src={event.firstimage || dummyImg}
                      alt={event.title}
                      style={{ 
                        maxWidth: '90%', 
                        maxHeight: '90%', 
                        objectFit: 'contain',
                        marginBottom: '10px',
                        cursor: 'pointer'
                      }}
                      onClick={handleEventClick}
                    />
                  </div>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{event.title}</h3>
                  <p style={{ margin: '0 0 3px 0', fontSize: '16px' }}>
                    기간: {formatDate(event.eventstartdate)} ~ {formatDate(event.eventenddate)}
                  </p>
                  <p style={{ margin: '0', fontSize: '16px' }}>장소: {event.addr1}</p>
                </div>
              );
            })}
          </div>
          <button onClick={handleNextEvent} style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {!loading && !error && selectedRegion && events.length === 0 && (
        <p>선택한 지역의 행사 정보가 없습니다.</p>
      )}

      {!loading && !error && !selectedRegion && (
        <p>지역을 선택하면 행사 정보가 표시됩니다.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {eventDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2 style={{ marginTop: '0', marginBottom: '10px' }}>{eventDetails.title}</h2>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <img
                src={eventDetails.firstimage || dummyImg}
                alt={eventDetails.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  marginBottom: '20px'
                }}
              />
              <div style={{ textAlign: 'left' }}>
                <p><strong>주소:</strong> {eventDetails.addr1} {eventDetails.addr2}</p>
                <p><strong>전화번호:</strong> {eventDetails.tel || '정보 없음'}</p>
                <p><strong>개요:</strong> {eventDetails.overview}</p>
                {eventDetails.homepage && (
                  <p>
                    <strong>홈페이지:</strong>{' '}
                    <a 
                      href={extractUrl(eventDetails.homepage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "#0066ff" }}
                    >
                      {extractUrl(eventDetails.homepage)}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegionEventInfo;
