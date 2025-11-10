// src/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/me', verifyToken, profileController.getMyProfile);
router.post('/me', verifyToken, profileController.upsertMyProfile);

module.exports = router;
