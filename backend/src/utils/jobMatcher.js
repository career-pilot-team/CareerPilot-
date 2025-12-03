function norm(s) {
  return String(s || "").trim().toLowerCase();
}

function skillScore(userSkills = [], jobSkills = []) {
  if (!Array.isArray(userSkills) || !Array.isArray(jobSkills)) return 0;
  if (!userSkills.length || !jobSkills.length) return 0;

  const u = new Set(userSkills.map(norm).filter(Boolean));
  const j = jobSkills.map(norm).filter(Boolean);

  const matched = j.filter((x) => u.has(x));
  return Math.round((matched.length / j.length) * 100); // 0~100
}

function roleScore(desiredRole = "", title = "") {
  const r = norm(desiredRole);
  const t = norm(title);
  if (!r || !t) return 0;
  return t.includes(r) ? 30 : 0;
}

module.exports = function matchJob(profile, job, jobSkills) {
  const skill = skillScore(profile?.skills || [], jobSkills || []);
  const role = roleScore(profile?.desiredRole || "", job?.title || "");

  // 총점(원하면 가중치 조절 가능)
  const totalScore = skill + role;

  return {
    totalScore,
    detail: { skill, role },
  };
};
