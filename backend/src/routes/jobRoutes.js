// src/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const jobController = require("../controllers/jobController");

// 🔥 1) 프로필 기반 채용 추천
router.get("/recommend", verifyToken, jobController.getJobRecommendations);

module.exports = router;
