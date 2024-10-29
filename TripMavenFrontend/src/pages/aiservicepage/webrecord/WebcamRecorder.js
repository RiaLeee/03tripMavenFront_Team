
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamRecorder = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [timer, setTimer] = useState(60); // 1분 타이머
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimer(60); // 타이머 초기화

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorderRef.current.start();

        timerIntervalRef.current = setInterval(() => {
          setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      })
      .catch((error) => {
        console.error('Error getting user media:', error);
      });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
    clearInterval(timerIntervalRef.current);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prev) => [...prev, event.data]);
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'recording.webm');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Webcam ref={webcamRef} /> <br/>
      {isRecording ? (
        <button className='btn btn-warning' onClick={handleStopRecording}>녹화 중지</button>
      ) : (
        <button className='btn btn-success' onClick={handleStartRecording}>녹화 시작</button>
      )}
      <button className='btn btn-success mx-3' onClick={downloadRecording}>영상 다운로드</button>
      <p>남은 시간: {timer} 초</p>
      
    </div>
  );
};

export default WebcamRecorder;


/*
import { useCallback, useEffect, useRef } from "react";

const VideoRecorder = () => {
    const videoRef = useRef(null);
    const mediaRecorder = useRef(null);
    const videoChunks = useRef([]);

    const getMediaPermission = useCallback(async () => {
      try {
        const audioConstraints = { audio: true };
        const videoConstraints = {
          audio: false,
          video: true,
        };

        const audioStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
        const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);

        if (videoRef.current) {
            videoRef.current.srcObject = videoStream;
        }

        // MediaRecorder 추가
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        const recorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm',
        });

        recorder.ondataavailable = (e) => {
            if (typeof e.data === 'undefined') return;
            if (e.data.size === 0) return;
            videoChunks.current.push(e.data);
        };

        mediaRecorder.current = recorder;
      } catch (err) {
        console.log(err);
      }
    }, []);

    useEffect(() => {
      getMediaPermission();
    }, [getMediaPermission]);

    return (
      <div>
        <video ref={videoRef} autoPlay />
        <button
          onClick={() => mediaRecorder.current?.start()}
        >
          Start Recording
        </button>
        <button
          onClick={() => mediaRecorder.current?.stop()}
        >
          Stop Recording
        </button>
      </div>
    );
};

export default VideoRecorder;
*/