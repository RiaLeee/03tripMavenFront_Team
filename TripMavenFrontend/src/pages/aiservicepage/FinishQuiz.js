import React from 'react';
import styles from '../../styles/aiservicepage/FinishQuiz.module.css';
import ScoreCircle from '../guidemypage/guidemypageaiservice/ScoreCircle';
import { useNavigate } from 'react-router-dom';

const QuizResult = ({ isOpen, newScore}) => {

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/aipage');
      };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h1 className={styles.title}>퀴즈 맞추기 분석 결과</h1>

                <div className={styles.scoreSection}>
                    <div className={styles.scoreCircle}>
                    <ScoreCircle score={newScore} className={styles.score} />

                    </div>
                
                </div>
                <button className={styles.viewQuestionsButton} onClick={handleSubmit}>시작 페이지로 이동</button>
            </div>
        </div>
    );
}

export default QuizResult;