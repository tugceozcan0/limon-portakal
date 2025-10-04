import express from "express";
import { createQuiz, getQuizzes, getAllQuizzes, submitAnswers } from "../controllers/quizController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Kullanıcı için cevaplanmamış mevcut quizleri getirir
router.get("/", authMiddleware, getQuizzes);

// Quiz cevaplarını gönderir
router.post("/submit", authMiddleware, submitAnswers);

// Admin Rotaları

// Yeni quiz oluşturur
// Önce authentication sonraysa admin olmduğunun doğrulanması ardından kişi quiz yayınlayabilir
router.post("/create", authMiddleware, adminMiddleware, createQuiz);

// Tüm quizleri getirir 
router.get("/all", authMiddleware, adminMiddleware, getAllQuizzes);

export default router;