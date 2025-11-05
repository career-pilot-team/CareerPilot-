// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// 회원가입
router.post('/signup', authController.signup);

// 로그인
router.post('/login', authController.login);

// 내 정보 조회 (JWT 필요)
router.get('/me', verifyToken, authController.me);

module.exports = router;
