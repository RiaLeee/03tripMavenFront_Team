import React, { useState } from 'react';
import styles from '../../styles/aiservicepage/PrecautionsPage1.module.css';
import { useNavigate } from 'react-router-dom';

const PrecautionsPage1 = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const slides = [
        {
            id: 1,
            src: "/images/recordpage1.png",
            title: "FACE LOCATION",
            instruction: "얼굴 전체가 화면에 들어오도록 해주세요.",
            detail: "얼굴 전체가 화면에 자연스럽게 들어오도록 웹캠의 각도를 조정하세요. 머리 꼭대기부터 턱까지 모두 화면에 보이도록 합니다."
        },
        {
            id: 2,
            src: "/images/recordpage2.png",
            title: "CAMERA DISTANCE",
            instruction: "적절한 거리를 유지해주세요.",
            detail: "일반적으로 카메라와의 거리는 60~90cm 정도가 적당합니다."
        },
        {
            id: 3,
            src: "/images/recordpage3.png",
            title: "EYE LEVEL",
            instruction: "눈높이에 맞춘 웹캠 위치",
            detail: "웹캠이 눈높이에 위치하도록 하여 정면을 바라보는 느낌을 줄 수 있도록 합니다."
        },
        {
            id: 4,
            src: "/images/recordpage4.png",
            title: "LIGHTING",
            instruction: "조명",
            detail: "조명은 정면에서 비추도록 하고, 역광(뒤에서 비추는 빛)을 피해야 합니다."
        },
        {
            id: 5,
            src: "/images/recordpage5.png",
            title: "BACKGROUND",
            instruction: "배경 정리",
            detail: "웹캠 배경은 깔끔하게 정리된 상태여야 합니다."
        },
        {
            id: 6,
            src: "/images/recordpage6.png",
            title: "NOISE REDUCTION",
            instruction: "잡음 제거",
            detail: "외부 소음이 없는 조용한 환경에서 진행하며, 문을 닫고 주변 소음을 줄일 수 있는 조치를 취합니다."
        },
        {
            id: 7,
            src: "/images/recordpage7.png",
            title: "MIC DISTANCE",
            instruction: "입과 마이크의 거리",
            detail: "입과 마이크 사이에 적절한 거리를 유지하며, 15~20cm 정도가 적당합니다."
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
        navigate('/recordcheck');
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>유의사항</h2>
            <img src="/images/WebTestPageLine.png" style={{width:'1000px'}}/>
            <p className={styles.subtitle}>정확한 분석을 위해 화면이 녹화되는 동안 아래 사항들을 유의해주세요.</p>
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

export default PrecautionsPage1;
