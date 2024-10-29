// hooks/useMediaRecorder.js
import { useRef, useState } from 'react';

const useMediaRecorder = () => {
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = (stream) => {

    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const getBlob = () => {
    return new Blob(recordedChunks, { type: 'video/webm' });
  };

  return { startRecording, stopRecording, getBlob, isRecording };
};

export default useMediaRecorder;
