// src/routes/recommendRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { 
    getDetailedRecommendation,
    saveResult,
    getLatestResult,
    updateTaskStatus,
 } = require('../controllers/recommendController');

// 최종 URL: /api/recommend/detailed
router.post('/detailed', verifyToken, getDetailedRecommendation);
// AI 추천 결과 저장
router.post('/save', verifyToken, saveResult);
// AI 추천 결과 조회
router.get('/result', verifyToken, getLatestResult);
// 체크리스트 완료/취소 업데이트
router.patch('/tasks/:taskId', verifyToken, updateTaskStatus);

module.exports = router;