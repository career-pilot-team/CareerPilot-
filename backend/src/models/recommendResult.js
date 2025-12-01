// src/models/recommendResult.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RecommendResult = sequelize.define('RecommendResult', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'user_id',
  },
  major: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  desiredJob: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'desired_job',
  },
  refinedJob: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'refined_job',
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  techStack: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'tech_stack',
  },
  roadmap: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  nodes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'recommend_results',
  freezeTableName: true,
  timestamps: false,
});

module.exports = RecommendResult;
