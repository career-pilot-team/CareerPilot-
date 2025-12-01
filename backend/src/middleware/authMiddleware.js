// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // "Bearer xxx"

  if (!authHeader) {
    return res.status(401).json({ error: '토큰이 필요합니다.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: '유효하지 않은 토큰 형식입니다.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
     req.userId = decoded.userId ?? decoded.id;   // 페이로드 키 호환 위해 김명진 추가
    next();
  } catch (err) {
    console.error('[verifyToken error]', err);
    return res.status(403).json({ error: '토큰이 유효하지 않습니다.' });
  }
};
