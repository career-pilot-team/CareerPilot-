// src/routes/recommendRoutes.js
const express = require('express');
const router = express.Router();
const { getDetailedRecommendation } = require('../controllers/recommendController');

// 최종 URL: /api/recommend/detailed
router.post('/detailed', getDetailedRecommendation);

module.exports = router;