// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Home from './pages/Home'
import CartPage from './pages/CartPage' // 👈 new import
import ProductDetail from './pages/ProductDetail' // 👈 new


function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<CartPage />} /> {/* 👈 new route */}
      <Route path="/product/:id" element={<ProductDetail />} /> {/* 👈 new */}

    </Routes>
  )
}

export default App