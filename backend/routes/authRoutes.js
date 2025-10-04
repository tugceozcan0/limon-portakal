// API içerisindeki doğru yönlendirmeleri router dosylarıyla yapıyoruz

import express from "express";
import { register, login } from "../controllers/authController.js";

// Router objesini oluşturma
const router = express.Router();

// Kimlik doğrulama rotaları

// Kayıt yapma durumunda kullanıcı bu endpoint'e POST atar
router.post("/register", register);

// Giriş yapma durumunda kullanıcı bu endpoint'e POST atar
router.post("/login", login);

export default router;
