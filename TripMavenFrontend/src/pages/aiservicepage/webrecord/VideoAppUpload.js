import React, { useState } from 'react';
import axios from 'axios';

const VideoAppUpload = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [eyeBlinks, setEyeBlinks] = useState(null);
    const [mouthGraph, setMouthGraph] = useState(null);
    const [cheekbonesGraph, setCheekbonesGraph] = useState(null);
    const [browGraph, setBrowGraph] = useState(null);
    const [nasolabialFoldsGraph, setNasolabialFoldsGraph] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('file: ', file);
            const response = await axios.post('/python/face/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
            console.log('data: ', data);
            setResult(data);

            // base64로 인코딩된 그래프 이미지 설정
            setEyeBlinks(data.eye.total_blinks.toFixed(2));
            setMouthGraph(`data:image/png;base64,${data.graphs.mouth_graph}`);
            setCheekbonesGraph(`data:image/png;base64,${data.graphs.cheekbones_graph}`);
            setBrowGraph(`data:image/png;base64,${data.graphs.brow_graph}`);
            setNasolabialFoldsGraph(`data:image/png;base64,${data.graphs.nasolabial_folds_graph}`);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload</button>

            {result && (
                <div>
                    <h2>Analysis Result:</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>

                    {eyeBlinks !== null && (
                        <div>
                            <h3>Eye Blink Graph</h3>
                            <p>{eyeBlinks}</p> 
                        </div>
                    )}
                    {mouthGraph && (
                        <div>
                            <h3>Mouth Movement Graph</h3>
                            <img src={mouthGraph} alt="Mouth Movement Graph" />
                        </div>
                    )}
                    {cheekbonesGraph && (
                        <div>
                            <h3>Cheekbones Movement Graph</h3>
                            <img src={cheekbonesGraph} alt="Cheekbones Movement Graph" />
                        </div>
                    )}
                    {browGraph && (
                        <div>
                            <h3>Brow Movement Graph</h3>
                            <img src={browGraph} alt="Brow Movement Graph" />
                        </div>
                    )}
                    {nasolabialFoldsGraph && (
                        <div>
                            <h3>Nasolabial Folds Movement Graph</h3>
                            <img src={nasolabialFoldsGraph} alt="Nasolabial Folds Movement Graph" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VideoAppUpload;
