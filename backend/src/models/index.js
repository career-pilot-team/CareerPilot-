// src/models/index.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// 추천 결과 관련 모델 로딩 (새로 추가)
const RecommendResult = require('./recommendResult')(sequelize, DataTypes);
const RecommendTrack = require('./recommendTrack')(sequelize, DataTypes);
const RecommendTask = require('./recommendTask')(sequelize, DataTypes);

// 관계 설정
// 하나의 추천 결과에 여러 트랙
RecommendResult.hasMany(RecommendTrack, {
  foreignKey: 'resultId',
  as: 'tracks',
});
RecommendTrack.belongsTo(RecommendResult, {
  foreignKey: 'resultId',
  as: 'result',
});

// 하나의 트랙에 여러 태스크
RecommendTrack.hasMany(RecommendTask, {
  foreignKey: 'trackId',
  as: 'tasks',
});
RecommendTask.belongsTo(RecommendTrack, {
  foreignKey: 'trackId',
  as: 'track',
});

// 기존 코드와 호환 유지 위해 sequelize 객체에 붙여두기
sequelize.RecommendResult = RecommendResult;
sequelize.RecommendTrack = RecommendTrack;
sequelize.RecommendTask = RecommendTask;

module.exports = sequelize;
