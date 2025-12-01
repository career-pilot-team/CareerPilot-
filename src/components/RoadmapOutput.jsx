// src/components/RoadmapOutput.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RoadmapOutput = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Input 페이지에서 넘긴 데이터
  const result = location.state?.result;

  // 새로고침해서 state 날아간 경우 대비
  if (!result) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>로드맵 결과를 찾을 수 없어요</h1>
        <button onClick={() => navigate("/")}>다시 입력하러 가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>AI 로드맵 결과</h1>

      {/* n1 → n2 → n3 요약 */}
      <p>
        <strong>로드맵 요약:</strong>{" "}
        {result.roadmap &&
          result.roadmap.map((_, idx) => `n${idx + 1}`).join(" → ")}
      </p>

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{ marginBottom: "16px" }}
      >
        다시 입력하기
      </button>

      <p>
        <strong>추천 직무:</strong> {result.refinedJob}</p>

      <p><strong>추천 자격증:</strong></p>
      <ul>
        {result.certifications?.map((c, idx) => (
          <li key={idx}>{c}</li>
        ))}
      </ul>

      <p><strong>추천 기술 스택:</strong></p>
      <ul>
        {result.techStack?.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>

      <p><strong>로드맵:</strong></p>
      <ol>
        {result.roadmap?.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RoadmapOutput;
