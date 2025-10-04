import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Quiz = sequelize.define("Quiz", {
  question: { type: DataTypes.TEXT, allowNull: false },
  options: { type: DataTypes.JSON, allowNull: false },   // Soruların şıkları json formatında olmak zorunda
  correctAnswer: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER, defaultValue: 10 }, 
  publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Quiz;
