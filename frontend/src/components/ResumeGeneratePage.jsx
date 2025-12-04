// src/components/ResumeGeneratePage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Link 같이 import
import axios from "axios";
import "./ResumeGeneratePage.css";   // 👈 이 줄 추가
import pdfImg from "../assets/pdf.png";   // ✅ 추가
import logo from "../assets/b_logo.png"; // 경로는 feature2 페이지랑 똑같이
import Footer from "./Footer";




const ResumeGeneratePage = () => {
  const navigate = useNavigate();

  // 기본 정보
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 프로젝트 (일단 1개만 – 나중에 여러 개로 확장 가능)
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectTech, setProjectTech] = useState(""); // 콤마로 구분된 문자열

  // 학력 (일단 1개만)
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [year, setYear] = useState("");

  // 스킬 / 희망 직무 / JD
  const [skillsText, setSkillsText] = useState(""); // 콤마로 구분
  const [desiredRole, setDesiredRole] = useState("");
  const [jd, setJd] = useState("");

  // 응답 상태
  const [loading, setLoading] = useState(false);
  const [pdfPath, setPdfPath] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setPdfPath("");

    try {
      // JWT 토큰 가져오기 (로그인 시 localStorage에 저장된 값)
      const token = localStorage.getItem("token");

      // Request Body (API 명세서 형식 그대로)
      const body = {
        name,
        email,
        phone,
        projects: [
          {
            name: projectName,
            description: projectDesc,
            tech: projectTech
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
          },
        ],
        education: [
          {
            school,
            degree,
            year,
          },
        ],
        skills: skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        desiredRole,
        jd,
      };

      console.log("이력서 생성 요청 바디 >>>", body);

      // 헤더 구성
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.post("/api/resume/generate", body, {
        headers,
        withCredentials: true,
      });

      console.log("이력서 생성 응답 >>>", res.data);

      if (res.data.ok && res.data.pdf) {
        // 예: "/files/resume_1764xxx.pdf"
        setPdfPath(res.data.pdf);
      } else {
        setError("이력서 생성에 실패했어요.");
      }
    } catch (err) {
      console.error(err);
      setError("이력서 생성 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  // 다운로드 버튼 핸들러
  const handleDownload = () => {
    if (!pdfPath) return;

    // 예: pdfPath = "/files/resume_1234.pdf"
    // 명세서: GET /api/resume/download/:fileName
    const fileName = pdfPath.split("/").pop(); // resume_1234.pdf
    window.location.href = `/api/resume/download/${fileName}`;
  };

  return (

     <div className="resume-page-wrapper">
      {/* 🔹 공용 헤더 복붙 */}
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
    
    <div className="resume-page">
         {/* ✅ 이력서 생성 상단 배너 이미지 */}
      <div className="resume-hero">
        <img
          src={pdfImg}
          alt="포트폴리오/이력서 안내 배너"
          className="resume-hero-image"
        />
      </div>

      <h1>이력서 생성</h1>

      <form className="resume-form" onSubmit={handleSubmit}>
        <h2>기본 정보</h2>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 정헌용"
            required
          />
        </div>
        <div>
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="예: test@test.com"
            required
          />
        </div>
        <div>
          <label>전화번호</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 010-0000-0000"
          />
        </div>

        <h2>프로젝트 (일단 1개)</h2>
        <div>
          <label>프로젝트 이름</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="예: CareerPilot"
          />
        </div>
        <div>
          <label>프로젝트 설명</label>
          <textarea
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            placeholder="예: 취업 추천 서비스"
          />
        </div>
        <div>
          <label>사용 기술 (콤마로 구분)</label>
          <input
            type="text"
            value={projectTech}
            onChange={(e) => setProjectTech(e.target.value)}
            placeholder="예: React, Node.js"
          />
        </div>

        <h2>학력 (일단 1개)</h2>
        <div>
          <label>학교</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="예: OO대학교"
          />
        </div>
        <div>
          <label>전공/학위</label>
          <input
            type="text"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            placeholder="예: 컴퓨터공학과"
          />
        </div>
        <div>
          <label>졸업 연도</label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="예: 2025"
          />
        </div>

        <h2>스킬 & 희망 직무</h2>
        <div>
          <label>스킬 (콤마로 구분)</label>
          <input
            type="text"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="예: JavaScript, Node.js, MySQL"
          />
        </div>
        <div>
          <label>희망 직무</label>
          <input
            type="text"
            value={desiredRole}
            onChange={(e) => setDesiredRole(e.target.value)}
            placeholder="예: Backend Developer"
          />
        </div>

        <h2>공고 JD (선택)</h2>
        <div>
          <label>JD 내용</label>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="복붙한 JD 내용을 넣어주세요"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "이력서 생성 중..." : "이력서 생성하기"}
        </button>
      </form>

      {/* 결과 영역 */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {pdfPath && (
        <div className="resume-result">
          <p>✅ 이력서 생성 완료!</p>
          <p>PDF 경로: {pdfPath}</p>
          <button onClick={handleDownload}>PDF 다운로드</button>
        </div>
      )}
    </div>
    <Footer />

</div>

  );
};

export default ResumeGeneratePage;
