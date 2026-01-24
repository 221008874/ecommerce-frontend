// src/context/LanguageContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

// Translations
const translations = {
  ar: {
    appName: 'شوب إيزي',
    featuredProducts: 'المنتجات المميزة',
    addToCart: 'أضف إلى السلة',
    cart: 'السلة',
    total: 'الإجمالي',
    checkout: 'إتمام الشراء',
    continueShopping: 'متابعة التسوق',
    emptyCart: 'سلة التسوق فارغة',
    addProducts: 'أضف بعض المنتجات إلى سلة التسوق!',
    price: 'السعر',
    quantity: 'الكمية',
    remove: 'إزالة',
    theme: 'الوضع',
    lightMode: 'وضع النهار',
    darkMode: 'وضع الليل',
    viewDetails: 'عرض التفاصيل',
    piecesPerBox: 'عدد القطع في العلبة',
    flavors: 'النكهات',
    description: 'الوصف',
    backToProducts: 'العودة إلى المنتجات',
    goToCart: 'الذهاب إلى السلة'
  },
  en: {
    appName: 'ShopEasy',
    featuredProducts: 'Featured Products',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    emptyCart: 'Your cart is empty',
    addProducts: 'Add some products to your cart!',
    price: 'Price',
    quantity: 'Quantity',
    remove: 'Remove',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    viewDetails: 'View Details',
    piecesPerBox: 'Pieces per Box',
    flavors: 'Flavors',
    description: 'Description',
    backToProducts: 'Back to Products',
    goToCart: 'Go to Cart'
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en') // Default: English

  // Load saved language
  useEffect(() => {
    const saved = localStorage.getItem('language')
    if (saved === 'ar' || saved === 'en') {
      setLang(saved)
    }
  }, [])

  // Apply direction & language to body
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('language', lang)
  }, [lang])

  const t = (key) => translations[lang][key] || key

  const toggleLanguage = () => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)