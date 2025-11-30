// src/controllers/recommendController.js
const axios = require("axios");
const UserProfile = require("../models/userProfile");
const AI_API_URL = process.env.AI_API_URL || "http://ai-server:8000/ai/recommend/detailed";

// 프로필 자동 반영 + body 로직 추가
async function getDetailedRecommendation(req, res) {
  try {
    const userId = req.userId;
    // 1) DB에서 프로필 불러오기
    const profile = await UserProfile.findOne({ where: { userId } });
    // 2) body 값 (우선순위 높음)
    const {
      major: bMajor,
      desiredJob: bDesiredJob,
      interests: bInterests,
      skills: bSkills,
    } = req.body || {};
    
   // 3) body → profile 순으로 병합 (body가 있으면 override)
    const major = bMajor ?? profile?.major ?? "";
    const desiredJob = bDesiredJob ?? profile?.desiredRole ?? "";
    const interests = bInterests ?? profile?.interests ?? [];
    const skills = bSkills ?? profile?.skills ?? [];
    const { data } = await axios.post(
      AI_API_URL,
      { major, desiredJob, interests, skills },
      { timeout: 15000 }
    );
    return res.json({ ok: true, data });
  } catch (e) {
    console.error("AI service call failed:", e?.response?.data || e.message);
    return res.status(502).json({ ok: false, error: "AI service unavailable" });
  }
}

module.exports = { getDetailedRecommendation };