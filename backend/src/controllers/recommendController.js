// src/controllers/recommendController.js
const axios = require("axios");

const AI_API_URL = process.env.AI_API_URL || "http://ai-server:8000/ai/recommend/detailed";

async function getDetailedRecommendation(req, res) {
  try {
    const { major, desiredJob, interests = [], skills = [] } = req.body || {};
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