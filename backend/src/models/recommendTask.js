// src/models/recommendTask.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RecommendTask = sequelize.define('RecommendTask', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  trackId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'track_id',
  },
  label: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  orderNo: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'order_no',
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  tableName: 'recommend_tasks',
  freezeTableName: true,
  timestamps: false,
});

module.exports = RecommendTask;
