// src/models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: 'users_email_unique',
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  // JS 속성 이름은 passwordHash, 실제 DB 컬럼은 password_hash
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash',
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
}, {
  tableName: 'users',
  freezeTableName: true,
  timestamps: false,   // created_at만 있고 updated_at은 없는 상태라고 가정
});

module.exports = User;
