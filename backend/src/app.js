// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // routes/index.js

const app = express();

// 김명진 추가
const { verifyToken } = require('./middleware/authMiddleware');
const profileController = require('./controllers/profileController');

app.use(cors());
app.use(express.json());

// 헬스체크용
app.get('/healthz', (req, res) => {
  res.json({ ok: true, service: 'backend' });
});

// 모든 API는 /api 아래로
app.use('/api', routes);

// 프로필 관련 API
app.post('/api/profile/me', verifyToken, profileController.upsertMyProfile);
app.get('/api/profile/me', verifyToken, profileController.getMyProfile);

module.exports = app;
