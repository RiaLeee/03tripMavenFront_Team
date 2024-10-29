import React, { useEffect, useState } from 'react';
import styles from '../styles/api/ImageSlider.module.css';
import ImagePreview from './ImagePreview';

export default function ImageSlider({ fileUrls }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    //console.log('fileUrls이미지슬라이더: ', fileUrls);
    setCurrentIndex(0); // fileUrls가 변경될 때 슬라이드를 초기화
  }, [fileUrls]);

  const nextSlide = () => {
    // 현재 슬라이드가 마지막 슬라이드가 아니면 슬라이드를 진행
    if (currentIndex < fileUrls.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    // 현재 슬라이드가 첫 번째 슬라이드가 아니면 슬라이드를 진행
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className={styles.slider}>
      {fileUrls.length > 0 ? (
        <>
          <div
            className={styles.slides}
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {fileUrls.map((fileUrl, index) => (
              <div key={index} className={styles.slide}>
                {/* <img src={fileUrl} alt={`업로드된 파일 ${index + 1}`}  /> */}
                <ImagePreview imageUrl={fileUrl} alt={`업로드된 파일 ${index + 1}`}/>
              </div>
            ))}
          </div>
          <button
            className={styles.prev}
            onClick={prevSlide}
            disabled={currentIndex === 0} // 첫 번째 슬라이드에서 이전 버튼 비활성화
          >
            &#10094;
          </button>
          <button
            className={styles.next}
            onClick={nextSlide}
            disabled={currentIndex === fileUrls.length - 1} // 마지막 슬라이드에서 다음 버튼 비활성화
          >
            &#10095;
          </button>

        </>
      ) : (
        <p>이미지가 없습니다.</p>
      )}

    </div>
  );
}
