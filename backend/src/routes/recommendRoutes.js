// /routes/recommendRoutes.js
const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const { verifyToken } = require('../middleware/authMiddleware');

// JWT 인증을 통과한 사용자만 접근 가능
//router.post('/', verifyToken, recommendController.getRecommendation);

router.post('/', recommendController.getRecommendation); //JWT 미사용 테스트용

module.exports = router;
