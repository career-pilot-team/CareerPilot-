// src/routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const resumeController = require("../controllers/resumeController");

// 이력서 생성
router.post("/generate", verifyToken, resumeController.generateResume);

// PDF 다운로드
router.get("/download/:fileName", resumeController.downloadResume);

module.exports = router;
