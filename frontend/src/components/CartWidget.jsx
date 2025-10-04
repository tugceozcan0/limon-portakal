import { useCart } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart } from 'lucide-react';

export default function CartWidget() {
  const { totalItems } = useCart();

  return (
    
    <Link 
      to="/cart" 
      className="relative p-2 text-white hover:text-yellow-300 transition-colors group"
    >
      <div className="relative">
        {/* Sepet ikonu lucide-react kütüphanesinden */}
        <ShoppingCart 
          size={24} 
          className="group-hover:scale-110 transition-transform duration-200" 
        />
        {/* Sepetin sağ üst köşesinde sepete kaç ürün atıldığını gösterir */}
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange-500 rounded-full transform group-hover:scale-110 transition-transform duration-200 shadow-lg">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  );
}