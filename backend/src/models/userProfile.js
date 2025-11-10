// src/models/userProfile.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const UserProfile = sequelize.define('UserProfile', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
  major: { type: DataTypes.STRING(100), allowNull: true },
  desiredRole: { type: DataTypes.STRING(100), allowNull: true, field: 'desired_role' },
  interests: { type: DataTypes.JSON, allowNull: true },
  skills: { type: DataTypes.JSON, allowNull: true },
  createdAt: { type: DataTypes.DATE, field: 'created_at' },
  updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
}, {
  tableName: 'user_profiles',
  freezeTableName: true,
  timestamps: false,
});

module.exports = UserProfile;

