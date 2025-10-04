import { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

// Reducer fonksiyonunda kullanılacak eylem tipleri (Action Types)
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM', // Sepete yeni ürün ekleme veya miktarını arttırma
  REMOVE_ITEM: 'REMOVE_ITEM',   // Ürünü sepete ekleme
  UPDATE_QUANTITY: 'UPDATE_QUANTITY', // Sepetteki ürün miktarını değiştirme
  CLEAR_CART: 'CLEAR_CART',   // Sepet boşaltma
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      // Ürün sepette var mı diye bakar
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        // Varsa 1 arttırır
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Yoksa sepete 1 tane ekler
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case CART_ACTIONS.REMOVE_ITEM:
      // Seçilen ürünü filtereler
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case CART_ACTIONS.UPDATE_QUANTITY: {
      // Seçilen ürünün sepetteki sayısı 0 olursa onu sepetten çıkarır 
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        // Diğer durumda sayısını 1 azaltır
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case CART_ACTIONS.CLEAR_CART:
      // Sepetteki ürün listesini boş listeye dönüştürür
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product });
  };
  const removeItem = (productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { id: productId } });
  };
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { id: productId, quantity },
    });
  };
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPoints = state.items.reduce((sum, item) => sum + item.pointsCost * item.quantity, 0);

  // Cart context ile sağlanacak değerler
  const value = {
    items: state.items,
    totalItems,
    totalPoints,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Bileşenlerin Cart Context ile kolayca iletişimini sağlar
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    // Eğer hook, provider dışında kullanılırsa hata verir.
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};