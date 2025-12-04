// src/components/RoadmapInput.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Feature2Page.css";   // 헤더 스타일 재사용
import "./RoadmapInput.css";

import logo from "../assets/logo.png";     // ✅ 빼먹었던 로고 import
import f1input from "../assets/f1input.png"; // 상단 일러스트

const JOB_PRESETS = [
  "데이터 엔지니어",
  "백엔드 개발자",
  "프론트엔드 개발자",
  "데이터 분석가",
];

const INTEREST_PRESETS = ["AI", "웹", "클라우드", "보안", "데이터 분석"];

const RoadmapInput = () => {
  const [major, setMajor] = useState("");
  const [desiredJob, setDesiredJob] = useState("");
  const [interestsText, setInterestsText] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleInterestPresetClick = (value) => {
    setInterestsText((prev) => {
      const parts = prev
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (parts.includes(value)) return prev;
      return prev ? `${prev}, ${value}` : value;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      major,
      // 🟡 백엔드가 desiredJob / desiredRole 중 무엇을 쓰는지에 맞춰야 함
      // 현재는 너가 쓰던 키 유지
      desiredRole: desiredJob,
      interests: interestsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      skills: skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("http://localhost:8000/ai/recommend/detailed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("AI 서버 에러: " + res.status);
      }

      const data = await res.json();
      navigate("/roadmap-output", { state: { result: data } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature2-page">
      <div className="feature2-container">
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

        {/* 로드맵 입력 섹션 */}
        <section className="roadmap-input-page">
          <h2 className="roadmap-input-title">나의 로드맵 설정</h2>
          <p className="roadmap-input-subtitle">
            전공, 희망 직무, 관심 분야, 보유 기술을 입력하면
            <br />
            AI가 단계별 학습 로드맵과 체크리스트를 만들어 줘요.
          </p>

          {/* 상단 히어로 이미지 */}
          <div className="roadmap-hero-wrap">
            <img
              src={f1input}
              alt="CareerPilot 로드맵 일러스트"
              className="roadmap-hero-img"
            />
          </div>

          {/* 왼쪽: 폼 / 오른쪽: 설명 카드 */}
          <div className="roadmap-input-grid">
            {/* 폼 카드 */}
            <div className="roadmap-input-card">
              <form onSubmit={handleSubmit}>
                {/* 전공 */}
                <div className="ri-field">
                  <label className="ri-label">전공</label>
                  <input
                    type="text"
                    className="ri-input"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="예: 정보통계학, 컴퓨터공학"
                  />
                </div>

                {/* 희망 직무 + 프리셋 */}
                <div className="ri-field">
                  <label className="ri-label">희망 직무</label>
                  <input
                    type="text"
                    className="ri-input"
                    value={desiredJob}
                    onChange={(e) => setDesiredJob(e.target.value)}
                    placeholder="예: 데이터 엔지니어, 백엔드 개발자"
                  />
                  <div className="ri-preset-row">
                    {JOB_PRESETS.map((job) => (
                      <button
                        type="button"
                        key={job}
                        className="ri-chip"
                        onClick={() => setDesiredJob(job)}
                      >
                        {job}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 관심 분야 + 프리셋 */}
                <div className="ri-field">
                  <label className="ri-label">
                    관심 분야 <span className="ri-hint">(콤마로 구분)</span>
                  </label>
                  <input
                    type="text"
                    className="ri-input"
                    value={interestsText}
                    onChange={(e) => setInterestsText(e.target.value)}
                    placeholder="예: AI, 웹, 클라우드"
                  />
                  <div className="ri-preset-row">
                    {INTEREST_PRESETS.map((interest) => (
                      <button
                        type="button"
                        key={interest}
                        className="ri-chip ri-chip-secondary"
                        onClick={() => handleInterestPresetClick(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 기술 스택 */}
                <div className="ri-field">
                  <label className="ri-label">
                    보유 기술 스택 <span className="ri-hint">(콤마로 구분)</span>
                  </label>
                  <input
                    type="text"
                    className="ri-input"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    placeholder="예: Python, SQL, React"
                  />
                </div>

                <div className="ri-footer">
                  <button
                    type="submit"
                    className="ri-submit"
                    disabled={loading}
                  >
                    {loading
                      ? "AI가 로드맵을 만드는 중..."
                      : "AI에게 로드맵 요청하기"}
                  </button>
                  {error && <p className="ri-error">에러: {error}</p>}
                </div>
              </form>
            </div>

            {/* 오른쪽 설명 카드 */}
            <aside className="roadmap-sidecard">
              <h3>이런 정보도 알려줘요</h3>
              <ul>
                <li>
                  <strong>전공</strong>을 기반으로, 내 배경에 맞는 학습 시작점을
                  잡습니다.
                </li>
                <li>
                  <strong>희망 직무</strong>에 맞춰 필요한 자격증과 기술 스택을
                  추천합니다.
                </li>
                <li>
                  <strong>관심 분야</strong>를 반영해, 지루하지 않게 학습할 수
                  있는 로드맵을 설계합니다.
                </li>
                <li>
                  <strong>보유 기술 스택</strong>을 활용해, 이미 아는 것부터
                  확장할 수 있는 실전 과제를 제안합니다.
                </li>
              </ul>
              <p className="sidecard-footnote">
                로그인 연동 후에는 내 성장 현황 페이지에서
                <br />
                단계별 체크리스트와 진행률도 함께 볼 수 있어요.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoadmapInput;
