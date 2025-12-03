const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const JobPosting = sequelize.define(
  "JobPosting",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    company: { type: DataTypes.STRING(255), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    url: { type: DataTypes.STRING(500), allowNull: false },
    location: { type: DataTypes.STRING(200), allowNull: true },
    jobCategory: { type: DataTypes.STRING(100), allowNull: true, field: "job_category" },
    createdAt: { type: DataTypes.DATE, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, field: "updated_at" },
  },
  {
    tableName: "job_postings",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = JobPosting;
