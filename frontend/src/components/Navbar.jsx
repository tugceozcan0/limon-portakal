import { Link, useLocation } from "react-router-dom";
import CartWidget from "./CartWidget";
import { useUser } from "../contexts/UserContext";
import { useState } from "react";
import { Menu, X, Gem } from "lucide-react"; 

export default function Navbar() {
  const { user, logout } = useUser();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#A2D2FF] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Kısmı */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-[#FEE440] transition-colors"
          >
            <div className="flex items-center">
              <img src="/icons/lemon.png" alt="Limon" className="w-8 h-8 mb-1" />
              {/* Logo metni */}
              <span className="hidden mx-2 sm:block text-lg md:text-xl font-bold">Limon & Portakal</span>
              <span className="mx-2 text-xl md:text-2xl font-bold text-white sm:hidden">&</span> 
              <img src="/icons/orange.png" alt="Portakal" className="w-7 h-7" />
            </div>
          </Link>

          {/* Site içinde yönlendiren linkler */}
          <div className="hidden md:flex space-x-2">
            <Link
              to="/"
              className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-semibold transition-colors text-base md:text-lg ${
                isActive('/') 
                  ? 'bg-white text-[#4faaff]' 
                  : 'text-white hover:bg-[#4faaff] hover:text-[#FEE440]'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/quiz"
              className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-semibold transition-colors text-base md:text-lg ${
                isActive('/quiz') 
                  ? 'bg-white text-[#4faaff]' 
                  : 'text-white hover:bg-[#4faaff] hover:text-[#FEE440]'
              }`}
            >
              Quiz
            </Link>
            <Link
              to="/products"
              className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-semibold transition-colors text-base md:text-lg ${
                isActive('/products') 
                  ? 'bg-white text-[#4faaff]' 
                  : 'text-white hover:bg-[#4faaff] hover:text-[#FEE440]'
              }`}
            >
              Market
            </Link>
          </div>

          {/* Kullancıya selam + Küçük ekranlarda menü butonu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-white text-lg md:text-base font-medium">
                    Hoş geldin, {user.username} 
                  </span>
                  <span className="text-[#FF865E] text-lg md:text-md font-bold flex items-center justify-end gap-1">
                    {user.points !== undefined ? user.points : 0}
                    <Gem size={18} className="inline-block ml-1 text-[#4faaff]" />
                  </span>
                </div>
                <CartWidget />
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition-colors text-sm md:text-base"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-white hover:text-[#FEE440] px-2 md:px-3 py-1 md:py-2 rounded-lg font-medium text-sm md:text-base transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FF865E] hover:bg-orange-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg font-medium text-sm md:text-base transition-colors"
                >
                  Kaydol
                </Link>
              </div>
            )}

            {/* Hamburger Menü Butonu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white hover:text-[#FEE440] ml-2"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobil Cihaz İçin Menü */}
        {menuOpen && (
          <div className="md:hidden flex flex-col text-base space-y-1 pb-4">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded font-medium ${
                isActive('/') 
                  ? 'bg-white text-[#4faaff]' 
                  : 'text-white hover:bg-[#4faaff] hover:text-[#FEE440]'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/quiz"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded font-medium ${
                isActive('/quiz') 
                  ? 'bg-white text-[#4faaff]' 
                  : 'text-white hover:bg-[#4faaff] hover:text-[#FEE440]'
              }`}
            >
              Quiz
            </Link>
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded font-medium ${
                isActive('/products') 
                  ? 'bg-white text-[#4faaff]' 
                  : 'text-white hover:bg-[#4faaff] hover:text-[#FEE440]'
              }`}
            >
              Market
            </Link>

            // Eğer kişi kayıtlı değilse 
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-yellow-300 px-3 py-2 rounded-lg font-medium"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-[#FF865E] hover:bg-orange-500 text-white px-3 py-2 rounded-lg font-medium"
                >
                  Kaydol
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
