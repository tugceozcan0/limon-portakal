import { createContext, useContext, useState, useEffect } from 'react';
import { getUserPoints } from '../services/api';

const UserContext = createContext();

// Tarayıcıdaki token'ı (JWT) alıp payload (veri) kısmını okuyarak kullanıcı bilgilerini çıkarır.
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

// Context sağlayıcısı
export const UserProvider = ({ children }) => {
  // Kullanıcı verisi (id, username, points vb.) için state.
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch fresh user points from server
  const refreshUserPoints = async () => {
    const token = localStorage.getItem('token');
    // Kalan her işlemi token ve kullanıcı varsa yapar
    if (token && user) {
      try {
        const pointsData = await getUserPoints();
        setUser(prevUser => ({
          // Kullanıcının sadece puan verisini günceller
          ...prevUser,
          points: pointsData.points
        }));
      } catch (error) {
        console.error("Kullanıcı puanları güncellenirken hata oluştu:", error);
      }
    }
  };

  // Tarayıcıda token olup olmadığını kontrol eder.
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = decodeToken(token);
          if (decoded) {
            // Set initial user data from token
            const initialUser = {
              id: decoded.id,
              username: decoded.username,
              points: decoded.points || 0
            };
            setUser(initialUser);

            // Then fetch fresh points from server
            try {
              const pointsData = await getUserPoints();
              setUser(prevUser => ({
                ...prevUser,
                points: pointsData.points
              }));
            } catch (pointsError) {
              console.error("Sunucudan güncel puanlar çekilirken hata oluştu:", pointsError);
              // Keep the points from token if server fetch fails
            }
          }
        } catch (err) {
          console.error("Token çözme hatası:", err);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);    // Sadece bir kere çalışır(ilk anda).

  const login = (userData) => {
    setUser(userData);
    // After login, refresh points from server
    setTimeout(refreshUserPoints, 100);
  };

  // Çıkış yapma fonksiyonu
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserPoints = (newPoints) => {
    setUser(prevUser => ({ 
      ...prevUser, 
      points: newPoints 
    }));
  };

  // Context üzerinden sağlanacak değerler ve işlevler
  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUserPoints,
    refreshUserPoints
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Bileşenlerin User Context'ine kolayca erişmesini sağlayan özel hook.
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser hook\'u yalnızca bir UserProvider içinde kullanılabilir.');
  }
  return context;
};