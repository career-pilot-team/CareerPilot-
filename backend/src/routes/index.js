// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const recommendRoutes = require('./recommendRoutes'); // ✅ AI 추천 라우트 추가

// 헬스체크용 엔드포인트
router.get('/health', (req, res) => {
  res.json({ ok: true, api: 'backend', path: '/api/health' });
});

// 라우트 등록
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/recommend', recommendRoutes); // ✅ AI 연결

module.exports = router;
