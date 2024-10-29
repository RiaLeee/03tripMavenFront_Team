import React, { useEffect, useState } from 'react';
import styles from '../../../../styles/guidemypage/guidemypageaiservice/AIService.module.css';
import ScoreCircle from '../ScoreCircle';
import { useNavigate } from 'react-router-dom';
import ScoreChart from '../ScoreChart';
import { resultGetByMemberId } from '../../../../utils/AiData';
import Loading from '../../../../components/LoadingPage';

const AIService = () => {

    const navigate = useNavigate();
    const memberId = localStorage.getItem('membersId');
    const [results,setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleClick = () => {
        navigate('/aipage'); // AIService 페이지로 이동
    };

 
    useEffect(()=>{
        const getResult = async () => {
            setLoading(true); // 데이터 로딩 시작
            try {
                const result = await resultGetByMemberId(memberId);
                console.log('회원id에따른 평가 컬럼들: ', result[0].productEvaluation[0].score);
                console.log('회원id에따른 평가 컬럼들: ', result[0].productEvaluation[0].createdAt);

                setResults(result);
            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false); // 데이터 로딩 종료
            }
        };

        getResult();

    },[memberId]);

    const avgScore = () => {
        if (results.length > 0) {
            const totalScore = results.reduce((sum, result) => {
                if (result.productEvaluation && result.productEvaluation.length >= 2) {
                    return sum + result.productEvaluation[0].score + result.productEvaluation[1].score;
                }
                return sum;
            }, 0);
            const averageScore = totalScore / (results.length * 2);
            return averageScore;
        }
        return 0;
    };
    

    return (
        <div className={styles.aiServices}>
            <h2 className={styles.aiai}>ai 서비스</h2>

{loading ? (<Loading/>) : (<>


            <div className={styles.scoreContainer}>
                <ScoreCircle score={avgScore()} />
                </div>

                <button className={styles.button} onClick={handleClick}>AI 홈으로 이동</button>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>검사번호</th>
                            <th>검사 일자</th>
                            <th>평가 점수</th>
                            <th>AI 평가 완료된 게시글</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results ? results.map(result => (
                            <tr key={result.id} onClick={()=>navigate(`/resultFinalPage/${result.id}`)}> {/*ㅍ */}
                                <td>{result.id}</td>
                                <td>{result.productEvaluation?.[0]?.createdAt?.split('T')[0] || 'N/A'}</td>
                                <td>{result.productEvaluation?.[0]?.score || '45'}</td>
                                <td>{result.productBoard.title}</td>
                            </tr>
                        ))
                        :
                        <tr onClick={()=>navigate(`/resultFinalPage/`)}>
                            <td colSpan={5}>{'실전 테스트 결과가 없습니다'}</td>
                        </tr>
                        }
                    </tbody>
                </table>
            </div>
            </>
        )}
        </div>
    );
};

export default AIService;