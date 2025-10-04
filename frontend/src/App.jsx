import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Products from "./pages/Products";
import Footer from "./components/Footer";
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import CartPage from "./pages/CartPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
        <UserProvider>
          <CartProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </Layout>
          </CartProvider>
        </UserProvider>
    </Router>
  );
}

export default App;