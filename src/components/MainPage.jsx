import React from "react";
import "./MainPage.css";
import { Link } from "react-router-dom";

import logo from "../assets/logo.png";
import mainImg1 from "../assets/mainImg_1.jpg";
import mainImg2 from "../assets/mainImg_2.png";
import mainImg3 from "../assets/mainImg_3.jpg";
import mainImg4 from "../assets/mainImg_4.jpg";
import mainImg5 from "../assets/mainImg_5.png";

const MainPage = () => {
  return (
    <div className="main-container">
      {/* 상단 헤더 */}
      <header className="main-header">
        <div className="main-header-left">
          <Link to="/" className="logo-link">
          <img src={logo} alt="CareerPilot 로고" className="main-logo" />
          </Link>
          {/* <span className="main-logo-text">PILOT</span> */}
        </div>
        <nav className="main-nav-links">
          <Link to ="/login">로그인</Link>
          <Link to="/register">회원가입</Link>
          <Link to="/mypage">마이페이지</Link>
        </nav>
      </header>

      {/* 히어로 영역 */}
      <section className="hero-section">
        <img src={mainImg1} alt="노트북과 노트" className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-subtitle">STEP BY STEP</p>
          <h1 className="hero-title">CareerPilot</h1>
          <div className="hero-buttons">
            <button className="hero-btn hero-btn-primary">
              나의 진로 AI 추천받기
            </button>
            <button className="hero-btn hero-btn-secondary">
              맞춤 진로 상담받기
            </button>
          </div>
        </div>
      </section>

      {/* 고민 섹션 */}
      <section className="worry-section">
        <div className="worry-text">
          <h2>이런 <span className="red">고민</span> 있지 않으신가요?</h2>
          <p>“ 자격증을 따야 할 것 같은데, 뭐부터 해야 할지 모르겠어요 ”</p>
          <p>“ 나한테 맞는 길이 뭘까…? 누가 좀 알려줬으면 좋겠어요 ”</p>
        </div>
        <div className="worry-emoji" aria-hidden="true">
          <img src={mainImg5} alt="고민하는 얼굴" />
        </div>
      </section>

      {/* 기능 카드 섹션 */}
      <section className="feature-section">
        {/* 카드 1 */}
        <article className="feature-card">
          <img
            src={mainImg2}
            alt="기능1이미지"
            className="feature-image"
          />
          <div className="feature-content">
            <p className="feature-tag">나에게 꼭 맞는 진로, AI가 찾아드립니다</p>
            <h3 className="feature-title">
              데이터 기반 진로 &amp; 자격증 추천 시스템
            </h3>
            <button className="feature-btn">나의 진로 AI 추천 시작하기</button>
          </div>
        </article>

        {/* 카드 2 */}
        <article className="feature-card">
          <img
            src={mainImg3}
            alt="기능2이미지"
            className="feature-image"
          />
          <div className="feature-content">
            <p className="feature-tag">체계적인 학습 경로로 꾸준히 성장하기</p>
            <h3 className="feature-title">
              단계별 학습 경로 &amp; 성장 트래커
            </h3>
            <Link to="/growth" className="feature-btn">학습 여정 시작하기
          </Link>
          </div>
        </article>

        {/* 카드 3 */}
        <article className="feature-card">
          <img
            src={mainImg4}
            alt="기능3이미지"
            className="feature-image"
          />
          <div className="feature-content">
            <p className="feature-tag">포트폴리오 작성, 귀찮고 어려우시죠?</p>
            <h3 className="feature-title">
              포트폴리오 자동 생성 &amp; AI 피드백
            </h3>
            <button className="feature-btn">포트폴리오 피드백 받기</button>
          </div>
        </article>
      </section>
    </div>
  );
};

export default MainPage;
