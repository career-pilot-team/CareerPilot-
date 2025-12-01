// src/models/recommendTrack.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const RecommendTrack = sequelize.define('RecommendTrack', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  resultId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'result_id',
  },
  // 프론트 tracks[*].id 같은 값이 들어갈 수 있는 키 (없으면 null)
  trackKey: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'track_key',
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  orderNo: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'order_no',
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
  tableName: 'recommend_tracks',
  freezeTableName: true,
  timestamps: false,
});

module.exports = RecommendTrack;
