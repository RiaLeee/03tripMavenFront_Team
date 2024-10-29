import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import axios from 'axios';

const geoUrl = 'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2018/json/skorea-provinces-2018-geo.json';
const regionNameMap = {
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

const API_KEY = '48c33cc2626bc56bc2e94df1221b05b1';

const changeRegionName = {
  '서울':'서울특별시',
  '인천':'인천광역시',
  '대전':'대전광역시',
  '대구':'대구광역시',
  '광주':'광주광역시',
  '부산':'부산광역시',
  '울산':'울산광역시',
  '세종특별자치시':'세종특별자치시',
  '경기도':'경기도',
  '강원특별자치도':'강원도',
  '충청북도':'충청북도',
  '충청남도':'충청남도',
  '경상북도':'경상북도',
  '경상남도':'경상남도',
  '전북특별자치도':'전라북도',
  '전라남도':'전라남도',
  '제주도':'제주특별자치도'
}

const KoreaWeatherMap = ({ selectedRegion, setSelectedRegion }) => {
  const [weatherData, setWeatherData] = useState({});
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const promises = Object.entries(regionNameMap).map(([koreanName, englishName]) =>
          axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${englishName}&appid=${API_KEY}&units=metric`)
        );
        const responses = await Promise.all(promises);
        const newWeatherData = {};
        responses.forEach((response, index) => {
          const koreanName = Object.keys(regionNameMap)[index];
          const { main, weather } = response.data;
          newWeatherData[koreanName] = {
            city: koreanName,
            temperature: main.temp,
            summary: weather[0].description,
            icon: weather[0].icon
          };
        });
        setWeatherData(newWeatherData);
        setError(null);
      } catch (err) {
        setError('날씨 정보를 가져오는데 실패했습니다: ' + err.message);
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  useEffect(()=>{
    //console.log(selectedRegion);
    selectedRegion && setHoveredRegion(weatherData[changeRegionName[selectedRegion.name]]); 
  },[selectedRegion])

  const getRegionWeather = (geo) => {
    const mapRegionName = geo.properties.name;
    const weather = weatherData[mapRegionName];
    return weather || { city: mapRegionName, error: '날씨 정보 없음' };
  };

  if (loading) return <div>날씨 정보를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ width: '100%', height: '350px', display: 'flex' }}>
      <div style={{ width: '75%', height: '110%' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 6500,
            center: [128, 35.8]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map(geo => {
                const weather = getRegionWeather(geo);
                //console.log(selectedRegion);
                //console.log(hoveredRegion);
                const isSelected = geo.properties.name === (hoveredRegion ? hoveredRegion.city : selectedRegion && changeRegionName[selectedRegion.name]);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? '#FFA500' : weather.error ? '#F5F4F6' : '#1E88E5'}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: '#FFA500' },
                      pressed: { outline: 'none' },
                    }}
                    /*
                    onMouseEnter={() => {
                      setHoveredRegion(weather);
                    }}
                    onMouseLeave={() => {
                      setHoveredRegion(null);
                    }}
                    */
                    onClick={(e)=>{
                      setHoveredRegion(weather);
                      //e.target.classList.toggle();
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div style={{ width: '25%', padding: '5px', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>날씨</h3>
        {(hoveredRegion || (selectedRegion && weatherData[changeRegionName[selectedRegion.name]])) ? (
          <div>
            <h5 style={{ margin: '0 0 5px 0' }}>
              {hoveredRegion && hoveredRegion.city?hoveredRegion.city:changeRegionName[selectedRegion.name] }
            </h5>
            {hoveredRegion?.error ? (
              <p>{hoveredRegion.error}</p>
            ) : (
              <>
              <br/>
                <p style={{ margin: '0 0 5px 0' }}>
                  온도<br/> {(hoveredRegion || (selectedRegion && weatherData[changeRegionName[selectedRegion.name]]))?.temperature ?? '정보 없음'}°C
                </p>
                <br/>
                <p style={{ margin: '0 0 5px 0' }}>
                  날씨<br/>{(hoveredRegion || (selectedRegion && weatherData[changeRegionName[selectedRegion.name]]))?.summary ?? '정보 없음'}
                </p>
                
                {(hoveredRegion || (selectedRegion && weatherData[changeRegionName[selectedRegion.name]]))?.icon && (
                  <img 
                    src={`http://openweathermap.org/img/wn/${(hoveredRegion || (selectedRegion && weatherData[changeRegionName[selectedRegion.name]])).icon}@2x.png`} 
                    alt="weather icon"
                    style={{ width: '70px', height: '70px', backgroundColor:'lightgray'}}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <p>지역을 선택하세요</p>
        )}
      </div>
    </div>
  );
};

export default KoreaWeatherMap;
