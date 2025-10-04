export default function Footer() {
  return (
    <footer className="bg-[#A2D2FF] text-gray-800 py-8 sm:py-10">
      <div className="container mx-auto px-4">
        
        {/* 3 Sütunlu Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          
          {/* Sol Sütun (Site Başlığı ve Açıklama) */}
          <div className="flex flex-col items-center md:items-start md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-3">
              <img src="/icons/lemon.png" alt="Limon" className="w-8 h-8 mb-1" />
              <span className="text-xl sm:text-2xl font-bold mx-2 text-[#FEF9EF]">&</span>
              <img src="/icons/orange.png" alt="Portakal" className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-[#FEF9EF]">Limon & Portakal</h3>
            <p className="text-gray-800 sm:text-base max-w-xs"> 
              Quiz çözerek puan kazanın ve evcil hayvanlarımızın dünyasına adım atın!
            </p>
          </div>
          
          {/* Orta Sütun (Hızlı Linkler) */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[#FEE440]">
              Hızlı Bağlantılar
            </h3>
            <ul className="space-y-2 text-md sm:text-base">
              <li>
                <a 
                  href="/quiz" 
                  className="text-gray-800 text-lg hover:text-white transition-colors inline-flex items-center"
                >
                  Quiz Çöz
                </a>
              </li>
              <li>
                <a 
                  href="/products" 
                  className="text-gray-800 text-lg hover:text-white transition-colors inline-flex items-center"
                >
                  Market
                </a>
              </li>
              <li>
                <a 
                  href="/cart" 
                  className="text-gray-800 text-lg hover:text-white transition-colors inline-flex items-center"
                >
                  Sepetim
                </a>
              </li>
            </ul>
          </div>

          {/* Sağ Sütun (Geliştirici Bilgileri) */}
          <div className="flex flex-col items-center md:items-end md:text-right">
            <h4 className="text-md sm:text-xl font-semibold mb-3 text-[#FF865E]">
              Geliştirici
            </h4>
            <a 
              href="https://github.com/tugceozcan0" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-lg sm: font-medium text-gray-800 hover:text-[#FEF9EF] transition-colors"
            >
              Github
            </a>
            <a
              href="mailto:tugceozcan0932@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-lg sm: font-medium text-gray-800 hover:text-[#FEF9EF] transition-colors">
              Email
            </a>
          </div>
        </div>
        
        {/* Divider */}
        <hr className="border-gray-700 my-6 sm:my-8" /> 
        
        {/* Copyright */}
        <div className="text-center text-white text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span>© 2025 Limon & Portakal</span>
            <span className="hidden sm:inline">•</span>
            <span>Tüm hakları saklıdır</span>
          </div>
        </div>
      </div>
    </footer>
  );
}