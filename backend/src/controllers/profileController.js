// src/controllers/profileController.js
const UserProfile = require('../models/userProfile');

function toArrayMaybe(v) {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map(s => String(s).trim()).filter(Boolean);
  if (typeof v === 'string') {
    try { const p = JSON.parse(v); if (Array.isArray(p)) return p.map(s => String(s).trim()).filter(Boolean); } catch (_) {}
    return v.split(',').map(s => s.trim()).filter(Boolean);
  }
  return null;
}

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const profile = await UserProfile.findOne({ where: { userId } });
    return res.json({ profile: profile || null });
  } catch (err) {
    console.error('[getMyProfile error]', err);
    return res.status(500).json({ error: '프로필 조회 중 오류' });
  }
};

exports.upsertMyProfile = async (req, res) => {
  try {
    const userId = req.userId;
    let { major, desiredRole, interests, skills } = req.body;

    if (typeof major === 'string') major = major.trim() || null;
    if (typeof desiredRole === 'string') desiredRole = desiredRole.trim() || null;
    interests = toArrayMaybe(interests);
    skills = toArrayMaybe(skills);

    const now = new Date();
    const exists = await UserProfile.findOne({ where: { userId } });

    if (exists) {
      if (major !== undefined) exists.major = major;
      if (desiredRole !== undefined) exists.desiredRole = desiredRole;
      if (interests !== undefined) exists.interests = interests;
      if (skills !== undefined) exists.skills = skills;
      exists.updatedAt = now;
      await exists.save();
      return res.json({ ok: true, profile: exists });
    } else {
      const created = await UserProfile.create({ userId, major, desiredRole, interests, skills, createdAt: now, updatedAt: now });
      return res.json({ ok: true, profile: created });
    }
  } catch (err) {
  console.error('[upsertMyProfile error]', err);
  console.log('[upsert body]', req.body);
  console.log('[upsert userId]', req.userId);
  // 임시로 에러 상세를 응답에 포함 (나중에 지워도 됨)
  return res.status(500).json({
    error: '프로필 저장 중 오류',
    message: err.message || null,
    sql: err.parent?.sql || null,
    sqlMessage: err.parent?.sqlMessage || err.parent?.message || null,
    stack: (process.env.NODE_ENV === 'development' ? err.stack : undefined)
  });
  }
};