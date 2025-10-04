import Quiz from "../models/Quiz.js";

const quizData = [
  {
    question: "Limon kaç yaşındadır?",
    options: { "a": "1", "b": "3", "c": "5", "d": "7" },
    correctAnswer: "d",
    points: 5
  },
  {
    question: "Portakal kaç yaşındadır?",
    options: { "a": "1", "b": "3", "c": "5", "d": "7" },
    correctAnswer: "b",
    points: 5
  },
  {
    question: "Limon'un ilk ve son öğrendiği kelimeler nelerdir?",
    options: { "a": "Cici kuş - Merhaba", "b": "Cici kuş - Cici kuş", "c": "Limon - Tuğçe", "d": "Limon - Naber?" },
    correctAnswer: "b",
    points: 10
  },
  {
    question: "Emre, Portakal'la nerede tanıştı?",
    options: { "a": "Sahilde", "b": "Evinin Bahçesinde", "c": "Sokakta", "d": "Çöpte" },
    correctAnswer: "a",
    points: 10
  },
  {
    question: "Limon nerelidir?",
    options: { "a": "Muğla", "b": "İstanbul", "c": "Aydın", "d": "Ankara" },
    correctAnswer: "c",
    points: 5
  },
  {
    question: "Portakal nerelidir?",
    options: { "a": "Muğla", "b": "İstanbul", "c": "Aydın", "d": "Ankara" },
    correctAnswer: "a",
    points: 5
  },
  {
    question: "Limon'un en sevdiği atıştırmalık nedir?",
    options: { "a": "Limon", "b": "Dal darı", "c": "Ballı kraker", "d": "Marul" },
    correctAnswer: "d",
    points: 10
  },
  {
    question: "Portakal'ın en sevdiği atıştırmalık nedir?",
    options: { "a": "Yaş mama", "b": "Kuru mama", "c": "Ödül maması", "d": "Balık" },
    correctAnswer: "a",
    points: 10
  },
  {
    question: "Limon'un çok tepki verdiği en anlamsız şey nedir?",
    options: { "a": "Kırmızı rengi", "b": "Dua Lipa - New Rules", "c": "Kediler", "d": "Ambulans sireni" },
    correctAnswer: "d",
    points: 10
  },
  {
    question: "Portakal'ın mevsim geçişlerinde yaşadığı en büyük rahatsızlık nedir?",
    options: { "a": "Soğuk algınlığı", "b": "Obezite", "c": "Anksiyete", "d": "Uykusuzluk" },
    correctAnswer: "b",
    points: 10
  }
];

const seedQuizzes = async () => {
  for (const quiz of quizData) {
    await Quiz.findOrCreate({
      where: { question: quiz.question },
      defaults: quiz
    });
  }
  console.log("Quiz seed tamamlandı!");
};

export default seedQuizzes;
