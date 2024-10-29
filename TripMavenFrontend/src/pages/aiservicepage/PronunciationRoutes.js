import { Navigate, Route, Routes } from "react-router-dom";
import PronunciationTest from "./PronunciationTest";
import MICTest from "./MICTest";
import { newsCrawling } from "../../utils/PythonServerAPI";
import { useEffect, useState } from "react";
import { PronunContext } from "../../context/PronunContext";
import PronunciationResult from "./PronunciationResult";

export default function PronunciationRoutes() {
    const [results, setResults] = useState([]); // 결과 저장 스테이트
    let newsHeadLine = []
    const fetchnews = async (e) => {
        try {
            const response = await newsCrawling();
            for (let i = 0; i <= response.data.length - 1; i++) {
                newsHeadLine.push(response.data[i])
            }
        } catch (error) {
            console.error('크롤링 중 오류 발생:', error);
        }
    };
    useEffect(() => {
        fetchnews();
    });

    return <>
        <PronunContext.Provider value={{newsHeadLine, results, setResults}}>
            <Routes>
                <Route path="" element={<MICTest />} /> {/*URL이 /pronunciation 라면 마이크 테스트 */}
                <Route path="/:sequence" element={<PronunciationTest />} /> {/* URL이 /pronunciation/시퀀스면 라면 발음 테스트 */}
                <Route path='/result' element={<PronunciationResult/>}/>
                <Route path="*" element={<Navigate to="" replace={true} />} /> {/*URL이 /pronunciation/시퀀스 이외의 URL은 URL이 /pronunciation로 */}
            </Routes>
        </PronunContext.Provider>
    </>
}