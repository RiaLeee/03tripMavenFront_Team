import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/api/YouTubeSearch.module.css'; // 스타일링을 위해 CSS 모듈 사용

const YouTubeSearch = ({ keyword, city }) => {
    const [videos, setVideos] = useState([]);
    
    // city와 keyword를 결합하여 검색어 생성
    const keywordTravel = city ? `${city} 여행` : `${keyword} 여행`;

    const YOUTUBE_API_KEY = ''; // 안먹으면 아래 키 중에 1개 사용
    //const YOUTUBE_API_KEY = 'AIzaSyCZayRJHfttrAoayZKY-owo_6TslcaEduM'; // 규림
    // const YOUTUBE_API_KEY = 'AIzaSyCZPSPkT5rNtWvV6lkmREOGemJkoieQAJk'; // 시은
    //const YOUTUBE_API_KEY = 'AIzaSyAxRvCfzlqgdIOlU3C8SSFLWnJ_a9Dt3NU'//주원
    //const YOUTUBE_API_KEY = AIzaSyCL0xNyeIjXFRhAeO5nd6dIi5d_8PjhiFU


    const searchYouTube = async (searchTerm) => {
        if (!searchTerm) return;
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    q: searchTerm,
                    type: 'video',
                    maxResults: 5,
                    key: YOUTUBE_API_KEY,
                },
            });
            setVideos(response.data.items);
        } catch (error) {
            console.error('Error fetching YouTube data', error);
        }
    };

    useEffect(() => {
        searchYouTube(keywordTravel);
    }, [keywordTravel]);

    return (
        <div className={styles.container}>
            <h2>
                '<span className={styles.keyword}>{keywordTravel}</span>' 관련 추천 영상
            </h2>
            <div className={styles.videoGrid}>
                {videos.map((video) => (
                    <div key={video.id.videoId} className={styles.videoItem}>
                        <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                            <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
                            <h3>{video.snippet.title.length > 10 ? video.snippet.title.slice(0, 10) + '...' : video.snippet.title}</h3>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouTubeSearch;
