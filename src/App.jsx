// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Home from './pages/Home'
import CartPage from './pages/CartPage' // 👈 new import
import ProductDetail from './pages/ProductDetail'
import AboutUs from './pages/AboutUs' // 👈 Add this import
 // 👈 new
import PrivacyPolicy from './pages/PrivacyPolicy' // 👈 Add import


function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<CartPage />} /> {/* 👈 new route */}
      <Route path="/product/:id" element={<ProductDetail />} /> {/* 👈 new */}
      <Route path="/privacy" element={<PrivacyPolicy />} /> {/* 👈 Add this */}
      <Route path="/about" element={<AboutUs />} /> {/* 👈 Add this route */}


    </Routes>
  )
}

export default App