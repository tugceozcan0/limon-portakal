import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizzes, submitQuizAnswers } from "../services/api";
import { useUser } from "../contexts/UserContext";
import { CircleCheckBig } from "lucide-react";

export default function Quiz() {
  // Stateler
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();   // Yönlendirme hook'u
  const { user, updateUserPoints } = useUser();

  // Quzileri yükleme ve kimlik doğrulama
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setError("Quiz çözebilmek için lütfen giriş yapın.");
      return;
    }

    // Quiz API'ından soru çeker
    const fetchQuizzes = async () => {
      try {
        console.log("Mevcut sorular yükleniyor...");
        // Sadece cevaplanmamaış soruları gönderen API'ı çağırır
        const data = await getQuizzes();
        console.log("Yüklenen sorular:", data);
        setQuizzes(data || []);
      } catch (err) {
        console.error("Quiz yüklenirken hata oluştu:", err);
        
        // Token süresi dolarsa
        if (err.response && err.response.status === 401) {
          setError("Oturumunuzun süresi dolmuş. Lütfen tekrar giriş yapın.");
          localStorage.removeItem('token'); // Geçersiz token'i sil
        } else {
          setError("Sorular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [navigate]);

  const handleChange = (quizId, optionKey) => {
    // Yeni cevabı ekler
    setAnswers(prev => ({ ...prev, [quizId]: optionKey }));
    // Kullanıcı cevap vermeye başlayınca mesajlar silinir
    setError("");
    setSuccess("");
  };

  // Quiz gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Tüm sorular yanıtlanmadıysa hata
    if (Object.keys(answers).length !== quizzes.length) {
      setError("Lütfen göndermeden önce tüm soruları yanıtlayın.");
      setLoading(false);
      return;
    }

    console.log("Cevaplar gönderiliyor:", answers);

    try {
      // Cevapları sunucuya gönderir
      const result = await submitQuizAnswers(answers);
      
      console.log("Gönderim yanıtı:", result);
      setSuccess(`Quiz başarıyla gönderildi! Kazanılan puan: ${result.totalPoints}. Toplam puanınız: ${result.currentPoints}`);
      
      // Context aracılığıyla kullanıcının puanlarını global olarak günceller
      updateUserPoints(result.currentPoints);
      
      // Çözülen soruları temizle
      setQuizzes([]);
      setAnswers({});
      
    } catch (err) {
      console.error("Gönderim hatası:", err);
      
      if (err.response) {
        // Hata geldiyse hataya özel konsol bildirimi
        switch (err.response.status) {
          case 401:
            setError("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
            localStorage.removeItem('token');
            break;
          case 400:
            // Kullanıcı soruları tekrar çözmeye çalışırsa error
            if (err.response.data.error?.includes("already") || err.response.data.message?.includes("already")) {
              setError("Bu soruları zaten çözmüşsünüz. Her soru sadece bir kez alınabilir.");
              // Formu temizle ve cevaplanmamış soruları göster
              setQuizzes([]);
              setAnswers({});
              // 3 saniye sonra sayfayı yeniler
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } else {
              setError(`Hatalı istek: ${err.response.data.error || err.response.data.message || "Geçersiz veri gönderildi"}`);
            }
            break;
          case 500:
            setError(`Sunucu hatası: ${err.response.data.error || err.response.data.details || "Bilinmeyen hata"}`);
            break;
          default:
            setError(`Hata: ${err.response.data.error || err.response.data.msg || "Bilinmeyen hata"}`);
        }
      } else if (err.request) {
        setError("Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığından emin olun.");
      } else {
        setError(`Hata: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Koşullu renderlama
  if (loading) {
    return (
      <div className="p-8 text-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quiz</h2>
        <p className="text-gray-500 text-lg">Yükleniyor...</p>
      </div>
    );
  }

  // Kişi giriş yapmadıysa
  if (error && quizzes.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quiz</h2>
        <div className="bg-red-100 border text-lg border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        {!localStorage.getItem("token") && (
          <div className="mt-5 text-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-[#FF865E] hover:bg-orange-500 text-lg text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        )}
      </div>
    );
  }

  // Ana bileşen
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start sm:items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800">Quiz</h2>
        {user && (
          <div className="bg-[#ffee85] border border-[#FEE440] px-6 py-3 rounded-xl shadow-md">
            <span className="text-gray-800 font-semibold text-xl">Puanınız: {user.points || 0}</span>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}
      
      {quizzes.length === 0 ? (
        <div className="text-center py-12">
          <CircleCheckBig size={80} className="mx-auto text-gray-300 mb-6"/>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Tüm Quiz'leri Tamamladınız!</h3>
          <p className="text-gray-500 text-lg mb-6">
            Şu anda cevaplayabileceğiniz yeni bir quiz bulunmamaktadır. Yeni quizler mailinize gönderilecektir.
          </p>
          <div className="bg-[#ffb69e] border border-[#FF865E] rounded-lg p-4 max-w-md mx-auto">
            <p className="text-gray-700 text-md">
              Tebrikler! Mevcut tüm quiz'leri çözerek puan kazandınız. 
              Şimdi markete gidip puanlarınızla alışveriş yapabilirsiniz!
            </p>
          </div>
          <button
          // Quiz çözüldükten sonra butonla kullancıyı market sayfasına yönlendirir
            onClick={() => navigate("/products")}
            className="mt-6 bg-[#A2D2FF] text-gray-700 hover:bg-[#4faaff] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Markete Git
          </button>
        </div>
      ) : (
        // Quiz kartları
        <form onSubmit={handleSubmit} className="space-y-6">
          {quizzes.map((quiz, index) => (
            <div key={quiz.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <span className="inline-block bg-[#A2D2FF] text-gray-600 text-lg font-semibold px-3 py-1 rounded-full mb-3">
                  Soru {index + 1}
                </span>
                <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                  {quiz.question}
                </h3>
                {quiz.points && (
                  <p className="text-lg text-[#FF865E] font-medium">
                    {quiz.points} puan değerinde
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                {Object.entries(quiz.options).map(([key, value]) => (
                  <label 
                    key={key} 
                    className={`flex items-center text-xl p-3 border rounded-lg cursor-pointer transition-colors ${
                      answers[quiz.id] === key 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`quiz-${quiz.id}`}
                      value={key}
                      checked={answers[quiz.id] === key}
                      onChange={() => handleChange(quiz.id, key)}
                      className="mr-3 h-4 w-4 text-[#A2D2FF]"
                    />
                    <span className="text-gray-700">
                      <span className="font-medium">{key.toUpperCase()}:</span> {value}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          {/* Gönder butonu */}
          <div className="flex justify-center text-lg pt-6">
            <button
              type="submit"
              disabled={loading || Object.keys(answers).length !== quizzes.length}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                loading || Object.keys(answers).length !== quizzes.length
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#4faaff] hover:bg-[#A2D2FF]'
              }`}
            >
              {loading ? 'Gönderiliyor...' : 'Quiz\'i Gönder'}
            </button>
          </div>
          
          {/*Kullanıcı tüm soruları yanıtlamadıysa submit edemez */}
          {Object.keys(answers).length < quizzes.length && (
            <p className="text-center text-md text-gray-500 mt-2">
              Lütfen tüm {quizzes.length} soruyu yanıtlayın ({Object.keys(answers).length}/{quizzes.length} tamamlandı)
            </p>
          )}
        </form>
      )}
      
      {/* Bilgi kartı */}
      <div className="mt-8 bg-[#ffee85] border border-[#FEE440] rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Nasıl Çalışır</h3>
        <ul className="text-lg text-gray-600 space-y-1">
          <li>• Tüm quiz sorularını doğru yanıtlayarak puan kazanın</li>
          <li>• Her doğru cevap size puan verir</li>
          <li>• Puanlarınızı markette ürün satın almak için kullanabilirsiniz</li>
          <li>• Her bir quiz'i sadece bir kez gönderebilirsiniz</li>
          <li>• Her ay yeni quizler hazırlanır</li>
          <li>• Yeni quizler için e-mailinizi kontrol edin</li>
        </ul>
      </div>
    </div>
  );
}