import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); // .env dosyasını yükle

// Database için gerekli bilgileri ayarla
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false
  }
);

// Database'e bağlan
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Bağlantı başarıyla kuruldu.");
  } catch (error) {
    console.error("Database'e bağlanılamadı:", error);
  }
};

export default sequelize;
