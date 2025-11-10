// src/routes/index.js
const express = require('express');
const router = express.Router();

// 각 기능 라우트 불러오기
const authRoutes = require('./authRoutes');
//const userRoutes = require('./userRoutes');
const recommendRoutes = require('./recommendRoutes'); // ✅ 추가
//const statsRoutes = require('./statsRoutes');

// 각 라우트 경로 등록
router.use('/auth', authRoutes);
//router.use('/users', userRoutes);
router.use('/recommend', recommendRoutes); // ✅ 이 한 줄로 AI 연결 완료
//router.use('/stats', statsRoutes);

module.exports = router;
