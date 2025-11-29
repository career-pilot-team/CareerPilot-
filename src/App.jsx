// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import RoadmapInput from "./components/RoadmapInput";
import RoadmapOutput from "./components/RoadmapOutput";


function App() {
  //return <RegisterPage />; <- 회원가입 출력하는 코드 // 사용할거면 밑 코드를 주석처리 할것!
  return (
     <BrowserRouter>
      <Routes>
        {/* 기본 / → 입력 페이지 */}
        <Route path="/" element={<RoadmapInput />} />

        {/* 출력 페이지 */}
        <Route path="/roadmap-output" element={<RoadmapOutput />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
