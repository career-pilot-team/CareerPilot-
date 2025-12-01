const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const JobSkill = sequelize.define(
  "JobSkill",
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: "job_id" },
    skill: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "job_skills",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = JobSkill;
