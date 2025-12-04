// src/routes/resumeRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

const resumeController = require("../controllers/resumeController");

router.post("/generate", verifyToken, resumeController.generateResume);

module.exports = router;
