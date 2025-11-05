// src/app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // routes/index.js

const app = express();

app.use(cors());
app.use(express.json());

// 헬스체크용
app.get('/healthz', (req, res) => {
  res.json({ ok: true, service: 'backend' });
});

// 모든 API는 /api 아래로
app.use('/api', routes);

module.exports = app;