/* PronunciationTestTutorial.js */

import React, { useState } from 'react';
import styles from '../../styles/aiservicepage/PronunciationTestTutorial.module.css';
import { useNavigate } from 'react-router-dom';

const PronunciationTestTutorial = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const slides = [
        {
            id: 1,
            src: "/images/PronunciationPage1.png",
            title: "NOISE REDUCTION",
            instruction: "잡음 제거",
            detail: "외부 소음이 없는 조용한 환경에서 진행하세요.문을 닫고, 가능하면 주변의 소음이 들리지 않도록 조치를 취합니다."
        },
        {
            id: 2,
            src: "/images/PronunciationPage2.png",
            title: "MIC DISTANCE",
            instruction: "입과 마이크의 거리",
            detail: "입과 마이크 사이에 적절한 거리를 유지합니다.<br/>너무 가깝거나 멀리 있으면 음질이 떨어질 수 있으므로,<br/>일반적으로 15~20cm 정도의 거리가 좋습니다."
        },
    ];

    const handlePrevClick = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
                setIsAnimating(false);
            }, 300); // 애니메이션 지속 시간에 맞춰 조정
        }
    };

    const handleNextClick = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
                setIsAnimating(false);
            }, 300); // 애니메이션 지속 시간에 맞춰 조정
        }
    };

    const handleStartClick = () => {
        navigate('/pronunciation');
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>유의사항</h2>
            <img src="/images/WebTestPageLine.png" style={{width:'1000px'}}/>
            <p className={styles.subtitle}>정확한 분석을 위해 음성이 녹음되는 동안 아래 사항들을 유의해주세요.</p>
            <div className={styles.content}>
                <button onClick={handlePrevClick} className={styles.arrowButton}>{"<"}</button>
                <div className={`${styles.textSection} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                    <img src="/images/recordpage1_bar.png" className={styles.bar}/>
                    <div>
                        <img src={`/images/recordpage1_0${slides[currentIndex].id}.png`} className={styles.number}/>
                    </div>
                    <h4 className={styles.stepTitle}>{slides[currentIndex].title}</h4>
                    <p className={styles.instruction}>{slides[currentIndex].instruction}</p>
                    <p className={styles.detail}>{slides[currentIndex].detail}</p>
                </div>
                <div className={`${styles.imageSection} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                    <img src={slides[currentIndex].src} alt={slides[currentIndex].title} className={styles.image} />
                </div>
                <button onClick={handleNextClick} className={styles.arrowButton}>{">"}</button>
            </div>
            <button onClick={handleStartClick} className={styles.startButton}>바로 시작하기</button>
        </div>
    );
};

export default PronunciationTestTutorial;
