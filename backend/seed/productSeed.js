import Product from "../models/Product.js";

const products = [
  { name: "Kedi Yatağı", pointsCost: 20, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/6e8b0d3a-7c47-421b-8309-9f3775ff98cf/image_900.webp" },
  { name: "Kuş Salıncağı", pointsCost: 10, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/4e76ce24-25a9-4795-9a40-d06f8461dfed/image_900.webp" },
  { name: "Tasma", pointsCost: 15, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/780848f5-6c19-438c-a0a4-dd0abdd2995e/image_900.webp" },
  { name: "Kuş banyosu", pointsCost: 10, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/7142a31f-d26a-4a87-95ef-ac291eef45ec/image_900.webp" },
  { name: "Kedi Oyuncağı 1", pointsCost: 5, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/14c638fc-4438-4f09-976e-68e47f2c3760/image_900.webp" },
  { name: "Kedi Oyuncağı 2", pointsCost: 5, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/252dc833-8c49-4968-b2ef-490e3d50668b/image_900.webp" },
  { name: "Kedi Oyuncağı 3", pointsCost: 5, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/fcdd0e25-1b3d-4b61-8d00-248894a8b55c/image_900.webp"},
  { name: "Kedi Oyuncağı 4", pointsCost: 5, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/d7270ab5-c6bb-4309-a257-4c5fab739fe9/image_900.webp" },
  { name: "Kedi Maması", pointsCost: 15, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/f4df7f30-4371-4fd0-8dd8-eb7859b5dcee/image_900.webp" },
  { name: "Kuş Yemi", pointsCost: 10, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/0d398915-e96f-4e18-a64e-89cb339f1545/image_900.webp" },
  { name: "Ballı Kraker", pointsCost: 10, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/813715bb-565d-4a73-a2da-468dc4ab6ff6/image_900.webp" },
  { name: "Kuş Vitamini", pointsCost: 5, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/4d0b8e40-1239-4412-8dcc-1a628d3dfcc4/image_900.webp" },
  { name: "Dal Darı", pointsCost: 5, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/3d4675c6-6976-43d6-81b5-8f124f90ae53/image_900.webp" },
  { name: "Kuş Oyuncağı", pointsCost: 10, image: "https://cdn.myikas.com/images/5d436c51-cce5-440f-8a93-9d38ba8fb37f/647c808e-8ec3-458a-b9c9-b4b079edff7b/image_900.webp"}
];

// Hazırlanan objeleri database'e ekler
const seedProducts = async () => {
  for (const item of products) {
    await Product.findOrCreate({  // Database'de o obje var mı diye kontrol eder(duplication'ı engellemek için).
      where: { name: item.name },
      defaults: item
    });
  }
  console.log("Products seed tamamlandı!");
};

export default seedProducts;
