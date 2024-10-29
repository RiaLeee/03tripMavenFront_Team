import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetection = ({ webcamRef, setResponses, responses }) => {
  const canvasRef = useRef(null);
  const [expressions, setExpressions] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      // 비디오가 로드되었을 때만 얼굴 감지 처리
      if (webcamRef.current?.video.readyState === 4) {
        handleVideoPlay();
      } else {
        webcamRef.current.video.onloadeddata = () => {
          handleVideoPlay();
        };
      }
    };

    const handleVideoPlay = () => {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;

      // 비디오 및 캔버스 크기 확인
      const displaySize = {
        width: video.videoWidth,
        height: video.videoHeight,
      };

      if (displaySize.width === 0 || displaySize.height === 0) {
        console.error("비디오 또는 캔버스의 크기가 0입니다.");
        return;
      }

      // 캔버스 크기 설정
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;
      faceapi.matchDimensions(canvas, displaySize);

      // 1초마다 얼굴 및 감정 인식
      setInterval(async () => {
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 512,
          scoreThreshold: 0.5,
        });

        const detections = await faceapi.detectAllFaces(video, options).withFaceExpressions();

        if (detections.length === 0) {
          console.warn("얼굴을 인식하지 못했습니다.");
          return;
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        if (resizedDetections.length > 0) {
          const detectedExpressions = resizedDetections[0]?.expressions;
          setExpressions(detectedExpressions);
          setResponses([...responses, { expressions: detectedExpressions }]);
        }

        // 캔버스에 얼굴과 감정 표시
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }, 1000);
    };

    loadModels();
  }, [webcamRef, setResponses, responses]);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {expressions && <div>{JSON.stringify(expressions)}</div>}
    </>
  );
};

export default FaceDetection;
