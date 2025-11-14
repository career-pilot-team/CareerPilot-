// src/models/index.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

////
const profileRoutes = require('./profileRoutes');
router.use('/profile', profileRoutes);
//// 김명진 추가

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

module.exports = sequelize;
