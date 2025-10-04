import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Quiz from "./Quiz.js";

const UserAnswer = sequelize.define("UserAnswer", {
  selectedOption: { type: DataTypes.STRING, allowNull: false },
  isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
  pointsEarned: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  indexes: [
    {
      unique: true,
      fields: ['UserId', 'QuizId'] //  her kullanıcı her quiz için sadece 1 kayıt
    }
  ]
});

// İlişkiler
UserAnswer.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE", onUpdate: "CASCADE" });
UserAnswer.belongsTo(Quiz, { foreignKey: "QuizId", onDelete: "CASCADE", onUpdate: "CASCADE" });

// Ters İlişkiler
User.hasMany(UserAnswer, { foreignKey: "UserId" });
Quiz.hasMany(UserAnswer, { foreignKey: "QuizId" });

export default UserAnswer;
