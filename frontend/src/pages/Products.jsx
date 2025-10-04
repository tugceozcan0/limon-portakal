import { useEffect, useState } from "react";
import { getProducts, getUserPoints } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, Plus, Star, Award } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Ürünleri yükleme (Authentication gerektirmez)
        const productsData = await getProducts();
        setProducts(productsData || []);
        
        // Kullanıcının puanını çekme
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const pointsData = await getUserPoints();
            setUserPoints(pointsData.points || 0);
          } catch (pointsError) {
            console.error("Error fetching user points:", pointsError);
            // Error olursa puan direkt 0 olacak
            setUserPoints(0);
          }
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
    
    // Ürün sepete yüklenince buton metni değiştirme
    const button = document.getElementById(`add-${product.id}`);
    if (button) {
      const originalText = button.textContent;
      const originalClass = button.className;
      
      button.textContent = "Sepete Eklendi!";
      button.disabled = true;
      button.className = button.className.replace('bg-blue-600', 'bg-green-600')
                                        .replace('hover:bg-blue-700', 'hover:bg-green-700');
      
      // Bir süre sonra buton metni orijinal haline dönecek
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.className = originalClass;
      }, 1000);
    }
  };

  const canAfford = (pointsCost) => {
    return userPoints >= pointsCost;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Ürünler yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 pb-24 max-w-7xl mx-auto">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Market</h2>
          <p className="text-gray-600">Puanlarınla evcil hayvanının için alışveriş yap!</p>
        </div>
        
        <div className="bg-[#ffee85] border border-[#FEE440] px-6 py-3 shadow-md rounded-xl">
          <div className="flex items-center gap-2">
            <Award className="text-gray-700" size={20} />
            <span className="text-gray-800 font-semibold text-xl">{userPoints} Puan</span>
          </div>
        </div>
      </div>
      

      {products.length === 0 ? (
        <div className="text-center bg-gradient-to-br from-blue-50 via-orange-50 to-yellow-50 py-16">
          <ShoppingCart size={80} className="mx-auto text-gray-300 mb-6" />
          <h3 className="text-2xl font-semibold text-gray-500 mb-2">Satın alabileceğiniz ürün bulunmamakta.</h3>
          <p className="text-gray-400">Yeni ürünler için tekrar uğrayın!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Ürün fotoğrafı */}
                <div className="h-48 rounded-t-xl flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <ShoppingCart size={48} className="mx-auto mb-2 opacity-60" />
                      <p className="text-sm font-medium">{product.name}</p>
                    </div>
                  )}
                </div>
                
                {/* Ürün bilgileri */}
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {product.description || "Premium quality product"}
                    </p>
                  </div>
                  
                  {/* Fiyat bilgisi */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#4faaff] flex items-center gap-1">
                        <Star className="text-yellow-500" size={18} />
                        {product.pointsCost}
                      </p>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Puan</p>
                    </div>
                    
                    <button
                      id={`add-${product.id}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!canAfford(product.pointsCost)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 font-medium ${
                        canAfford(product.pointsCost)
                          ? 'bg-[#ffb69e] text-gray-600 hover:bg-[#FF865E] hover:text-white hover:scale-105'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Plus size={16} />
                      Sepete Ekle
                    </button>
                  </div>
                  
                  {/* Satın alınabilme durumu */}
                  <div className="text-center">
                    {canAfford(product.pointsCost) ? (
                      <div className="text-sm text-green-600 bg-green-50 py-1 px-2 rounded-full">
                        ✓ Bunu satın alabilirsin.
                      </div>
                    ) : (
                      <div className="text-sm text-red-600 bg-red-50 py-1 px-2 rounded-full">
                        {product.pointsCost - userPoints} puana daha ihtiyacın var.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Bilgi kartları */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nasıl Çalışıyor */}
            <div className="bg-[#A2D2FF] border border-[#4faaff] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                Site nasıl çalışıyor?
              </h3>
              <ul className="text-gray-700 text-lg space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  Puan kazanmak için quizi çöz.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  Ürünlerden istediklerini seç ve sepetine ekle.
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  Puanlarınla alışveriş yap.
                </li>
              </ul>
            </div>
            
            {/* Ürün durumu */}
            <div className="bg-[#ffee85] border border-[#FEE440] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ShoppingCart className="text-yellow-600" size={20} />
                Bilgiler
              </h3>
              <div className="text-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Puanın:</span>
                  <span className="font-bold text-yellow-600">{userPoints}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Mevcut Ürünler:</span>
                  <span className="font-bold text-yellow-600">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Satın Alabileceğin Ürünler:</span>
                  <span className="font-bold text-green-700">
                    {products.filter(p => canAfford(p.pointsCost)).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Puan 0'sa quize yönlendir */}
          {userPoints === 0 && (
            <div className="mt-8 text-center text-lg bg-[#ffb69e] border border-[#FF865E] rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz quizi çözmediniz mi?</h3>
              <p className="text-gray-600 mb-4">Quiz çöz ve puanlarınla alışveriş yap!</p>
              <button
                onClick={() => window.location.href = '/quiz'}
                className="bg-[#FF865E] hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Quizi Çöz
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}