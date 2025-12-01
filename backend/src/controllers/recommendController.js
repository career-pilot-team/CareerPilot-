// src/controllers/recommendController.js
const axios = require("axios");
const UserProfile = require("../models/userProfile");
// 새로 추가: 추천 결과 저장용 모델
const sequelize = require("../db");
const RecommendResult = require("../models/recommendResult");
const RecommendTrack = require("../models/recommendTrack");
const RecommendTask = require("../models/recommendTask");

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
    
    // 3) body → profile 순으로 병합
    const major = bMajor ?? profile?.major ?? "";
    const desiredJob = bDesiredJob ?? profile?.desiredRole ?? "";
    const interests = bInterests ?? profile?.interests ?? [];
    const skills = bSkills ?? profile?.skills ?? [];
    
    // 추가: 프로필도 없고 body도 비어있으면 안내
    if (!major && !desiredJob && (!interests?.length) && (!skills?.length)) {
      return res.status(400).json({
        ok: false,
        error: "프로필이 없습니다. 먼저 프로필을 작성하세요."
      });
    }

    // 4) AI 서버 호출
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

/**
 *  새로 구현: AI 추천 결과를 DB에 저장하는 API
 * - 요청 바디에는 AI 응답 JSON 그대로 온다고 가정
 * - 로그인된 유저 기준으로 recommend_results / tracks / tasks에 insert
 */
async function saveResult(req, res) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
  }

  const {
    refinedJob = "",
    certifications = [],
    techStack = [],
    roadmap = [],
    nodes = [],
    tracks = [],
  } = req.body || {};

  // 최소한 뭔가 내용은 있어야 저장
  if (
    !refinedJob &&
    (!Array.isArray(roadmap) || roadmap.length === 0) &&
    (!Array.isArray(tracks) || tracks.length === 0)
  ) {
    return res
      .status(400)
      .json({ ok: false, error: "저장할 추천 결과 데이터가 비어 있습니다." });
  }

  const t = await sequelize.transaction();
  const now = new Date();

  try {
    // 1) recommend_results에 저장 (메인 결과)
    const result = await RecommendResult.create(
      {
        userId,
        refinedJob,
        certifications,
        techStack,
        roadmap,
        nodes,
        createdAt: now,
        updatedAt: now,
      },
      { transaction: t }
    );

    // 2) tracks + tasks 저장
    if (Array.isArray(tracks)) {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        if (!track) continue;

        const trackRow = await RecommendTrack.create(
          {
            resultId: result.id,
            title: track.title || "",
            orderIndex: i, // 순서용
            createdAt: now,
            updatedAt: now,
          },
          { transaction: t }
        );

        const tasks = Array.isArray(track.tasks) ? track.tasks : [];
        for (let j = 0; j < tasks.length; j++) {
          const task = tasks[j];
          if (!task) continue;

          await RecommendTask.create(
            {
              trackId: trackRow.id,
              label: task.label || "",
              orderIndex: j,
              // 처음 저장할 때는 전부 미완료 상태
              isDone: false,
              createdAt: now,
              updatedAt: now,
            },
            { transaction: t }
          );
        }
      }
    }

    await t.commit();
    return res.json({ ok: true, resultId: result.id });
  } catch (err) {
    await t.rollback();
    console.error("[saveResult error]", err);
    return res
      .status(500)
      .json({ ok: false, error: "추천 결과 저장 중 오류가 발생했습니다." });
  }
}

module.exports = { getDetailedRecommendation, saveResult, };