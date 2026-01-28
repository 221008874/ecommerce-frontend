// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'
import { db } from '../services/firebase'
import { collection, getDocs } from 'firebase/firestore'
import heroImage from '../assets/mainBG.jpg'
import facebookIcon from '../assets/facebook.png'
import instagramIcon from '../assets/instagram.png'
import twitterIcon from '../assets/twitter.png'
import whatsappIcon from '../assets/whatsapp.png'
export default function Home() {
  const { toggleTheme, theme, getImage } = useTheme()
  const { totalItems } = useCart()
  const { t, lang, toggleLanguage } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const colors = {
    light: {
      primary: '#3E2723',
      secondary: '#D4A017',
      background: '#F8F4F0',
      card: '#FCFAF8',
      textDark: '#2E1B1B',
      textLight: '#6B5E57',
      border: '#E8DDD4'
    },
    dark: {
      primary: '#F8F4F0',
      secondary: '#D4A017',
      background: '#1A1412',
      card: '#2E1B1B',
      textDark: '#F8F4F0',
      textLight: '#C4B5AD',
      border: '#3E2723'
    }
  }

  const c = theme === 'light' ? colors.light : colors.dark

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
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: c.background,
          color: c.textDark,
          fontSize: '1.25rem',
          fontFamily: 'Georgia, serif'
        }}
      >
        Loading premium chocolates...
      </div>
    )
  }

  return (
    <>
      {/* HERO IMAGE SECTION WITH CONTROLS */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '70vh',
          minHeight: '500px',
          maxHeight: '700px',
          overflow: 'hidden',
          background: c.card
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: theme === 'dark' ? 'brightness(0.7)' : 'brightness(0.9)',
            transition: 'filter 0.3s ease'
          }}
        />

        {/* Overlay for text readability */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: theme === 'light' 
              ? 'linear-gradient(to bottom, rgba(248,244,240,0.2), rgba(62,39,35,0.5))' 
              : 'linear-gradient(to bottom, rgba(26,20,18,0.3), rgba(46,27,27,0.6))',
            transition: 'background 0.3s ease'
          }}
        />

        {/* TOP CONTROLS - Positioned at top corners */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '1.5rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          {/* Left Side - Language Toggle */}
          <button
            onClick={toggleLanguage}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `2px solid rgba(255, 255, 255, 0.3)`,
              borderRadius: '24px',
              padding: '0.6rem 1.2rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              color: '#FFFFFF',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              minWidth: '70px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
            aria-label={`Switch to ${lang === 'ar' ? 'English' : 'العربية'}`}
          >
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>

          {/* Right Side - Theme Toggle & Cart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `2px solid rgba(255, 255, 255, 0.3)`,
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                  e.currentTarget.style.transform = 'scale(1.05) rotate(15deg)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.opacity = '0.8'
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
              aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Cart Link */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `2px solid rgba(255, 255, 255, 0.3)`,
                borderRadius: '50%',
                width: '52px',
                height: '52px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.5rem',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)'
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                }
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.opacity = '0.8'
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
              aria-label={t('cart')}
            >
              🛒
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#DC2626',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: `2px solid #FFFFFF`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* CENTERED LOGO & HERO CONTENT */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            zIndex: 1
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'clamp(1rem, 3vh, 2rem)'
            }}
          >
            {/* Logo Image - Centered */}
            <div 
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                animation: 'fadeInScale 1s ease-out'
              }}
            >
              <img 
                src={getImage('logo')} 
                alt="Louable Logo" 
                style={{ 
                  height: 'clamp(120px, 25vh, 250px)',
                  width: 'auto',
                  maxWidth: '90%',
                  objectFit: 'contain',
                  filter: theme === 'dark' 
                    ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.6)) brightness(1.1)' 
                    : 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
                  transition: 'all 0.3s ease'
                }} 
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
              />
            </div>

            {/* Logo Text - Centered */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                fontFamily: 'Georgia, serif',
                color: '#FFFFFF',
                margin: 0,
                fontWeight: 'bold',
                textShadow: '3px 3px 12px rgba(0,0,0,0.6)',
                letterSpacing: '2px',
                animation: 'fadeInScale 1.2s ease-out'
              }}
            >
              {t('Louable')}
            </h1>

            {/* Featured Products Heading */}
            <h2
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                fontFamily: 'Georgia, serif',
                color: '#F8F4F0',
                margin: 0,
                fontWeight: '600',
                textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                letterSpacing: '1px',
                animation: 'fadeInUp 1.4s ease-out'
              }}
            >
              {t('featuredProducts')}
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.5rem)',
                color: '#F8F4F0',
                margin: 0,
                fontFamily: 'Georgia, serif',
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
                fontStyle: 'italic',
                opacity: 0.95,
                animation: 'fadeInUp 1.6s ease-out'
              }}
            >
              Discover our premium chocolate collection ✨
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section
        style={{
          background: c.background,
          padding: '4rem 2rem',
          transition: 'background 0.3s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto'
          }}
        >
          {/* Products Grid */}
          {products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: c.textLight
              }}
            >
              <div 
                style={{ 
                  fontSize: '4rem', 
                  marginBottom: '1rem',
                  animation: 'bounce 2s ease-in-out infinite'
                }}
              >
                🍫
              </div>
              <p style={{ fontSize: '1.25rem', fontFamily: 'Georgia, serif' }}>
                No products available yet
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
                animation: 'fadeIn 0.6s ease-in-out'
              }}
            >
              {products.map((product, index) => (
                <div
                  key={product.id}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer
        style={{
          background: theme === 'light' 
            ? `linear-gradient(135deg, ${c.primary} 0%, ${c.textDark} 100%)`
            : `linear-gradient(135deg, ${c.card} 0%, ${c.background} 100%)`,
          color: theme === 'light' ? '#F8F4F0' : c.textDark,
          padding: '3rem 2rem 2rem',
          borderTop: `2px solid ${c.secondary}`,
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            marginBottom: '2rem'
          }}
        >
          {/* Brand Section */}
          <div>
            <h3
              style={{
                fontSize: '1.75rem',
                fontFamily: 'Georgia, serif',
                color: c.secondary,
                marginBottom: '1rem',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}
            >
              {t('Louable')}
            </h3>
            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                opacity: 0.9,
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic'
              }}
            >
              {t('footerTagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '1.25rem',
                fontFamily: 'Georgia, serif',
                color: c.secondary,
                marginBottom: '1rem',
                fontWeight: '600'
              }}
            >
              {t('quickLinks')}
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}
            >
              {[
                { key: 'home', label: t('home') },
                { key: 'products', label: t('products') },
                { key: 'aboutUs', label: t('aboutUs') },
                { key: 'contact', label: t('contact') }
              ].map((link) => (
                <li key={link.key} style={{ marginBottom: '0.75rem' }}>
                  <a
                    href="#"
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: 0.85,
                      transition: 'all 0.3s ease',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1'
                      e.currentTarget.style.transform = lang === 'ar' ? 'translateX(-5px)' : 'translateX(5px)'
                      e.currentTarget.style.color = c.secondary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.85'
                      e.currentTarget.style.transform = 'translateX(0)'
                      e.currentTarget.style.color = 'inherit'
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                fontSize: '1.25rem',
                fontFamily: 'Georgia, serif',
                color: c.secondary,
                marginBottom: '1rem',
                fontWeight: '600'
              }}
            >
              {t('contactUs')}
            </h4>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.8', opacity: 0.9 }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                📧 louablefactory@gmail.com
              </p>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                📱 +20 123 456 7890
              </p>
              <p style={{ margin: '0 0 0.5rem 0' }}>
                📍 Luxor, Egypt
              </p>
            </div>
          </div>

          {/* Social Media */}
<div>
  <h4
    style={{
      fontSize: '1.25rem',
      fontFamily: 'Georgia, serif',
      color: c.secondary,
      marginBottom: '1rem',
      fontWeight: '600'
    }}
  >
    {t('followUs')}
  </h4>
  <div
    style={{
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    }}
  >
    {[
      { icon: facebookIcon, name: 'Facebook' },
      { icon: instagramIcon, name: 'Instagram' },
      { icon: twitterIcon, name: 'Twitter' },
      { icon: whatsappIcon, name: 'WhatsApp' }
    ].map((social) => (
      <a
        key={social.name}
        href="#"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '45px',
          height: '45px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          border: `2px solid ${c.secondary}40`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = c.secondary
          e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'
          e.currentTarget.style.borderColor = c.secondary
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
          e.currentTarget.style.borderColor = `${c.secondary}40`
        }}
        aria-label={social.name}
      >
        {/* ✅ Render as img tag */}
        <img
          src={social.icon}
          alt={social.name}
          style={{
            width: '24px',
            height: '24px',
            objectFit: 'contain'
          }}
        />
      </a>
    ))}
  </div>
</div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            marginTop: '2rem',
            borderTop: `1px solid ${theme === 'light' ? 'rgba(255,255,255,0.2)' : c.border}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            textAlign: 'center'
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              opacity: 0.8
            }}
          >
            © {new Date().getFullYear()} {t('Louable')}. {t('allRightsReserved')}.
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.85rem',
              opacity: 0.7,
              fontStyle: 'italic'
            }}
          >
            {t('handcraftedWith')}  {lang === '' ? '' : ''} ❤️
          </p>
        </div>
      </footer>

      {/* Add animations */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @media (max-width: 768px) {
            /* Mobile optimizations */
            section {
              min-height: 450px !important;
            }
          }
        `}
      </style>
    </>
  )
}