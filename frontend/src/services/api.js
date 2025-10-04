import axios from 'axios';

// Temel API linki
const BASE_URL = 'http://localhost:5000/api';

// Axios ögesini oluşturma
const api = axios.create({
  baseURL: BASE_URL,
});

// İsteklere token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// JWT tokenini çözümleme
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Geçersiz token');
  }
};

// Auth üzerinden yapılan API çağrıları
// Login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Giriş yapılırken hata:', error);
    throw error;
  }
};

// Register
export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Kaydolunurken hata:', error);
    throw error;
  }
};

// Quiz API çağrıları
export const getQuizzes = async () => {
  try {
    const response = await api.get('/quiz');
    return response.data;
  } catch (error) {
    console.error('Quizler yüklenirken hata:', error);
    throw error;
  }
};

export const submitQuizAnswers = async (answers) => {
  try {
    const response = await api.post('/quiz/submit', { answers });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

// Product API çağrıları
export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`); // Ürünleri görmek için authentication gerekmez
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const buyProduct = async (productId) => {
  try {
    const response = await api.post('/products/buy', { productId });
    return response.data;
  } catch (error) {
    console.error('Error buying product:', error);
    throw error;
  }
};

export const getUserPoints = async () => {
  try {
    const response = await api.get('/products/user-points');
    return response.data;
  } catch (error) {
    console.error('Error fetching user points:', error);
    throw error;
  }
};

export default api;