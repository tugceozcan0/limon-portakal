// Uygulamanın Footer ve Navbar kısımlarının düzgün durması için  

import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    // Flexbox ile dikey düzeni ayarlar ve minimum yüksekliği ekran yüksekliği yapar.
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* flex-grow, ana içerikle Navbar ve Footer dışındaki tüm boşluğu doldurur. */}
      <main className="flex-grow">
        {children} 
      </main>

      {/* Footer'ın en aşağıda durmasını sağlar */}
      <Footer />
    </div>
  );
}