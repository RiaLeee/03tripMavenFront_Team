import React from 'react';
import styles from '../../../styles/guidemypage/guidemypageaiservice/RanderChart.module.css';

const RadarChart = ({ period, score }) => {
    return (
        <div className={styles.radarChart}>
            <h3>{period}</h3>
            {/* 여기에 레이더 차트 라이브러리를 사용해 차트를 그립니다. */}
            {/* 예: react-chartjs-2를 사용하여 레이더 차트 구현 */}
        </div>
    );
};

export default RadarChart;
