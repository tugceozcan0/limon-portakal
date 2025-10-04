import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Kaydol
export const register = async (req, res) => {
  const { username, email, password } = req.body;   // role kısmını almadığı için için kişi kendi role'üne admin yazsa bile database'e işlenmez
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ msg: "Bu e-posta daha önce alınmış." });  // Aynı e-postayla biri bulunursa hata ver

    const hashedPassword = await bcrypt.hash(password, 10);   // hashleme + 10 salt
    const newUser = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ msg: "Kullanıcı oluşturuldu", userId: newUser.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ msg: "Kullanıcı bulunamadı" });  // Verilen e-posta ile eşleşen kişi yoksa hata

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Geçersiz e-posta veya şifre" });  // Credential'lar uymazsa hata

    const token = jwt.sign( 
      { id: user.id, 
        username: user.username, 
        points: user.points }, // Verilen bilgilere sahip kişiye token atama

    process.env.JWT_SECRET, { expiresIn: "1d" });   // token ömrü 1 gün
    res.json({ token, userId: user.id, username: user.username, points: user.points });   // Frontend'e bilgileri json formatında gönderme
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
