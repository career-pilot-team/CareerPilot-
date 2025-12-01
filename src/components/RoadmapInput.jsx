// src/components/RoadmapInput.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoadmapInput = () => {
  const [major, setMajor] = useState("");
  const [desiredJob, setDesiredJob] = useState("");
  const [interestsText, setInterestsText] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      major,
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

      // 결과 페이지로 이동 + data 넘기기
      navigate("/roadmap-output", { state: { result: data } });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>로드맵 입력 페이지</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <label>전공: </label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="예: 정보통계학"
          />
        </div>

        <div style={{ marginTop: "8px" }}>
          <label>희망 직무: </label>
          <input
            type="text"
            value={desiredJob}
            onChange={(e) => setDesiredJob(e.target.value)}
            placeholder="예: 데이터 엔지니어"
          />
        </div>

        <div style={{ marginTop: "8px" }}>
          <label>관심 분야(콤마로 구분): </label>
          <input
            type="text"
            value={interestsText}
            onChange={(e) => setInterestsText(e.target.value)}
            placeholder="AI, 웹, 클라우드"
          />
        </div>

        <div style={{ marginTop: "8px" }}>
          <label>기술 스택(콤마로 구분): </label>
          <input
            type="text"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="Python, SQL, React"
          />
        </div>

        <button type="submit" style={{ marginTop: "12px" }}>
          로드맵 요청 보내기
        </button>
      </form>

      {loading && <p>AI에게 로드맵 생성 요청 중...</p>}
      {error && <p style={{ color: "red" }}>에러: {error}</p>}
    </div>
  );
};

export default RoadmapInput;
