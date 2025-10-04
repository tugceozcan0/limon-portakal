import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import { buyProduct } from "../services/api";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, totalPoints, removeItem, updateQuantity, clearCart } = useCart();
  const { user, updateUserPoints } = useUser();
  const [purchaseMsg, setPurchaseMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Ödeme yapma fonksiyonu
  const handlePurchase = async () => {
    // Kullanıcının ödeme yapabilir durumda olmasının kontrolü
    if (!user) {
      setPurchaseMsg("Ödeme yapmadan önce giriş yapmalısınız.");
      return;
    }
    if (user.points < totalPoints) {
      setPurchaseMsg("Yetersiz puanınız var. Daha fazla puan kazanmalısınız.");
      return;
    }
    
    // Eğer ödeyebilecekse state'i değiştir
    setIsProcessing(true);
    setPurchaseMsg("Ödeme yapılıyor...");

    try {
      // Sepetteki ürünler için loop
      for (const item of items) {
        for (let i = 0; i < item.quantity; i++) {
          const res = await buyProduct(item.id);
          if (res.error) {
            throw new Error(res.error);
          }
          console.log(`Ürün satın alındı: ${item.name}`);
        }
      }

      // Satın alma sonrası kullanıcının puanından düşülür
      const updatedUserPoints = user.points - totalPoints;
      updateUserPoints(updatedUserPoints);
      // Sepeti boşaltır
      clearCart();
      setPurchaseMsg("Tebrikler! Ürünler başarıyla satın alındı 🎉");
    } catch (error) {
      setPurchaseMsg(`Hata: ${error.message}`);
      console.error("Satın alma hatası:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-4 sm:p-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Sepetim</h2>
            <p className="text-xl text-gray-600 mb-6">Sepetinizde ürün bulunmamaktadır. 🛍️</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="bg-[#A2D2FF] text-lg font-semibold text-gray-700 hover:bg-[#4faaff] hover:text-white px-6 py-3 text-md rounded-lg transition-colors"
            >
              Markete Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">🛒 Sepetim</h2>
          <p className="text-gray-600">Alışveriş sepetinizdeki ürünler</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sepetteki ürünler */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Ürünler ({items.reduce((sum, item) => sum + item.quantity, 0)})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map(item => (
                  <div key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Ürün bilgisi */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                        {/* Açıklama yoksa default açıklama yaz */}
                        <p className="text-sm text-gray-500 mt-1">{item.description || "Premium quality product"}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-lg font-bold text-blue-600">{item.pointsCost}</span>
                          <span className="text-md text-gray-500 ml-1">puan/adet</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                        {/* Miktar arttırma azaltma */}
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                            aria-label="Azalt"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                            aria-label="Artır"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Sepetten çıkar butonu */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="Kaldır"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Ara toplam hesabı */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-md text-gray-500">Ara toplam:</span>
                      <span className="font-bold text-gray-800">
                        {item.pointsCost * item.quantity} puan
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sipariş Özeti */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl sticky top-24">
              <div className="p-4 sm:p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Sipariş Özeti</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Toplam Ürün:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Toplam Adet:</span>
                    <span className="font-medium">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-gray-800">Toplam:</span>
                    <span className="font-bold text-2xl text-[#4faaff]">
                      {totalPoints} 💎
                    </span>
                  </div>

                  {user && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex justify-between items-center text-md">
                        <span className="text-[#4faaff]">Mevcut puanınız:</span>
                        <span className="font-bold text-[#4faaff]">{user.points} 💎</span>
                      </div>
                      {user.points < totalPoints && (
                        <p className="text-red-600 text-sm mt-2">
                          {totalPoints - user.points} puan eksik
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handlePurchase}
                    disabled={isProcessing || totalPoints === 0 || (user && user.points < totalPoints)}
                    className={`w-full p-4 rounded-lg text-white font-bold transition-colors ${
                      isProcessing || totalPoints === 0 || (user && user.points < totalPoints)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        İşleniyor...
                      </span>
                    ) : (
                      `Satın Al (${totalPoints} Puan)`
                    )}
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Sepeti Temizle
                  </button>
                </div>

                {purchaseMsg && (
                  <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
                    purchaseMsg.includes("Tebrikler")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {purchaseMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}