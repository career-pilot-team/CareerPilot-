// src/routes/recommendRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getDetailedRecommendation,
    saveResult,
    getLatestResult,
 } = require('../controllers/recommendController');

// 최종 URL: /api/recommend/detailed
router.post('/detailed', verifyToken, getDetailedRecommendation);
// AI 추천 결과 저장
router.post('/save', verifyToken, saveResult);
// AI 추천 결과 조회
router.get('/result', verifyToken, getLatestResult);

module.exports = router;