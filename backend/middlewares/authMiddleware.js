import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // JWT_SECRET değişkenini kontrol et
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Database'de kullanıcıyı bul
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "Kullanıcı bulunamadı" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ msg: "Token is not valid", error: err.message });
  }
};

export default authMiddleware;