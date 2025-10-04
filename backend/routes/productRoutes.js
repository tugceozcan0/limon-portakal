import express from "express";
import { getProducts, buyProduct, getUserPoints } from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public rota, authentication olmadan kişinin ürünleri görmesini sağlar
router.get("/", getProducts);

// Authentication gerektiren rotalar
// Kullanıcının ürün almasını sağlar
router.post("/buy", authMiddleware, buyProduct);

// Kullanıcının puanlarını gösterir
router.get("/user-points", authMiddleware, getUserPoints);

export default router;