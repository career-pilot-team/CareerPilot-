import React from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MainPage from "./components/MainPage";
import MyPage from "./components/MyPage";
import Feature2Page from "./components/Feature2Page";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/*메인페이지 랜딩*/}
        <Route path="/" element={<MainPage />} />

        {/*나머지 페이지들*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/growth" element={<Feature2Page />} />
        
      </Routes>
    </Router>
  )
}

export default App;
