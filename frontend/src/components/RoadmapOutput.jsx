// src/components/RoadmapOutput.jsx

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import logo from "../assets/logo.png";
import certIcon from "../assets/자격증.png";
import skillIcon from "../assets/skill3.png";
import outputHero from "../assets/output.png";
import cp2Img from "../assets/cp2.png";
import g1Img from "../assets/g1.png";

import "./Feature2Page.css";
import "./RoadmapOutput.css";
import Footer from "./Footer";



const RoadmapOutput = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;
  const token = localStorage.getItem("token");

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!result) {
    return (
      <div className="roadmap-page roadmap-page--empty">
        <h1 className="roadmap-title">로드맵 결과를 찾을 수 없어요</h1>
        <button
          className="btn-primary"
          onClick={() => navigate("/roadmap-input")}
        >
          다시 입력하러 가기
        </button>
      </div>
    );
  }

  // 🔥 저장 기능
  const handleSaveRecommend = async () => {
    if (!token) {
      alert("로그인 후 저장할 수 있어요!");
      return;
    }

    try {
      const payload = {
        refinedJob: result.refinedJob,
        certifications: result.certifications,
        techStack: result.techStack,
        roadmap: result.roadmap,
        nodes: result.nodes,
        tracks: result.tracks,
      };

      const res = await axios.post(
        "/api/recommend/save",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.ok) {
        alert("추천 결과가 저장되었습니다! 🎉");
        navigate("/growth"); // Feature2Page
      } else {
        alert("저장 실패! 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("저장 오류:", err);
      alert("서버 오류로 저장하지 못했습니다.");
    }
  };

  console.log("AI Roadmap result >>>", result);

  const refinedJob = result.refinedJob || "";
  const certifications = result.certifications || [];
  const techStack = result.techStack || [];
  const roadmap = result.roadmap || [];
  const nodes = result.nodes || [];
  const tracks = result.tracks || [];

 

  const trackSummary =
    tracks.length > 0
      ? tracks.map((t) => t.title || t.id).join(" → ")
      : "트랙 정보가 없습니다.";

  const hasRoadmap = roadmap.length > 0;
  const step = hasRoadmap ? roadmap[currentStepIndex] : null;
  const node = hasRoadmap ? nodes[currentStepIndex] : null;
  const track = hasRoadmap ? tracks[currentStepIndex] : null;

  const totalSteps = roadmap.length;

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  return (
    <div className="feature2-page">
      {/* 공통 헤더 */}
      <header className="header">
        <Link to="/" className="logo-link">
          <img src={logo} alt="logo" className="feature2-logo" />
        </Link>
        <nav className="nav-links">
          <Link to="/login">로그인</Link>
          <Link to="/register">회원가입</Link>
          <Link to="/mypage">마이페이지</Link>
        </nav>
      </header>

      <div className="roadmap-page">
        <header className="roadmap-header">
          <h1 className="roadmap-title">AI 로드맵 결과</h1>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate("/roadmap-input")}
          >
            다시 입력하기
          </button>
        </header>

        <div className="roadmap-hero-wrapper">
          <img src={g1Img} alt="Career 아이콘" className="roadmap-hero roadmap-hero-left" />
          <img src={cp2Img} alt="배너" className="roadmap-hero roadmap-hero-right" />
        </div>

        {/* 요약 섹션 */}
        <section className="summary-card">
          <p className="summary-label">요약</p>
          <h2 className="summary-job">
            추천 직무: <span className="summary-job-name">{refinedJob}</span>
          </h2>

          <p className="summary-text">
            <strong>트랙 흐름:</strong> {trackSummary}
          </p>

          <p className="summary-text">
            이러한 <strong>{refinedJob}</strong>을 준비하려면 아래 계획을 따라가 보세요.
          </p>

          {/* 🔥 저장 버튼 */}
          <button
            className="btn-primary"
            style={{ marginTop: "12px" }}
            onClick={handleSaveRecommend}
          >
            추천 결과 저장하기
          </button>
        </section>

        {/* 자격증 / 기술 스택 */}
        <section className="grid-section">
          <div className="recommend-row">
            <div className="recommend-card">
              <img src={certIcon} alt="자격증 아이콘" className="recommend-icon" />
              <div className="recommend-body">
                <h2 className="recommend-title">추천 자격증</h2>
                {certifications.length === 0 ? (
                  <p className="recommend-empty">(추천 자격증 없음)</p>
                ) : (
                  <ul className="recommend-list">
                    {certifications.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="recommend-card">
              <img src={skillIcon} alt="기술 스택 아이콘" className="recommend-icon" />
              <div className="recommend-body">
                <h2 className="recommend-title">추천 기술 스택</h2>
                {techStack.length > 0 ? (
                  <ul className="recommend-list">
                    {techStack.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="recommend-empty">(추천 기술 스택 없음)</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 로드맵 (슬라이드) */}
        <section className="roadmap-section">
          <h2 className="roadmap-section-title">로드맵 (월별 계획)</h2>

          {!hasRoadmap && <p className="card-empty">(로드맵 없음)</p>}

          {hasRoadmap && (
            <div
              className="roadmap-bg"
              style={{
                backgroundImage: `url(${outputHero})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <div className="roadmap-carousel">
                <button
                  className="nav-btn"
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                >
                  〈
                </button>

                <div className="roadmap-card">
                  <p className="roadmap-step">{step}</p>

                  {node && (
                    <>
                      {node.title && <p className="roadmap-node-title">핵심 단계: {node.title}</p>}
                      {node.reason && <p className="roadmap-node-reason">{node.reason}</p>}
                    </>
                  )}

                  {track?.tasks?.length > 0 && (
                    <>
                      <p className="roadmap-tasks-label">이렇게 공부해 보세요:</p>
                      <ul className="roadmap-tasks-list">
                        {track.tasks.map((task) => (
                          <li key={task.id}>{task.label}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <button
                  className="nav-btn"
                  onClick={handleNext}
                  disabled={currentStepIndex === totalSteps - 1}
                >
                  〉
                </button>
              </div>

              <div className="roadmap-indicator">
                {currentStepIndex + 1} / {totalSteps}
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapOutput;
