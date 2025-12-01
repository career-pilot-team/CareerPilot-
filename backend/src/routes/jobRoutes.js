const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const jobController = require("../controllers/jobController");

router.get("/feed", verifyToken, jobController.getJobFeed);

module.exports = router;
