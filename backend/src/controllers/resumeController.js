const axios = require("axios");
const UserProfile = require("../models/userProfile");
const generateResumePDF = require("../utils/pdf");
const path = require("path");
const fs = require("fs");

// FastAPI 서버 주소 (Docker 환경이면 서비스명 사용)
const FASTAPI_URL = process.env.FASTAPI_URL || "http://career-ai:8000";

exports.generateResume = async (req, res) => {
  try {
    const userId = req.userId;

    // 유저 프로필 조회
    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(400).json({
        ok: false,
        error: "프로필을 먼저 입력해주세요.",
      });
    }

    const desiredRole = req.body.desiredRole || profile.desiredRole;
    if (!desiredRole) {
      return res.status(400).json({
        ok: false,
        error: "희망 직무(desiredRole)를 입력하거나 프로필에 등록해주세요.",
      });
    }

    // 프론트 요청 데이터
    const {
      name = profile.name,
      email = profile.email,
      phone = profile.phone,
      projects = [],
      education = [],
      skills = [],
      jd = "",
    } = req.body;

    // 🔥 FastAPI 로 JSON Resume 생성 요청
    const ai = await axios.post(`${FASTAPI_URL}/ai/resume/generate`, {
    name,
    email,
    phone,
    desiredRole,
    projects,
    education,
    skills,
    jd,
});


    const resumeJSON = ai.data;
    console.log("AI Resume JSON:", resumeJSON);

    // PDF 생성
    const pdfFile = await generateResumePDF({
      name,
      email,
      phone,
      position: desiredRole,
      summary: resumeJSON.summary,
      skills: resumeJSON.skills || [],
      projects: resumeJSON.projects || [],
      education,
    });

    return res.json({
      ok: true,
      pdf: `/files/${pdfFile}`,
    });
  } catch (err) {
    console.error("[generateResume error]", err);
    return res.status(500).json({
      ok: false,
      error: "이력서 생성 중 오류 발생",
    });
  }
};

// ---------------------------------------------------------
// 🔥 PDF 파일 다운로드
// ---------------------------------------------------------
exports.downloadResume = (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, "../../uploads/resumes", fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        ok: false,
        error: "파일을 찾을 수 없습니다.",
      });
    }

    return res.download(filePath);
  } catch (err) {
    console.error("[downloadResume error]", err);
    return res.status(500).json({
      ok: false,
      error: "파일 다운로드 실패",
    });
  }
};
