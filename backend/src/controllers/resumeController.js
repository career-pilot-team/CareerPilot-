// src/controllers/resumeController.js
const axios = require("axios");
const UserProfile = require("../models/userProfile");
const generateResumePDF = require("../utils/pdf");

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/responses";

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

    const { name, email, phone, projects = [], education = [], skills = [], desiredRole = "Backend Developer", jd = "" } = req.body;

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

    // GPT 호출
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

    // GPT 응답 확인
    const raw = ai.data.output?.[0];
    console.log("GPT Resume Raw Output:", raw.content || raw.text);

    const text =
      raw?.text ||
      raw?.content?.[0]?.text ||
      "";

    if (!text) {
      return res.status(500).json({
        ok: false,
        error: "GPT 응답에서 텍스트를 추출할 수 없습니다.",
      });
    }

    // -----------------------------
    // 🔥 JSON만 추출 (가장 중요)
    // -----------------------------
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("No JSON found:", text);
      return res.status(500).json({
        ok: false,
        error: "GPT 응답 JSON 파싱 실패",
      });
    }

    let resumeJSON;
    try {
      resumeJSON = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("JSON parse error:", jsonMatch[0]);
      return res.status(500).json({
        ok: false,
        error: "GPT JSON을 파싱할 수 없습니다.",
      });
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
