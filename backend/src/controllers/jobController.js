const axios = require("axios");
const UserProfile = require("../models/userProfile");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = "https://api.openai.com/v1/responses";

// ------------------------------------------------------
// 🔥 프로필 기반 채용 공고 추천 (Responses API + web_search 완전체)
// ------------------------------------------------------
exports.getJobRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    const profile = await UserProfile.findOne({ where: { userId } });
    if (!profile) {
      return res.status(400).json({
        ok: false,
        error: "프로필을 먼저 작성해주세요.",
      });
    }

    const { major, desiredRole, skills = [], interests = [] } = profile;

    // 검색 키워드 구성
    const keywords = [
      desiredRole,
      major,
      ...(skills || []),
      ...(interests || [])
    ]
      .filter(Boolean)
      .slice(0, 6)
      .join(" ");

    if (!keywords) {
      return res.status(400).json({
        ok: false,
        error: "검색 키워드를 생성할 수 없습니다.",
      });
    }

    // ---------------------------
    // 🔥 OpenAI Responses API 요청
    // ---------------------------
    const openaiRes = await axios.post(
      OPENAI_URL,
      {
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "당신은 실제 웹을 검색하여 한국의 최신 채용 공고를 찾아주는 AI 어시스턴트입니다."
          },
          {
            role: "user",
            content: `
"${keywords}" 관련 한국 채용공고(사람인, 잡코리아, 원티드)에서 실제 URL을 포함한 정보를 찾아라.

아래 JSON 형식으로만 출력해라:

{
  "jobs": [
    {
      "title": "",
      "company": "",
      "url": "",
      "description": "",
      "skills": []
    }
  ]
}
            `
          }
        ],
        tools: { web_search: { enable: true } }
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ---------------------------
    // 🔥 GPT 응답에서 text 추출
    // ---------------------------
    const text =
      openaiRes.data.output?.[0]?.content?.[0]?.text ??
      openaiRes.data.output_text ??
      "";

    if (!text) {
      console.log("GPT 응답 전체:", openaiRes.data);
      return res.status(500).json({
        ok: false,
        error: "GPT 응답에서 텍스트를 읽을 수 없습니다.",
      });
    }

    // ---------------------------
    // 🔥 JSON 파싱
    // ---------------------------
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("GPT JSON 파싱 실패:", text);
      return res.status(500).json({
        ok: false,
        error: "GPT 응답 JSON 파싱 실패",
      });
    }

    const jobs = parsed.jobs || [];

    // ---------------------------
    // 🔥 Match Score 계산
    // ---------------------------
    const lowerSkills = (skills || []).map(s => s.toLowerCase());

    const scored = jobs.map(job => {
      const jobSkills = (job.skills || []).map(s => s.toLowerCase());
      const matched = jobSkills.filter(s => lowerSkills.includes(s));

      const score =
        jobSkills.length > 0
          ? Math.round((matched.length / jobSkills.length) * 100)
          : 0;

      return {
        ...job,
        matchScore: score,
        matchedSkills: matched,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      ok: true,
      keywords,
      recommendations: scored,
    });

  } catch (e) {
    console.error("[getJobRecommendations error]", e?.response?.data || e);
    return res.status(500).json({
      ok: false,
      error: "채용 공고 추천 중 오류가 발생했습니다.",
    });
  }
};
