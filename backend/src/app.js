// src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const routes = require('./routes'); // routes/index.js

const app = express();

app.use(cors());
app.use(express.json());

// ✅ PDF, 이미지 등 정적 파일 다운로드 경로 추가
app.use('/files', express.static(path.join(__dirname, 'files')));

// 헬스체크
app.get('/healthz', (req, res) => {
  res.json({ ok: true, service: 'backend' });
});

// 모든 API는 /api 아래로
app.use('/api', routes);

module.exports = app;
