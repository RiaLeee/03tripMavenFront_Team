
import { Route, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import Landing from './pages/landing/Landing';
import Home from "./pages/home/Home";
import Template from "./pages/Template";
import LoginRoutes from './pages/login/LoginRoutes';
import MyPageRoutes from './pages/mypage/MyPageRoutes';
import MyPageTemplate from './pages/mypage/MyPageTemplate';
import UserReview from './pages/mypage/usermypage/UserReview';
import UserLike from './pages/mypage/usermypage/UserLike';

import AskUpdate from './pages/askpage/AskUpdate';
import CSBoard from './pages/csboard/CSBoard';
import TermsService from './pages/infopage/TermsService';
import RegisterGuide from './pages/registerguidepage/RegisterGuide';
import SiteIntroduction from './pages/infopage/SiteInfo';
import FAQ from './pages/csboard/FAQ';

import ProductBoard from './pages/productPage/ProductBoard';
import BigChat from './pages/chat/BigChat';
import ChattingRoom from './pages/chat/ChattingRoom';
import DeviceCheckComponent from './pages/aiservicepage/webrecord/DeviceCheckComponent';
import WebcamRecorder from './pages/aiservicepage/webrecord/WebcamRecorder';
import PrecautionsPage1 from './pages/aiservicepage/PrecautionsPage1';
import QuizForm2 from './pages/aiservicepage/QuizForm2';
import QuizTutorial from './pages/aiservicepage/QuizTutorial';
import PronunciationTestTutorial from './pages/aiservicepage/PronunciationTestTutorial';
import RealTest1 from './pages/aiservicepage/RealTest1';
import PostDetails from './pages/productPage/PostDetails';
import RealTestPage from './pages/aiservicepage/RealTestPage'
import AnalysisResult from './pages/aiservicepage/AnalysisResult';
import DeviceCheckComponent2 from './pages/aiservicepage/webrecord/DeviceCheckComponent copy';
import PronunciationRoutes from './pages/aiservicepage/PronunciationRoutes';
import CombinedPage from './pages/aiservicepage/AIPage';
import ProductComponent from './pages/aiservicepage/webrecord/ProductComponent';
import ScreenRecorderApp from './pages/aiservicepage/VoiceTest';
import ReviewDetails from './pages/mypage/usermypage/ReviewDetails';
import ReviewDetailsUpdate from './pages/mypage/usermypage/ReviewDetailsUpdate';
import ResultFinalPage from './pages/aiservicepage/Result/ResultFinalPage';
import RoleBasedRoute from './components/RoleBasedRoute';
import FaceDetection from './components/FaceDetection';
import ProductPost from './pages/productPage/ProductPost';
import Error404Page from './pages/error/Error404Page';
import GuidePostUpdate from './pages/guidemypage/GuidePostUpdate';




function App() {

  return <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<Template />}>
        <Route path="/home" element={<Home />} />
        <Route path='/login/*' element={<LoginRoutes />} />

        <Route element={<RoleBasedRoute element={<MyPageTemplate />} requiredRole={["USER", "GUIDE", "ADMIN"]} />} >
          {/* MYPAGE s*/}
          <Route path='/mypage/*' element={<MyPageRoutes />} />
          {/* USER */}
          <Route path='/userreview' element={<UserReview />} />
          <Route path='/reviewdetails/:id' element={<ReviewDetails />} />
          <Route path='/reviewDetailsUpdate/:id' element={<ReviewDetailsUpdate />} />
          <Route path='/userlike' element={<UserLike />} />
          <Route path='/bigchat/:id' element={<BigChat />} />
          <Route path='/chattingRoom' element={<ChattingRoom />} />
          <Route path='/chattingRoom' element={<ChattingRoom />} />    
          <Route path='/askupdate/:id' element={<AskUpdate />} />
        </Route>

        <Route path="/cs" element={<CSBoard />} />
        <Route path="/siteinfo" element={<SiteIntroduction />} />
        <Route path="/faq" element={<FAQ />} />

        <Route path='/precautionspage1' element={<RoleBasedRoute element={<PrecautionsPage1 />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/quizform2' element={<RoleBasedRoute element={<QuizForm2 />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/quiztutorial' element={<RoleBasedRoute element={<QuizTutorial />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/pronunciationtesttutorial' element={<RoleBasedRoute element={<PronunciationTestTutorial />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/realtest1' element={<RoleBasedRoute element={<RealTest1 />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/analysisresult' element={<RoleBasedRoute element={<AnalysisResult />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/pronunciation/*' element={<RoleBasedRoute element={<PronunciationRoutes />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />
        <Route path='/aipage' element={<RoleBasedRoute element={<CombinedPage />} requiredRole={["USER","GUIDE", "ADMIN"]} />} />

        <Route path='/registerguide' element={<RegisterGuide />} />
        <Route path='/product' element={<ProductBoard />} />
        <Route path='/postDetails/:id' element={<PostDetails />} />
        <Route path='/productPost/:id' element={<RoleBasedRoute element={<ProductPost />}  requiredRole={["GUIDE", "ADMIN"]} />} />
        <Route path='/guidePostUpdate/:id' element={<RoleBasedRoute element={<GuidePostUpdate />}  requiredRole={["GUIDE", "ADMIN"]} />} />

        <Route path='/termsservice' element={<TermsService />} />
        <Route path='/record' element={<WebcamRecorder />} />
        <Route path='/recordcheck' element={<DeviceCheckComponent />} />
        <Route path='/test' element={<DeviceCheckComponent2 />} />
        <Route path='/realTestPage/:id' element={<RealTestPage />} />

        {/* <Route path='/realTestResult/:id' element={<RealTestResult />} />  미사용(ResultFinalPage 사용)*/}
        <Route path='/productComponent' element={<ProductComponent />} />
        <Route path='/juwontest' element={<ScreenRecorderApp />} />
        {/* 실전 테스트 결과 페이지 라우팅 */}
        
        <Route path='/resultFinalPage/:id' element={<ResultFinalPage />} />

        <Route path='/faceDetection' element={<FaceDetection />} />


        <Route path='*' element={<Error404Page />} />
    
      </Route>
    </Routes>
  </>
}

export default App;
