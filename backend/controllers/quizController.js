import Quiz from "../models/Quiz.js";
import User from "../models/User.js";
import UserAnswer from "../models/UserAnswer.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import { sendMail } from "../utils/mailer.js";

// Tüm soruları çekme
export const getAllQuizzes = async (req, res) => {
	try {
		const allQuizzes = await Quiz.findAll();
		res.json(allQuizzes);
	} catch (err) {
		console.error("Tüm quizler çekilirken hata oluştu:", err);
		res.status(500).json({ error: err.message });
	}
};

// Sadece kullanıcının cevaplamadığı soruları çekme
export const getQuizzes = async (req, res) => {
	try {
		const userId = req.user.id;

		const allQuizzes = await Quiz.findAll();

		const answeredQuizzes = await UserAnswer.findAll({
			where: { UserId: userId },
			attributes: ['QuizId']
		});

		const answeredQuizIds = answeredQuizzes.map(a => a.QuizId);

		const availableQuizzes = allQuizzes.filter(q => !answeredQuizIds.includes(q.id));

		res.json(availableQuizzes);
	} catch (err) {
		console.error("Mevcut quizler çekilirken hata oluştu:", err);
		res.status(500).json({ error: err.message });
	}
};

// Cevap gönderme
export const submitAnswers = async (req, res) => {
	const { answers } = req.body; 
	const userId = req.user.id;

	if (!answers || Object.keys(answers).length === 0) {
		return res.status(400).json({ error: "Cevap sağlanmadı" });
	}

    // Id'ler string olarak geldiği için onları tamsayıya dönüştürme ve onlardan array oluşturma
	const quizIds = Object.keys(answers).map(id => parseInt(id));

    // Veritabanı işlemlerini başlatma
	const transaction = await sequelize.transaction();

	try {
		// Kullanıcının daha önce cevapladığı quizleri kontrol etme
		const existingAnswers = await UserAnswer.findAll({
			where: {
				UserId: userId,
				QuizId: { [Op.in]: quizIds }
			},
			transaction
		});

		if (existingAnswers.length > 0) {
			const alreadyAnsweredIds = existingAnswers.map(a => a.QuizId);
			await transaction.rollback();
			return res.status(400).json({
				error: "Quiz daha önce tamamlanmış",
				alreadyAnswered: alreadyAnsweredIds
			});
		}

		// DB’den quizleri çekme
		const quizzes = await Quiz.findAll({
			where: { id: quizIds },
			transaction
		});

		if (quizzes.length !== quizIds.length) {
			await transaction.rollback();
			return res.status(400).json({ error: "Sağlanan quiz kimlikleri geçersiz veya mevcut değil" });
		}

		let totalPoints = 0;
		const processedAnswers = [];

		for (const quiz of quizzes) {
			const answerKeyOrValue = answers[quiz.id]; // frontend’den gelen cevap

			let selectedKey = answerKeyOrValue;
			let selectedOption;
			let correctOption;
			let isCorrect;

			if (typeof quiz.options === 'object') {
				// Yeni yapıya göre key ve stringi al
				selectedOption = quiz.options[selectedKey];
				correctOption = quiz.options[quiz.correctAnswer];
				isCorrect = selectedKey === quiz.correctAnswer;
			} else {
				// Eski yapıya göre string kontrolü
				selectedOption = answerKeyOrValue;
				correctOption = quiz.correctAnswer;
				isCorrect = selectedOption === correctOption;
				selectedKey = null; // eski quizlerde key yok
			}

			const pointsEarned = isCorrect ? (quiz.points || 10) : 0;

			console.log(`Quiz ID: ${quiz.id}, Seçilen: ${selectedKey || selectedOption} -> ${selectedOption}, Doğru: ${quiz.correctAnswer} -> ${correctOption}, Sonuç: ${isCorrect ? 'Doğru' : 'Yanlış'}, Puan: ${pointsEarned}`);

			// UserAnswer tablosuna kaydet
			await UserAnswer.create({
				UserId: userId,
				QuizId: quiz.id,
				selectedOption: selectedKey || selectedOption,
				isCorrect,
				pointsEarned
			}, { transaction });

			processedAnswers.push({
				quizId: quiz.id,
				selectedKey,
				selectedOption,
				correctKey: quiz.correctAnswer,
				correctOption,
				isCorrect,
				points: pointsEarned
			});

			totalPoints += pointsEarned;
		}

		// Kullanıcı puanını güncelle
		const user = await User.findByPk(userId, { transaction });
		if (!user) {
			await transaction.rollback();
			return res.status(404).json({ error: "Kullanıcı bulunamadı" });
		}
		user.points = (user.points || 0) + totalPoints;
		await user.save({ transaction });

		await transaction.commit();

		res.json({
			msg: "Quiz başarıyla gönderildi",
			totalPoints,
			currentPoints: user.points,
			results: processedAnswers,
			answersProcessed: processedAnswers.length
		});

	} catch (err) {
		await transaction.rollback();
		console.error("submitAnswers fonskiyonunda hata:", err);
		res.status(500).json({ error: err.message });
	}
};


// Sadece adminin çalıştırabildiği quiz üretme fonksiyonu
export const createQuiz = async (req, res) => {
	try {
		// req.body'nin dizi olup olmadığını kontrol et
		const quizzesData = Array.isArray(req.body) ? req.body : [req.body];
		
		if (quizzesData.length === 0) {
			return res.status(400).json({ error: "Oluşturulacak quiz verisi sağlanmadı." });
		}

		// Bir veya birden fazla quiz oluşturma
		const newQuizzes = await Quiz.bulkCreate(quizzesData.map(q => ({
			question: q.question,
			options: q.options,
			correctAnswer: q.correctAnswer,
			points: q.points || 10 // Puan belirtilmemişse 10 varsayılır
		})));

        // Mail atabilmek için tüm e-postaları bulur
		const users = await User.findAll({ attributes: ["email"] });
		
		const quizCount = newQuizzes.length;
		const quizTitles = newQuizzes.map(q => `"${q.question}"`).join(', ');

		// Gönderilecek e-mailin başlığı ve devamında içeriği
		const emailSubject = quizCount > 1 
			? `${quizCount} Adet Yeni Soru Yayında!` 
			: "Yeni Soru Yayında!";

		const emailBody = quizCount > 1 
			? `Merhaba! Toplam ${quizCount} yeni soru eklendi. Başlıklar: ${quizTitles}. Hemen çöz ve puan kazan!`
			: `Merhaba! Yeni bir quiz sorusu eklendi: "${newQuizzes[0].question}". Hemen çöz ve puan kazan!`;

        // Mail gönderme
		for (const user of users) {
			await sendMail(user.email, emailSubject, emailBody);
		}

		res.status(201).json({ 
			msg: `${quizCount} adet quiz oluşturuldu ve ${users.length} kullanıcıya bildirim e-postaları gönderildi.`, 
			quizzes: newQuizzes.map(q => ({ id: q.id, question: q.question })) 
		});
	} catch (err) {
		console.error("Quiz(ler) oluşturulurken hata oluştu:", err);
		res.status(500).json({ error: err.message });
	}
};
