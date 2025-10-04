import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "defaultadmin@example.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "defaultsecurepassword"; 

  // Eğer kritik admin bilgileri .env'de tanımlı değilse, seed'i atlayarak uyarı verir
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.warn("Admin seed atlandı: ADMIN_EMAIL veya ADMIN_PASSWORD .env dosyasında tanımlı değil. Lütfen .env dosyanızı kontrol edin.");
      return;
  }

  // Şifreyi hash'lemeden kaydetmemek için
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10); // 10 salt round

  await User.findOrCreate({
    // .env dosyasından admin'in mailini çeker.
    where: { email: ADMIN_EMAIL },
    defaults: {
      username: "admin",
      password: hashedPassword, // Hashlenmiş şifreyi kaydet
      role: "admin",
      id: 1, 
    }
  });
  console.log(`Admin user seed tamamlandı! Email: ${ADMIN_EMAIL}`);
};

export default seedUsers;
