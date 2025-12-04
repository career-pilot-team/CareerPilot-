// src/controllers/resumeController.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const UserProfile = require("../models/userProfile");
const generateResumePDF = require("../utils/pdf");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/responses";

/**
 * ===========================
 *  🔥 이력서 생성
 * ===========================
 */
exports.generateResume = async (req, res) => {
  try {
    const userId = req.userId;

    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(400).json({
        ok: false,
        error: "프로필을 먼저 입력해주세요.",
      });
    }

    // desiredRole은 기본값 없이 받기
    const desiredRole =
      req.body.desiredRole || profile.desiredRole || null;

    if (!desiredRole) {
      return res.status(400).json({
        ok: false,
        error: "희망 직무(desiredRole)를 입력하거나 프로필에 등록해주세요.",
      });
    }

    const {
      name = profile.name,
      email = profile.email,
      phone = profile.phone,
      projects = [],
      education = [],
      skills = [],
      jd = "",
    } = req.body;

    const prompt = `
아래 정보를 기반으로 이력서 JSON만 반환하세요.
설명 문장 금지. JSON 외 텍스트 금지.

출력형식:
{
  "summary": "",
  "skills": [],
  "projects": [
    { "name": "", "description": "", "tech": [] }
  ]
}

[지원직무] ${desiredRole}
[JD] ${jd}
[프로필] ${JSON.stringify(profile.toJSON(), null, 2)}
[프로젝트] ${JSON.stringify(projects, null, 2)}
[학력] ${JSON.stringify(education, null, 2)}
[스킬] ${JSON.stringify(skills, null, 2)}
    `;

    const ai = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4.1-mini",
        input: prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = ai.data.output?.[0];
    const text =
      raw?.text ||
      raw?.content?.[0]?.text ||
      "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ ok: false, error: "GPT 응답 JSON 파싱 실패" });
    }

    let resumeJSON = {};
    try {
      resumeJSON = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(500).json({ ok: false, error: "GPT JSON을 파싱할 수 없습니다." });
    }

    // PDF 생성
    const pdfFile = await generateResumePDF({
      name,
      email,
      phone,
      position: desiredRole,
      summary: resumeJSON.summary,
      skills: resumeJSON.skills,
      projects: resumeJSON.projects,
      education,
    });

    return res.json({
      ok: true,
      pdf: `/api/resume/download/${pdfFile}`,
    });

  } catch (err) {
    console.error("[generateResume error]", err);
    return res.status(500).json({
      ok: false,
      error: "이력서 생성 중 오류 발생",
    });
  }
};


/**
 * ===========================
 *  🔥 이력서 PDF 다운로드
 * ===========================
 */
exports.downloadResume = async (req, res) => {
  try {
    let { fileName } = req.params;

    // 보안 처리 (경로 공격 방지)
    fileName = path.basename(fileName);

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
      error: "파일 다운로드 중 오류 발생",
    });
  }
};
