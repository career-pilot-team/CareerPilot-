// src/routes/recommendRoutes.js
const express = require('express');
const router = express.Router();
const { getDetailedRecommendation } = require('../controllers/recommendController');

// 최종 URL: /api/recommend/detailed
router.post('/detailed', getDetailedRecommendation);
// AI 추천 결과 저장
router.post('/save', verifyToken, saveResult);

module.exports = router;