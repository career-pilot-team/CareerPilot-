// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const recommendRoutes = require('./recommendRoutes'); 
const jobRoutes = require('./jobRoutes'); // ⭐ 신규 추가
const resumeRoutes = require("./resumeRoutes");
const taskRoutes = require('./taskRoutes'); // ✅ 만듦: 체크리스트 저장

// 헬스체크
router.get('/health', (req, res) => {
  res.json({ ok: true, api: 'backend', path: '/api/health' });
});

// 라우트 등록
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/recommend', recommendRoutes);
router.use('/jobs', jobRoutes); // ⭐ 신규 라우트 등록
router.use("/resume", resumeRoutes);
router.use('/tasks', taskRoutes); //만듦: 체크리스트 저장

module.exports = router;
