import { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

export default function Register() {

  // State'ler
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Form state'ini dinamik olarak günceller
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   // React formlarının yenilenmesini bu satır durduruyor
    setLoading(true);
    setMsg("");

    try {
      // API'a kayıt isteği atılır
      const res = await register(form.username, form.email, form.password);
      
      if (res && res.msg) {
        setMsg(res.msg);
        // Kullanıcı kayıt olduktan 2 saniye sonra giriş ekranına yönlendirir
        if (res.msg.includes("oluşturuldu")) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } catch (error) {
      // Sunucudan gelen hataları gösterir 
      if (error.response && error.response.data) {
        setMsg(error.response.data.msg || error.response.data.error || "Kayıt işlemi başarısız oldu");
      } else {
        setMsg("Bir hata oluştu. Lütfen tekrar deneyin");
        console.error("Kayıt hatası:", error);
      }
    } finally {
      // Kayıt tamamlansa da tamamlanmasa da loading'i bitirir
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 flex justify-center mt-8 p-4">
      <div className="w-full max-w-md">
        {/* Başlık */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/icons/lemon.png" alt="Limon" className="w-8 h-8 mb-1" />
            <span className="text-2xl font-bold mx-2 text-gray-800">&</span>
            <img src="/icons/orange.png" alt="Portakal" className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Kaydol</h2>
          <p className="text-gray-600 text-lg">Limon & Portakal ile tanışın!</p>
        </div>

        {/* Form Kartı */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kullanıcı adı bölümü */}
            <div className="space-y-2">
              <label className="text-md font-medium text-gray-700 flex items-center">
                <User size={20} className="mr-2 text-[#4faaff]" />
                Kullanıcı Adı
              </label>
              <input
                name="username"
                placeholder="Kullanıcı adınızı girin"
                value={form.username}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* E-posta bölümü */}
            <div className="space-y-2">
              <label className="text-md font-medium text-gray-700 flex items-center">
                <Mail size={20} className="mr-2 text-[#4faaff]" />
                E-mail
              </label>
              <input
                name="email"
                placeholder="ornek@email.com"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Şifre Bölümü */}
            <div className="space-y-2">
              <label className="text-md font-medium text-gray-700 flex items-center">
                <Lock size={20} className="mr-2 text-[#4faaff]" />
                Şifre
              </label>
              <div className="relative">
                <input
                  name="password"
                  placeholder="En az 6 karakter"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  minLength="6"
                  // Şifre 6 karakterden kısaysa kaydetmez
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text- text-gray-500">Şifreniz en az 6 karakter olmalıdır.</p>
            </div>

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 sm:p-4 rounded-xl text-white font-semibold transition-all transform ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#4faaff] hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Kaydolunuyor...
                </span>
              ) : (
                'Kaydol'
              )}
            </button>
          </form>
          
          {/* Mesaj gösterme */}
          {msg && (
            <div className={`mt-6 p-4 rounded-xl text-center text-sm ${
              msg.includes("oluşturuldu")
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}>
              {msg}
              {msg.includes("oluşturuldu") && (
                <div className="text-xs mt-2 text-green-600">
                  Giriş sayfasına yönlendiriliyorsunuz...
                </div>
              )}
            </div>
          )}
          
          {/* Giriş yap linki */}
          <div className="mt-5 text-center text-md text-gray-600">
            Zaten hesabınız var mı?{' '}
            <button
              onClick={() => navigate("/login")}
              className="text-[#4faaff] hover:text-blue-700 font-medium transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        </div>

        {/* Site özellikleri bilgilendirme */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl justify-items-center p-3">
            <img src="/icons/brain.png" alt="Puan" className="w-7 h-7" />
            <p className="text-md text-gray-600">Quiz Çöz</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 justify-items-center ">
            <img src="/icons/diamond.png" alt="Puan" className="w-7 h-7" />
            <p className="text-md text-gray-600">Puan Kazan</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-3 justify-items-center ">
            <img src="/icons/shopping-bag.png" alt="Puan" className="w-7 h-7" />
            <p className="text-md text-gray-600">Alışveriş Yap</p>
          </div>
        </div>
      </div>
    </div>
  );
}