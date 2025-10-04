import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Star } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50">
      {/* Başlık */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#FEE440] to-[#FF865E] bg-clip-text text-transparent">
            Limon & Portakal
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Quiz çöz, puan kazan ve evcil hayvanlarımızın hikayesini keşfet!
          </p>

          {/* Kişi giriş yapmadıysa çıkacak seçenekler */}
          {!user && (
            <div className="flex flex-col text-lg sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-[#A2D2FF] hover:bg-blue-400 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Hemen Başla
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-[#FF865E] hover:bg-orange-500 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Giriş Yap
              </button>
            </div>
          )}
        </div>

        {/* Bilgi ve fotoğraf kısmı */}
        <div className="mb-20">
          <div className="space-y-16 max-w-6xl mx-auto">
            {/* Limon */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1 flex justify-center">
                <div className="bg-[#FEE440] rounded-full p-2 shadow-xl">
                  <picture>
                    <source srcSet="/images/limon.webp" type="image/webp" />
                    <img
                      src="/images/limon.jpg"
                      alt="Limon"
                      className="w-80 h-80 object-cover rounded-full shadow-lg"
                    />
                  </picture>
                </div>
              </div>
              <div className="order-1 md:order-2 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                  Limon
                </h3>
                <p className="text-xl text-[#A2D2FF] font-semibold mb-4">
                  Tuğçe'nin Sultan Papağanı
                </p>
                </div>
                
                <p className="text-gray-700 text-xl mb-6">
                  Sinirli ve huysuz biri
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFBEA] rounded-2xl">
                    <ul className="space-y-5 w-full"> 
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FEE440] fill-[#FEE440] mr-3"/>
                        Tüylerinin kaşınmasını ve televizyon izlemeyi sever
                      </li>
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FEE440] fill-[#FEE440] mr-3"/>
                        Boş zamanlarında dans eder (Kendi figürleri var)
                      </li>
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FEE440] fill-[#FEE440] mr-3"/>
                        Sabahları canı sıkıldığından erkenden insanları uyandırır
                      </li>
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FEE440] fill-[#FEE440] mr-3"/>
                        En sevdiği kişi Tuğçe (Başka kimseyi de sevmiyor zaten)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Portakal */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">Portakal</h3>
                  <p className="text-xl text-[#A2D2FF] font-semibold mb-1">
                    Emre'nin Turuncu Kedisi
                  </p>
                </div>
                
                <p className="text-gray-700 text-xl mb-6">
                  Tatil köyünün en uykucu üyesi
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-[#FFFBEA] rounded-2xl">
                    <ul className="space-y-5 w-full"> 
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FF865E] fill-[#FF865E] mr-3"/>
                        Uyumayı ve yemek yemeyi sever
                      </li>
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FF865E] fill-[#FF865E] mr-3"/>
                        Bilmediği evlere sızar ve oralarda uyur
                      </li>
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FF865E] fill-[#FF865E] mr-3"/>
                        Sonsuza kadar yaş mama yiyebilir
                      </li>
                      <li className="text-gray-700 text-xl flex items-start">
                        <Star className="text-[#FF865E] fill-[#FF865E] mr-3"/>
                        Turuncu kedi genlerini tam olarak alamamış, sakin biri
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-[#FF865E] rounded-full p-2 shadow-xl">
                  <picture>
                    <source srcSet="/images/portakal.webp" type="image/webp" />
                    <img
                      src="/images/portakal.jpg"
                      alt="Portakal"
                      className="w-80 h-80 object-cover rounded-full shadow-lg"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sitenin özelliklerini tanıtma */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            Neler Yapabilirsin?
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Sitenin özellikleri işte burada:
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-[#A2D2FF] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-white shadow-md">
                <img src="/icons/brain.png" alt="Quiz" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Quiz Çöz</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Eğlenceli quizlerle bilgini test et ve puan kazan!
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-[#FEE440] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-md">
                <img src="/icons/diamond.png" alt="Puan" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Puan Kazan</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Her doğru cevap sana değerli puanlar kazandırır.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-20 h-20 bg-[#FF865E] rounded-full flex items-center justify-center mx-auto mb-4 text-4xl text-white shadow-md">
                <img src="/icons/shopping-bag.png" alt="Alışveriş" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Alışveriş Yap</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                Kazandığın puanlarla harika ürünler satın al!
              </p>
            </div>
          </div>
        </div>

        {/* Kullanıcı karşılama kısmı */}
        {user && (
          <div className="bg-gradient-to-r from-[#ffee85] to-[#FF865E] rounded-3xl p-8 text-center text-[#FEF9EF] shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Tekrar hoş geldin, {user.username}!
            </h2>

            <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-6 backdrop-blur-sm">
              <p className="text-xl md:text-2xl font-semibold">
                Mevcut puanın:{" "}
                <span className="text-[#FF865E]">{user.points || 0}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/quiz")}
                className="bg-white text-[#A2D2FF] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Quiz Çözmeye Başla
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-[#A2D2FF] text-gray-800 hover: px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                Market'i Keşfet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}