import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import RoadmapInput from "./components/RoadmapInput";
import RoadmapOutput from "./components/RoadmapOutput";
import MainPage from "./components/MainPage";
import MyPage from "./components/MyPage";
import Feature2Page from "./components/Feature2Page";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*메인페이지 랜딩*/}
        <Route path="/" element={<MainPage />} />

        {/*나머지 페이지들*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/growth" element={<Feature2Page />} />

        {/* 추천입력/추천결과 페이지*/}
        <Route path="/roadmap-input" element={<RoadmapInput />} />
        <Route path="/roadmap-output" element={<RoadmapOutput />} />        
      </Routes>
    </BrowserRouter>
  )
}
export default App;
