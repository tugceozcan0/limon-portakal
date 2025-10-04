import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; 

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  points: { type: DataTypes.INTEGER, defaultValue: 0 },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user"}   // admin rolü zaten seed dosyasında hazırlanıyor
});

export default User;
