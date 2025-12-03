const JobPosting = require("../models/jobPosting");
const JobSkill = require("../models/jobSkill");
const UserProfile = require("../models/userProfile");
const matchJob = require("../utils/jobMatcher");

exports.getJobFeed = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await UserProfile.findOne({ where: { userId } });

    if (!profile) {
      return res.status(400).json({ ok: false, error: "프로필을 먼저 작성해주세요." });
    }

    const jobs = await JobPosting.findAll({
      order: [["id", "DESC"]],
      limit: 50,
    });

    const jobIds = jobs.map((j) => j.id);
    const records = jobIds.length
      ? await JobSkill.findAll({ where: { jobId: jobIds } })
      : [];

    const skillMap = {};
    for (const r of records) {
      if (!skillMap[r.jobId]) skillMap[r.jobId] = [];
      skillMap[r.jobId].push(r.skill);
    }

    const feed = jobs
      .map((job) => {
        const skills = skillMap[job.id] || [];
        const score = matchJob(profile, job, skills);
        return {
          ...job.toJSON(),
          skills,
          matchScore: score.totalScore,
          detailScore: score.detail,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    return res.json({ ok: true, feed });
  } catch (err) {
    console.error("[getJobFeed error]", err);
    return res.status(500).json({ ok: false, error: "채용 공고 추천 실패" });
  }
};
