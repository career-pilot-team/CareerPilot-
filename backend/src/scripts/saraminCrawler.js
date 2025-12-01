// src/scripts/saraminCrawler.js
require("dotenv").config();
const axios = require("axios");

const JobPosting = require("../models/jobPosting");
const JobSkill = require("../models/jobSkill");

function parseKeywordToSkills(keyword) {
  // 가이드 샘플: "SI·시스템통합,Excel·도표,PowerPoint"
  if (!keyword) return [];
  return String(keyword)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
}

async function fetchSaraminJobs({ start = 0, count = 50, keywords = "" }) {
  const accessKey = process.env.SARAMIN_API_KEY;
  if (!accessKey) throw new Error("SARAMIN_API_KEY가 .env에 없습니다.");

  const { data } = await axios.get("https://oapi.saramin.co.kr/job-search", {
    headers: { Accept: "application/json" }, // ✅ 가이드: JSON 응답
    params: {
      "access-key": accessKey,               // ✅ 가이드 파라미터명
      keywords,                              // ✅ 키워드 검색
      start,                                 // ✅ 0 기반
      count,                                 // ✅ 최대 110
      sort: "pd",                            // ✅ 게시일 역순(기본)
      fields: "posting-date expiration-date keyword-code count", // ✅ 있으면 편함
    },
    timeout: 15000,
  });

  // 에러 응답: { code, message }
  if (data?.code && data?.message) {
    throw new Error(`Saramin API error ${data.code}: ${data.message}`);
  }

  const jobs = data?.jobs?.job;
  return Array.isArray(jobs) ? jobs : jobs ? [jobs] : [];
}

async function saveJobsToDB(jobs) {
  const now = new Date();

  for (const j of jobs) {
    const url = j?.url;
    if (!url) continue;

    const exists = await JobPosting.findOne({ where: { url } });
    if (exists) continue;

    const company = j?.company?.detail?.name || "알 수 없음";
    const title = j?.position?.title || "제목 없음";
    const location = j?.position?.location?.name || null;

    // jobCategory는 사람인 직무명(상위 직무명 등)으로 넣어두면 필터링에 도움
    const jobCategory = j?.position?.["job-mid-code"]?.name || null;

    const keyword = j?.keyword || "";
    const skills = parseKeywordToSkills(keyword);

    const posting = await JobPosting.create({
      company,
      title,
      description: null, // 사람인 API에 상세 JD가 항상 있진 않아서 안전하게 null
      url,
      location,
      jobCategory,
      createdAt: now,
      updatedAt: now,
    });

    for (const s of skills) {
      await JobSkill.create({ jobId: posting.id, skill: s });
    }
  }
}

async function run() {
  try {
    const keywords =
      process.env.SARAMIN_DEFAULT_KEYWORDS ||
      "백엔드,프론트엔드,개발자,Python,Java,React,Node";

    const jobs = await fetchSaraminJobs({ start: 0, count: 50, keywords });
    await saveJobsToDB(jobs);

    console.log(`✅ Saramin jobs saved: ${jobs.length}`);
  } catch (e) {
    console.error("❌ saraminCrawler failed:", e.message);
    process.exitCode = 1;
  }
}

run();
