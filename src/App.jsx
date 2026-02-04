// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Home from './pages/Home'
import CartPage from './pages/CartPage' // 👈 new import
import ProductDetail from './pages/ProductDetail'
import AboutUs from './pages/AboutUs' // 👈 Add this import
 // 👈 new
import PrivacyPolicy from './pages/PrivacyPolicy' // 👈 Add import
import TermsOfService from './pages/TermsOfService';
import OrderSuccess from './pages/OrderSuccess'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<CartPage />} /> {/* 👈 new route */}
      <Route path="/product/:id" element={<ProductDetail />} /> {/* 👈 new */}
      <Route path="/privacy" element={<PrivacyPolicy />} /> {/* 👈 Add this */}
      <Route path="/about" element={<AboutUs />} /> {/* 👈 Add this route */}
<Route path="/terms-of-service" element={<TermsOfService />} />
<Route path="/order-success" element={<OrderSuccess />} />

    </Routes>
  )
}

export default App