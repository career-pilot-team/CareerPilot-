// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email과 password는 필수입니다.' });
    }
    // 1) 이미 존재하는 이메일인지 확인
    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: '이미 가입된 이메일입니다.' });
    }

    // 2) userModel이 해시 + INSERT까지 담당
    const user = await User.create({
      email,
      name: name,
      password,
    });

    return res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      userId: user.id,
    });
  } catch (err) {
    console.error('[signup error]', err);
    return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
};

// 로그인
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email과 password는 모두 필요합니다.' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    // 비밀번호 비교 (plain vs hash)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('[login error]', err);
    return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
};

// 내 정보 조회
exports.me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: '인증 정보가 없습니다.' });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    return res.json({ user });
  } catch (err) {
    console.error('[me error]', err);
    return res.status(500).json({ error: '내 정보 조회 중 오류가 발생했습니다.' });
  }
};
