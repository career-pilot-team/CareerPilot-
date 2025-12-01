// src/scripts/jobCrawler.js
const axios = require("axios");
const JobPosting = require("../models/jobPosting");
const JobSkill = require("../models/jobSkill");

async function crawlWanted() {
  try {
    const wantedUrl = "https://www.wanted.co.kr/api/v4/jobs"; // 예시

    const { data } = await axios.get(wantedUrl);

    for (const job of data.data) {
      // 중복 방지
      const exists = await JobPosting.findOne({ where: { url: job.link } });
      if (exists) continue;

      const posting = await JobPosting.create({
        company: job.company_name,
        title: job.position,
        description: job.detail,
        url: job.link,
        location: job.location,
        jobCategory: job.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (job.skill_tags) {
        for (const skill of job.skill_tags) {
          await JobSkill.create({ jobId: posting.id, skill });
        }
      }
    }

    console.log("크롤링 완료");
  } catch (e) {
    console.error("크롤링 실패:", e.message);
  }
}

crawlWanted();
