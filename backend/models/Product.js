// Model dosyaları database'deki tablolar için blueprint oluşturur.

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  image: { type: DataTypes.STRING }, // ürün resmi URL
  pointsCost: { type: DataTypes.INTEGER, allowNull: false },
});

export default Product;