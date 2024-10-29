import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../styles/aiservicepage/RealTestResult.module.css';
import bgVideo from '../../videos/BG-video.mp4';
import axios from 'axios';
import { resultGetByProductId } from '../../utils/AiData';
import ResultFinalPage from './Result/ResultFinalPage';

const RealTestResult = (  ) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const videoRef = useRef(null);
  const navigate = useNavigate(); // React Router의 useNavigate 훅 사용

  const productboardId  = useParams().id;

  const [result, setResult] = useState([]);
  const [eyeGraph, setEyeGraph] = useState([]);
  const [mouthGraph, setMouthGraph] = useState(null);
  const [cheekbonesGraph, setCheekbonesGraph] = useState(null);
  const [browGraph, setBrowGraph] = useState(null);
  const [nasolabialFoldsGraph, setNasolabialFoldsGraph] = useState(null);

  useEffect(() => {
    const getResults = async () => {
      
        const data = await resultGetByProductId(productboardId);
        console.log('data: ',data);
        setResult(data);

        if (data.length > 0) {
          const eyeGraphs = data.map(dat => `data:image/png;base64,${dat.eye}`);
          const mouthGraph = data.map(dat => `data:image/png;base64,${dat.mouth}`);
          const cheekbonesGraph = data.map(dat => `data:image/png;base64,${dat.cheek}`);
          const browGraph = data.map(dat => `data:image/png;base64,${dat.brow}`);
          const nasolabialFoldsGraph = data.map(dat => `data:image/png;base64,${dat.nasolabial}`);

          setEyeGraph(eyeGraphs);
          setMouthGraph(mouthGraph);
          setCheekbonesGraph(cheekbonesGraph);
          setBrowGraph(browGraph);
          setNasolabialFoldsGraph(nasolabialFoldsGraph);

        } else {
          setEyeGraph([]);
          setMouthGraph([]);
          setCheekbonesGraph([]);
          setBrowGraph([]);
          setNasolabialFoldsGraph([]);
        }

    };

    getResults();

  }, [productboardId]);




  const handleRetakeTest = () => {
    navigate('/RealTestPage'); // RealTestPage로 이동
  };

  return (

<div className={styles.container}>
      <h1 className={styles.title}>실전 테스트 결과</h1>
      
     
      <ResultFinalPage 
        eyeGraph={eyeGraph}
        mouthGraph={mouthGraph}
        cheekbonesGraph={cheekbonesGraph}
        browGraph={browGraph}
        nasolabialFoldsGraph={nasolabialFoldsGraph}
      />



      <h1>실전 테스트 분석결과</h1>


      <div className={styles.aiAssessment}>
      {result && (
       <div>
        <h2>Analysis Result:</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>

 
        <div>
          <h3>눈 깜박임</h3>
          {eyeGraph.length > 0 ? (
            eyeGraph.map((graph, index) => (
              <img key={index} src={graph} alt={`Eye Blink Graph ${index + 1}`} />
            ))
          ) : (
            <p>눈 깜박임 그래프가 없습니다.</p>
          )}
        </div>

        {mouthGraph && (
          <div>
            <h3>입 변화율</h3>
            {mouthGraph.length > 0 ? (
              mouthGraph.map((graph, index) => (
                <img key={index} src={graph} alt={`Mouth Movement Graph ${index + 1}`} />
              ))
            ) : (
              <p>입 변화율 그래프가 없습니다.</p>
            )}
          </div>
        )}

        {cheekbonesGraph && (
          <div>
            <h3>광대 변화율</h3>
            {cheekbonesGraph.length > 0 ? (
              cheekbonesGraph.map((graph, index) => (
                <img key={index} src={graph} alt={`Cheekbones Movement Graph ${index + 1}`} />
              ))
            ) : (
              <p>광대 변화율 그래프가 없습니다.</p>
            )}
          </div>
        )}

         {browGraph && (
          <div>
            <h3>미간 변화율</h3>
            {browGraph.length > 0 ? (
              browGraph.map((graph, index) => (
                <img key={index} src={graph} alt={`Brow Movement Graph ${index + 1}`} />
              ))
            ) : (
              <p>미간 변화율 그래프가 없습니다.</p>
            )}
          </div>
        )}

                     {nasolabialFoldsGraph && (
          <div>
            <h3>팔자주름 변화율</h3>
            {nasolabialFoldsGraph.length > 0 ? (
              nasolabialFoldsGraph.map((graph, index) => (
                <img key={index} src={graph} alt={`Nasolabial Folds Movement Graph ${index + 1}`} />
              ))
            ) : (
              <p>팔자주름 변화율 그래프가 없습니다.</p>
            )}
          </div>
        )}
      </div>
     )}



    </div>
    </div>
  );
};

export default RealTestResult;
