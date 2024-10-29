import React, { useEffect, useRef } from 'react';
import markerImageSrc from '../images/mapMark.png'; // Adjust the path as necessary

const KakaoMap = ({ address, latitude = 37.5665, longitude = 126.9780, mapContainerId = 'map', level = 3  }) => {
  const roadviewContainerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder();

        const initializeMap = (lat, lng) => {
          const container = document.getElementById(mapContainerId);
          const options = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: level,
          };
          const map = new window.kakao.maps.Map(container, options);

          // Add roadview overlay to the map
          map.addOverlayMapTypeId(window.kakao.maps.MapTypeId.ROADVIEW);

          // Initialize Roadview
          const roadviewContainer = roadviewContainerRef.current;
          const roadview = new window.kakao.maps.Roadview(roadviewContainer);
          const roadviewClient = new window.kakao.maps.RoadviewClient();

          roadviewClient.getNearestPanoId(new window.kakao.maps.LatLng(lat, lng), 50, function (panoId) {
            roadview.setPanoId(panoId, new window.kakao.maps.LatLng(lat, lng));
          });

          const MapWalker = function (position) {
            const content = document.createElement('div');
            const figure = document.createElement('div');
            const angleBack = document.createElement('div');

            content.className = 'MapWalker';
            figure.className = 'figure';
            angleBack.className = 'angleBack';

            content.appendChild(angleBack);
            content.appendChild(figure);

            const walker = new window.kakao.maps.CustomOverlay({
              position: position,
              content: content,
              yAnchor: 1,
            });

            this.walker = walker;
            this.content = content;
          };

          MapWalker.prototype.setAngle = function (angle) {
            const threshold = 22.5;
            for (let i = 0; i < 16; i++) {
              if (angle > threshold * i && angle < threshold * (i + 1)) {
                const className = 'm' + i;
                this.content.className = this.content.className.split(' ')[0];
                this.content.className += ' ' + className;
                break;
              }
            }
          };

          MapWalker.prototype.setPosition = function (position) {
            this.walker.setPosition(position);
          };

          MapWalker.prototype.setMap = function (map) {
            this.walker.setMap(map);
          };

          let mapWalker = null;

          window.kakao.maps.event.addListener(roadview, 'init', function () {
            mapWalker = new MapWalker(new window.kakao.maps.LatLng(lat, lng));
            mapWalker.setMap(map);

            window.kakao.maps.event.addListener(roadview, 'viewpoint_changed', function () {
              const viewpoint = roadview.getViewpoint();
              mapWalker.setAngle(viewpoint.pan);
            });

            window.kakao.maps.event.addListener(roadview, 'position_changed', function () {
              const position = roadview.getPosition();
              mapWalker.setPosition(position);
              map.setCenter(position);
            });
          });

          // Marker setup
          const imageSrc = markerImageSrc; // 프로젝트 내 이미지 사용
          const imageSize = new window.kakao.maps.Size(64, 69); // 마커 이미지 크기
          const imageOption = { offset: new window.kakao.maps.Point(27, 69) }; // 마커 이미지 옵션
          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
          const markerPosition = new window.kakao.maps.LatLng(lat, lng);

          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: markerImage,
          });
          marker.setMap(map);
        };

        if (address) {
          // Address to coordinates
          geocoder.addressSearch(address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              initializeMap(result[0].y, result[0].x);
            } else {
              initializeMap(latitude, longitude); // Default to provided coordinates
            }
          });
        } else {
          initializeMap(latitude, longitude); // Default to provided coordinates
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [address, latitude, longitude, mapContainerId, level]);

  return (
    <div className="map_wrap" style={{ overflow: 'hidden', height: '400px', display: 'flex' }}>
      <div id={mapContainerId} style={{ width: '50%', height: '100%' }}></div>
      <div ref={roadviewContainerRef} style={{ width: '50%', height: '100%' }}></div>
    </div>
  );
};

export default KakaoMap;
