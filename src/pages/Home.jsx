// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import { db } from '../services/firebase' // 👈 fix typo: "srvices" → "lib"
import { collection, getDocs } from 'firebase/firestore'

export default function Home() {
  const { toggleTheme, theme } = useTheme()
  const { totalItems } = useCart()
  const { t, lang, toggleLanguage } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'))
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(productList)
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        Loading products...
      </div>
    )
  }

  return (
    <>
      <header style={{
        padding: '20px 32px',
        background: theme === 'light' ? '#FFFFFF' : '#2C2416',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: `1px solid ${theme === 'light' ? '#F0F0F0' : '#3A3A3A'}`,
        transition: 'all 0.3s ease'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: '700',
          color: theme === 'light' ? '#2C2416' : '#FFFFFF',
          letterSpacing: '-0.5px'
        }}>
          {t('appName')}
        </h1>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Cart Link */}
          <Link
            to="/cart"
            style={{
              background: 'transparent',
              border: `2px solid ${theme === 'light' ? '#2C2416' : '#FFFFFF'}`,
              borderRadius: '8px',
              width: '44px',
              height: '44px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme === 'light' ? '#2C2416' : '#FFFFFF'
              e.currentTarget.querySelector('span').style.filter = 'invert(1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.querySelector('span').style.filter = 'invert(0)'
            }}
            aria-label={t('cart')}
          >
            <span style={{ fontSize: '1.2rem', transition: 'filter 0.2s ease' }}>🛒</span>
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: lang === 'ar' ? 'auto' : '-6px',
                left: lang === 'ar' ? '-6px' : 'auto',
                background: '#FF6B6B',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '0.7rem',
                fontWeight: '700',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: `2px solid ${theme === 'light' ? '#2C2416' : '#FFFFFF'}`,
              borderRadius: '8px',
              width: '44px',
              height: '44px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme === 'light' ? '#2C2416' : '#FFFFFF'
              e.currentTarget.querySelector('span').style.filter = 'invert(1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.querySelector('span').style.filter = 'invert(0)'
            }}
            aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
          >
            <span style={{ transition: 'filter 0.2s ease' }}>{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              background: 'transparent',
              border: `2px solid ${theme === 'light' ? '#2C2416' : '#FFFFFF'}`,
              borderRadius: '8px',
              width: '44px',
              height: '44px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme === 'light' ? '#2C2416' : '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme === 'light' ? '#2C2416' : '#FFFFFF'
              e.currentTarget.style.color = theme === 'light' ? '#FFFFFF' : '#2C2416'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = theme === 'light' ? '#2C2416' : '#FFFFFF'
            }}
            aria-label={`Switch to ${lang === 'ar' ? 'English' : 'العربية'}`}
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
        </div>
      </header>

      <main style={{ 
        padding: '60px 32px 80px', 
        background: theme === 'light' ? '#FFFFFF' : '#1A1A1A',
        minHeight: 'calc(100vh - 84px)',
        transition: 'background 0.3s ease'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px', textAlign: lang === 'ar' ? 'right' : 'left' }}>
            <h2 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '2.5rem', 
              fontWeight: '700',
              color: theme === 'light' ? '#2C2416' : '#FFFFFF',
              letterSpacing: '-1px'
            }}>
              {t('featuredProducts')}
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '32px'
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}