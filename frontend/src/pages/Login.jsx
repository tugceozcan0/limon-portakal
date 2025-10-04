import { useState } from "react";
import { login as apiLogin, decodeToken } from "../services/api";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [msg, setMsg] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false); 
	const { login: userLogin } = useUser();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setMsg(""); 
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMsg("");

		try {
			const res = await apiLogin(form.email, form.password);

			if (res && res.token) {
				
				// Token'ı çözümle ve kullanıcı verilerini al
				try {
					const decodedToken = decodeToken(res.token);
					userLogin({
						id: decodedToken.id,
						username: decodedToken.username,
						points: decodedToken.points || res.points || 0
					});
				} catch (decodeError) {
					console.error("Token çözme hatası:", decodeError);
					userLogin({
						id: res.userId,
						username: res.username,
						points: res.points || 0
					});
				}

				setMsg("Giriş başarılı! Yönlendiriliyorsunuz...");
				
				// Bir süre (1.5 saniye) bekledikten sonra home page'e yönlendirme
				setTimeout(() => {
					navigate("/");
				}, 1500);
			} else {
				setMsg(res.msg || "Giriş başarısız: Token alınamadı.");
			}

		} catch (error) {
			console.error("Login hatası:", error);
			
			if (error.response && error.response.data) {
				setMsg(error.response.data.msg || "Giriş başarısız.");
			} else if (error.message) {
				setMsg(`Hata: ${error.message}`);
			} else {
				setMsg("Bir hata oluştu. Lütfen tekrar deneyin.");
			}
		} finally {
			// Home page'i yüklemez, aynı sayfada kalır
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
					<h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Giriş Yap</h2>
					<p className="text-gray-600 text-lg">Hesabınıza giriş yaparak maceraya devam edin!</p>
				</div>

				{/* Form kartı */}
				<div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						
						{/* Email alma */}
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

						{/* Şifre alma */}
						<div className="space-y-2">
							<label className="text-md font-medium text-gray-700 flex items-center">
								<Lock size={20} className="mr-2 text-[#4faaff]" />
								Şifre
							</label>
							<div className="relative">
								<input
									name="password"
									placeholder="Şifrenizi girin"
									type={showPassword ? "text" : "password"}
									value={form.password}
									onChange={handleChange}
									className="w-full p-3 sm:p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
								>
									{/* Göz işaretine basınca şifreyi görünür yapar */}
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						{/* Gönder butonu */}
						<button
							type="submit"
							disabled={loading}
							className={`w-full p-3 sm:p-4 rounded-xl text-white font-semibold transition-all transform ${
								loading
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-[#4faaff] hover:bg-[#4faaff] hover:scale-105 shadow-lg hover:shadow-xl' // Giriş için mavi ton kullanıldı
							}`}
						>
							{loading ? (
								<span className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Giriş Yapılıyor...
								</span>
							) : (
								'Giriş Yap'
							)}
						</button>
					</form>
					{/* Giriş mesajı gösterme */}
					{msg && (
						<div className={`mt-6 p-4 rounded-xl text-center text-sm ${
							msg.includes("başarılı") || msg.includes("successful")
								? "bg-green-100 text-green-700 border border-green-300"
								: "bg-red-100 text-red-700 border border-red-300"
						}`}>
							{msg}
							{msg.includes("başarılı") && (
								<div className="text-xs mt-2 text-green-600">
									Ana sayfaya yönlendiriliyorsunuz...
								</div>
							)}
						</div>
					)}
					
					{/* Kayıt linki */}
					<div className="mt-5 text-center text-md text-gray-600">
						Hesabınız yok mu?{' '}
						<button
							onClick={() => navigate("/register")}
							className="text-[#4faaff] hover:text-blue-700 font-medium transition-colors"
						>
							Kaydol
						</button>
					</div>
				</div>

				{/* Site özellikleri tekrar */}
				<div className="mt-8 grid grid-cols-3 gap-4 text-center">
					<div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
						<img src="/icons/brain.png" alt="Quiz" className="w-7 h-7 mx-auto mb-1" />
						<p className="text-sm text-gray-600">Quiz Çöz</p>
					</div>
					<div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
						<img src="/icons/diamond.png" alt="Puan" className="w-7 h-7 mx-auto mb-1" />
						<p className="text-sm text-gray-600">Puan Kazan</p>
					</div>
					<div className="bg-white/50 backdrop-blur-sm rounded-xl p-3">
						<img src="/icons/shopping-bag.png" alt="Alışveriş" className="w-7 h-7 mx-auto mb-1" />
						<p className="text-sm text-gray-600">Alışveriş Yap</p>
					</div>
				</div>
			</div>
		</div>
	);
}
