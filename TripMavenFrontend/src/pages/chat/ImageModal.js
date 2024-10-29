import React from 'react';
import styles from '../../styles/chat/ImageModal.module.css';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="uploaded" className={styles.modalImage} />
      </div>
    </div>
  );
};

export default ImageModal;
