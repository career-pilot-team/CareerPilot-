// src/models/userModel.js
const bcrypt = require('bcryptjs');
const User = require('./user');

// 회원 생성 + 비밀번호 해시
exports.createUser = async ({ email, name, password }) => {
  // 1) 비밀번호 해시
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    name,
    passwordHash,
  });
  return user;
};

// 이메일로 유저 찾기
exports.findByEmail = async (email) => {
  return await User.findByEmail
    ? User.findByEmail(email)
    : User.findOne({ where: { email } });
};

// ID로 유저 찾기 (내 정보 조회)
exports.findById = async (id) => {
  return await User.findOne({
    where: { id },
    attributes: ['id', 'email', 'name', 'createdAt'],
  });
};
