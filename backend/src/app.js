// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // routes/index.js

const app = express();

const { verifyToken } = require('./middleware/authMiddleware');             // 김명진 추가
const profileController = require('./controllers/profileController');       // 김명진 추가

app.use(cors());
app.use(express.json());

// 헬스체크용
app.get('/healthz', (req, res) => {
  res.json({ ok: true, service: 'backend' });
});

// 모든 API는 /api 아래로
app.use('/api', routes);

app.post('/api/profile/me', verifyToken, profileController.upsertMyProfile); // 김명진 추가
app.get('/api/profile/me', verifyToken, profileController.getMyProfile); // 김명진 추가
module.exports = app;