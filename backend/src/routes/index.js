// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const recommendRoutes = require('./recommendRoutes'); 
const jobRoutes = require('./jobRoutes'); // ⭐ 신규 추가

// 헬스체크
router.get('/health', (req, res) => {
  res.json({ ok: true, api: 'backend', path: '/api/health' });
});

// 라우트 등록
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/recommend', recommendRoutes);
router.use('/jobs', jobRoutes); // ⭐ 신규 라우트 등록

module.exports = router;
