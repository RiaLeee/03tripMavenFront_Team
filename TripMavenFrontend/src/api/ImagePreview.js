import React, { useState } from 'react';
import Modal from 'react-modal'; // react-modal 설치 필요: npm install react-modal
import styles from '../styles/api/ImagePreview.module.css'; // 필요한 스타일

const ImagePreview = ({ imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* 이미지 썸네일 */}
      <img
        src={imageUrl}
        alt="thumbnail"
        className={styles.thumbnail}
        onClick={openModal}
        style={{ cursor: 'pointer' }} // 마우스 커서가 포인터로 변경
      />

      {/* 모달 */}
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
        className={styles.modal} // 스타일 설정
        overlayClassName={styles.overlay} // 오버레이 스타일 설정
      >
        <button onClick={closeModal} className={styles.closeButton}>Close</button>
        <img src={imageUrl} alt="full-size" className={styles.fullImage} />
      </Modal>
    </div>
  );
};

export default ImagePreview;
