import Product from "../models/Product.js";
import User from "../models/User.js";

// Tüm ürünleri listele
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error("Ürünler yüklenirken hata oluştu:", err);
    res.status(500).json({ error: err.message });
  }
};

// Ürün satın alma
export const buyProduct = async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id; // auth middleware'den gelen userId
  
  try {
    const user = await User.findByPk(userId);   // findOne({ where: { id: 5 } }) ile aynı şey, id primary key olduğu için kullanabiliyoruz
    const product = await Product.findByPk(productId);

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }

    if (user.points < product.pointsCost) {
      return res.status(400).json({ 
        error: "Puanınız yeterli değil",
        required: product.pointsCost,
        available: user.points
      });
    }

    // Ürün satın alınınca puan düşürme
    user.points -= product.pointsCost;
    await user.save();

    console.log(`Kullanıcı ${user.id}, ${product.pointsCost} puan karşılığında ${product.name} ürününü satın aldı.`);

    res.json({ 
      message: `${product.name} başarıyla satın alındı.`,
      product: {
        id: product.id,
        name: product.name,
        pointsCost: product.pointsCost
      },
      remainingPoints: user.points
    });

  } catch (err) {
    console.error("Ürün satın alınırken hata oluştu:", err);
    res.status(500).json({ error: err.message });
  }
};

// Kullanıcının anlık puanını alma
export const getUserPoints = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }
    
    res.json({ points: user.points || 0 });
  } catch (err) {
    console.error("Kullanıcı puanları yüklenirken hata oluştu:", err);
    res.status(500).json({ error: err.message });
  }
};