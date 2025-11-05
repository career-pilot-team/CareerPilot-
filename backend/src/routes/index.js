// src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

router.get('/health', (req, res) => {
  res.json({ ok: true, api: 'backend', path: '/api/health' });
});

router.use('/auth', authRoutes); // /api/auth/*

module.exports = router;

