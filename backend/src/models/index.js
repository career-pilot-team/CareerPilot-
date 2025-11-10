// 사용자 정보입력을 위한 src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');

router.get('/health', (req, res) => {
  res.json({ ok: true, api: 'backend', path: '/api/health' });
});

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes); // 추가

module.exports = router;
