// src/components/RoadmapOutput.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Link 추가
import logo from "../assets/logo.png";
import "./Feature2Page.css"; // 헤더 스타일 재사용
import "./RoadmapOutput.css";

const RoadmapOutput = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

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

  console.log("AI Roadmap result >>>", result);

  const refinedJob = result.refinedJob || "";
  const certifications = result.certifications || [];
  const techStack = result.techStack || [];
  const roadmap = result.roadmap || [];
  const nodes = result.nodes || [];
  const tracks = result.tracks || [];

  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 👈 현재 단계 인덱스

  const trackSummary =
    tracks.length > 0
      ? tracks.map((t) => t.title || t.id).join(" → ")
      : "트랙 정보가 없습니다.";

  const hasRoadmap = roadmap.length > 0;
  const step = hasRoadmap ? roadmap[currentStepIndex] : null;
  const node = hasRoadmap && nodes ? nodes[currentStepIndex] : null;
  const track =
    hasRoadmap && tracks ? tracks[currentStepIndex] : null;

  const totalSteps = roadmap.length;

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  return (
      <div className="feature2-page">
    {/* 🔥 공통 헤더 (로고 + 로그인/회원가입/마이페이지) */}
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

      {/* 요약 섹션 */}
      <section className="summary-card">
        <p className="summary-label">요약</p>
        <h2 className="summary-job">
          추천 직무:{" "}
          <span className="summary-job-name">
            {refinedJob || "직무 정보 없음"}
          </span>
        </h2>

        <p className="summary-text">
          <strong>트랙 흐름:</strong> {trackSummary}
        </p>

        <p className="summary-text">
          이러한 <strong>{refinedJob || "직무"}</strong>을 준비하려면 아래
          역량과 학습 계획을 순서대로 따라가 보면 좋아요.
        </p>
      </section>

      {/* 추천 자격증 / 기술 스택 */}
      <section className="grid-section">
        <div className="card">
          <h3 className="card-title">추천 자격증</h3>
          {certifications.length > 0 ? (
            <ul className="card-list">
              {certifications.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="card-empty">(추천 자격증 없음)</p>
          )}
        </div>

        <div className="card">
          <h3 className="card-title">추천 기술 스택</h3>
          {techStack.length > 0 ? (
            <ul className="card-list">
              {techStack.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="card-empty">(추천 기술 스택 없음)</p>
          )}
        </div>
      </section>

      {/* 로드맵 - 슬라이드 한 장씩 */}
      <section className="roadmap-section">
        <h2 className="roadmap-section-title">로드맵 (월별 계획)</h2>
        {!hasRoadmap && <p className="card-empty">(로드맵 없음)</p>}

        {hasRoadmap && (
          <div className="roadmap-carousel">
            {/* 왼쪽 버튼 */}
            <button
              className="nav-btn nav-btn--left"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
            >
              〈
            </button>

            {/* 가운데 카드 한 장 */}
            <div className="roadmap-card">
              <p className="roadmap-step">{step}</p>

              {node && (
                <>
                  {node.title && (
                    <p className="roadmap-node-title">
                      핵심 단계: {node.title}
                    </p>
                  )}
                  {node.reason && (
                    <p className="roadmap-node-reason">{node.reason}</p>
                  )}
                </>
              )}

              {track && track.tasks && track.tasks.length > 0 && (
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

            {/* 오른쪽 버튼 */}
            <button
              className="nav-btn nav-btn--right"
              onClick={handleNext}
              disabled={currentStepIndex === totalSteps - 1}
            >
              〉
            </button>
          </div>
        )}

        {/* 인디케이터 (1 / 3 이런 거) */}
        {hasRoadmap && (
          <div className="roadmap-indicator">
            {currentStepIndex + 1} / {totalSteps}
          </div>
        )}
      </section>
    </div>
    </div>
  );
};

export default RoadmapOutput;
