// src/controllers/recommendController.js
const axios = require("axios");
const UserProfile = require("../models/userProfile");
const sequelize = require("../db");
const RecommendResult = require("../models/recommendResult");
const RecommendTrack = require("../models/recommendTrack");
const RecommendTask = require("../models/recommendTask");

const AI_API_URL =
  process.env.AI_API_URL || "http://ai-server:8000/ai/recommend/detailed";

// -----------------------------
// 1) 상세 추천 생성 (AI 서버 호출)
// -----------------------------
async function getDetailedRecommendation(req, res) {
  try {
    const userId = req.userId;

    const profile = await UserProfile.findOne({ where: { userId } });

    const {
      major: bMajor,
      desiredJob: bDesiredJob,
      interests: bInterests,
      skills: bSkills,
    } = req.body || {};

    const major = bMajor ?? profile?.major ?? "";
    const desiredJob = bDesiredJob ?? profile?.desiredRole ?? "";
    const interests = bInterests ?? profile?.interests ?? [];
    const skills = bSkills ?? profile?.skills ?? [];

    if (!major && !desiredJob && (!interests?.length) && (!skills?.length)) {
      return res.status(400).json({
        ok: false,
        error: "프로필이 없습니다. 먼저 프로필을 작성하세요.",
      });
    }

    const { data } = await axios.post(
      AI_API_URL,
      { major, desiredJob, interests, skills },
      { timeout: 15000 }
    );

    return res.json({ ok: true, data });
  } catch (e) {
    console.error("AI service call failed:", e?.response?.data || e.message);
    return res
      .status(502)
      .json({ ok: false, error: "AI service unavailable" });
  }
}

// -----------------------------
// 2) 추천 결과 저장 (result + tracks + tasks)
// -----------------------------
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

  if (
    !refinedJob &&
    (!Array.isArray(roadmap) || roadmap.length === 0) &&
    (!Array.isArray(tracks) || tracks.length === 0)
  ) {
    return res.status(400).json({
      ok: false,
      error: "저장할 추천 결과 데이터가 비어 있습니다.",
    });
  }

  const t = await sequelize.transaction();
  const now = new Date();

  try {
    // 1) recommend_results 에 메인 결과 저장
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

        // Track 한 줄 insert (RecommendTrack)
        const trackRow = await RecommendTrack.create(
          {
            resultId: result.id,
            trackKey: track.id || null, // 프론트에서 온 id (있으면)
            title: track.title || "",
            orderNo: i, // 정렬용
            createdAt: now,
            updatedAt: now,
          },
          { transaction: t }
        );

        // 그 아래에 Task들 insert (RecommendTask)
        const tasks = Array.isArray(track.tasks) ? track.tasks : [];
        for (let j = 0; j < tasks.length; j++) {
          const task = tasks[j];
          if (!task) continue;

          await RecommendTask.create(
            {
              trackId: trackRow.id,
              label: task.label || "",
              orderNo: j, // 정렬용
              done: false, // 모델 상 필드는 done
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
    return res.status(500).json({
      ok: false,
      error: "추천 결과 저장 중 오류가 발생했습니다.",
    });
  }
}

// -----------------------------
// 3) 최신 추천 결과 조회
// -----------------------------
async function getLatestResult(req, res) {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
  }

  try {
    // 1) 가장 최근 RecommendResult 1개
    const result = await RecommendResult.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!result) {
      return res.json({ ok: true, result: null });
    }

    // 2) 해당 result의 트랙들
    const tracks = await RecommendTrack.findAll({
      where: { resultId: result.id },
      order: [["orderNo", "ASC"], ["id", "ASC"]],
    });

    const trackIds = tracks.map((t) => t.id);

    // 3) 각 트랙의 태스크들
    let tasks = [];
    if (trackIds.length > 0) {
      tasks = await RecommendTask.findAll({
        where: { trackId: trackIds },
        order: [["orderNo", "ASC"], ["id", "ASC"]],
      });
    }

    // 4) 트랙별로 tasks 매핑
    const tracksWithTasks = tracks.map((track) => ({
      id: track.id,
      title: track.title,
      orderIndex: track.orderNo, // 프론트 호환을 위해 orderIndex 로 내려줌
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
      tasks: tasks
        .filter((task) => task.trackId === track.id)
        .map((task) => ({
          id: task.id,
          label: task.label,
          orderIndex: task.orderNo, // 프론트에선 orderIndex 사용
          isDone: task.done, // DB 필드명은 done
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        })),
    }));

    return res.json({
      ok: true,
      result: {
        id: result.id,
        refinedJob: result.refinedJob,
        certifications: result.certifications || [],
        techStack: result.techStack || [],
        roadmap: result.roadmap || [],
        nodes: result.nodes || [],
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        tracks: tracksWithTasks,
      },
    });
  } catch (err) {
    console.error("[getLatestResult error]", err);
    return res.status(500).json({
      ok: false,
      error: "추천 결과 조회 중 오류가 발생했습니다.",
    });
  }
}

// -----------------------------
// 4) 체크리스트 완료/취소 토글
// -----------------------------
async function updateTaskStatus(req, res) {
  const userId = req.userId;
  const taskId = parseInt(req.params.taskId, 10);

  if (!userId) {
    return res.status(401).json({ ok: false, error: "로그인이 필요합니다." });
  }

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return res
      .status(400)
      .json({ ok: false, error: "유효한 taskId가 아닙니다." });
  }

  const { isDone } = req.body || {};

  if (typeof isDone !== "boolean") {
    return res.status(400).json({
      ok: false,
      error: "isDone 필드는 true/false(Boolean) 형태여야 합니다.",
    });
  }

  try {
    const task = await RecommendTask.findByPk(taskId);
    if (!task) {
      return res.status(404).json({
        ok: false,
        error: "해당 체크리스트 항목을 찾을 수 없습니다.",
      });
    }

    const track = await RecommendTrack.findByPk(task.trackId);
    if (!track) {
      return res.status(404).json({
        ok: false,
        error: "해당 체크리스트가 속한 트랙을 찾을 수 없습니다.",
      });
    }

    const result = await RecommendResult.findOne({
      where: { id: track.resultId, userId },
    });

    if (!result) {
      return res.status(403).json({
        ok: false,
        error: "이 체크리스트를 수정할 권한이 없습니다.",
      });
    }

    // DB 필드명은 done
    task.done = isDone;
    task.updatedAt = new Date();
    await task.save();

    return res.json({
      ok: true,
      task: {
        id: task.id,
        trackId: task.trackId,
        label: task.label,
        orderIndex: task.orderNo,
        isDone: task.done,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });
  } catch (err) {
    console.error("[updateTaskStatus error]", err);
    return res.status(500).json({
      ok: false,
      error: "체크리스트 상태 업데이트 중 오류가 발생했습니다.",
    });
  }
}

module.exports = {
  getDetailedRecommendation,
  saveResult,
  getLatestResult,
  updateTaskStatus,
};
