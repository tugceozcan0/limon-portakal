import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Modelleri import et
import User from "./models/User.js";
import Quiz from "./models/Quiz.js";
import Product from "./models/Product.js";
import UserAnswer from "./models/UserAnswer.js";

import seedUsers from "./seed/userSeed.js";
import seedProducts from "./seed/productSeed.js";
import seedQuizzes from "./seed/quizSeed.js";

// İlişkileri tanımla

Quiz.hasMany(UserAnswer, { onDelete: "CASCADE" });
UserAnswer.belongsTo(Quiz);

User.hasMany(UserAnswer, { onDelete: "CASCADE" });
UserAnswer.belongsTo(User);

// DB senkronizasyonu
sequelize.sync({ alter: true })
  .then(async () => {
    console.log("Tablolar senkronize edildi!");

    // seed fonksiyonları çağırılıyor
    await seedUsers();
    await seedProducts();
    await seedQuizzes();
  })
  .catch(err => console.error("DB Sync Hatası:", err));

// Routes
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import productRoutes from "./routes/productRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
