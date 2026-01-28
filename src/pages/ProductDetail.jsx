// src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { db } from '../services/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const { addToCart } = useCart()
  const { theme, getImage } = useTheme()
  const [product, setProduct] = useState(null)

  const colors = {
    light: {
      primary: '#3E2723',
      secondary: '#D4A017',
      background: '#F8F4F0',
      card: '#FCFAF8',
      textDark: '#2E1B1B',
      textLight: '#6B5E57',
      success: '#8BC34A',
      accent: '#5D4037',
      border: '#E8DDD4'
    },
    dark: {
      primary: '#2E1B1B',
      secondary: '#D4A017',
      background: '#1A1412',
      card: '#2E1B1B',
      textDark: '#F8F4F0',
      textLight: '#C4B5AD',
      success: '#8BC34A',
      accent: '#5D4037',
      border: '#3E2723'
    }
  }

  const c = theme === 'light' ? colors.light : colors.dark

  useEffect(() => {
    if (!id) {
      navigate('/home')
      return
    }

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() })
        } else {
          navigate('/home')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        navigate('/home')
      }
    }
    fetchProduct()
  }, [id, navigate])

  if (!product) {
    return (
      <div style={{ 
        padding: '24px', 
        textAlign: 'center',
        background: c.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: `4px solid ${c.border}`,
          borderTop: `4px solid ${c.secondary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product)
    const successMsg = document.createElement('div')
    successMsg.textContent = '✓ Added to cart!'
    successMsg.style.cssText = `
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: ${c.success};
      color: white;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 700;
      box-shadow: 0 4px 20px rgba(139, 195, 74, 0.4);
      z-index: 1000;
      animation: slideUp 0.3s ease-out;
      font-size: clamp(0.9rem, 3vw, 1rem);
    `
    document.body.appendChild(successMsg)
    setTimeout(() => successMsg.remove(), 2000)
  }

  return (
    <div style={{ 
      padding: 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 24px)',
      backgroundColor: c.background,
      minHeight: '100vh',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header with Logo and Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(20px, 4vw, 24px)',
          gap: 'clamp(12px, 3vw, 16px)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              background: 'transparent',
              border: `2px solid ${c.primary}`,
              color: c.primary,
              cursor: 'pointer',
              fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(6px, 1.5vw, 8px)',
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 20px)',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.background = c.primary
                e.currentTarget.style.color = theme === 'light' ? '#FFFFFF' : c.textDark
                e.currentTarget.style.transform = 'translateX(-4px)'
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = c.primary
                e.currentTarget.style.transform = 'translateX(0)'
              }
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.opacity = '0.7'
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          >
            ← {t('backToProducts')}
          </button>
          
          <div style={{
            height: 'clamp(50px, 10vw, 60px)'
          }}>
            <img 
              src={getImage('logo')} 
              alt="Louable" 
              style={{ height: '100%' }} 
            />
          </div>
        </div>

        <div style={{
          background: c.card,
          borderRadius: 'clamp(12px, 2vw, 16px)',
          padding: 'clamp(20px, 4vw, 32px)',
          border: `1px solid ${c.border}`,
          boxShadow: theme === 'light'
            ? '0 4px 20px rgba(62, 39, 35, 0.1)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          {product?.imageUrl ? (
            <div style={{ 
              position: 'relative', 
              marginBottom: 'clamp(24px, 5vw, 32px)',
              borderRadius: 'clamp(10px, 2vw, 12px)',
              overflow: 'hidden'
            }}>
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 'clamp(300px, 50vw, 400px)',
                  objectFit: 'cover',
                  borderRadius: 'clamp(10px, 2vw, 12px)',
                  border: `1px solid ${c.border}`
                }}
              />
              <div style={{
                position: 'absolute',
                top: 'clamp(12px, 3vw, 16px)',
                right: lang === 'ar' ? 'auto' : 'clamp(12px, 3vw, 16px)',
                left: lang === 'ar' ? 'clamp(12px, 3vw, 16px)' : 'auto',
                background: c.secondary,
                color: '#FFFFFF',
                padding: 'clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(212, 160, 23, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ✨ Premium Quality
              </div>
            </div>
          ) : (
            <div style={{
              width: '100%',
              height: 'clamp(300px, 50vw, 400px)',
              background: theme === 'light' 
                ? 'linear-gradient(135deg, #E8DDD4 0%, #D4C4B8 100%)'
                : 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)',
              borderRadius: 'clamp(10px, 2vw, 12px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 'clamp(24px, 5vw, 32px)',
              fontSize: 'clamp(4rem, 12vw, 5rem)',
              border: `1px solid ${c.border}`
            }}>
              🍫
              <p style={{ 
                fontSize: 'clamp(0.9rem, 3vw, 1rem)', 
                color: c.textLight, 
                marginTop: '16px' 
              }}>
                Product Image
              </p>
            </div>
          )}

          <h1 style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            marginBottom: 'clamp(12px, 3vw, 16px)',
            color: c.textDark,
            fontWeight: '700',
            letterSpacing: '-0.5px',
            lineHeight: 1.2
          }}>
            {product.name}
          </h1>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'clamp(12px, 3vw, 16px)',
            marginBottom: 'clamp(20px, 4vw, 24px)',
            flexWrap: 'wrap'
          }}>
            <p style={{ 
              color: c.secondary, 
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: '700', 
              margin: 0 
            }}>
              ${product.price.toFixed(2)}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)',
              background: c.background, 
              borderRadius: '20px', 
              border: `1px solid ${c.border}` 
            }}>
              <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)' }}>⭐⭐⭐⭐⭐</span>
              <span style={{ 
                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                color: c.textLight, 
                fontWeight: '600' 
              }}>
                5.0
              </span>
            </div>
          </div>

          <p style={{ 
            fontWeight: '600', 
            color: c.textDark, 
            marginBottom: 'clamp(6px, 1.5vw, 8px)',
            fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' 
          }}>
            <strong>{t('piecesPerBox')}:</strong> 
            <span style={{ color: c.secondary, marginLeft: '8px' }}>
              {product.piecesPerBox} pieces
            </span>
          </p>
          
          <div style={{ marginBottom: 'clamp(20px, 4vw, 24px)' }}>
            <p style={{ 
              fontWeight: '600', 
              color: c.textDark, 
              marginBottom: 'clamp(10px, 2vw, 12px)',
              fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' 
            }}>
              <strong>{t('flavors')}:</strong>
            </p>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 'clamp(6px, 1.5vw, 8px)' 
            }}>
              {product.flavors.map((flavor, index) => (
                <span key={index} style={{
                  background: c.background,
                  padding: 'clamp(8px, 2vw, 10px) clamp(14px, 3vw, 18px)',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
                  color: c.textDark,
                  border: `1px solid ${c.border}`,
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.background = c.secondary
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.borderColor = c.secondary
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.background = c.background
                    e.currentTarget.style.color = c.textDark
                    e.currentTarget.style.borderColor = c.border
                  }
                }}
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 'clamp(24px, 5vw, 32px)' }}>
            <p style={{ 
              fontWeight: '600', 
              color: c.textDark, 
              marginBottom: 'clamp(10px, 2vw, 12px)',
              fontSize: 'clamp(0.95rem, 3vw, 1.1rem)' 
            }}>
              <strong>{t('description')}:</strong>
            </p>
            <p style={{ 
              color: c.textLight, 
              lineHeight: 1.8, 
              fontSize: 'clamp(0.9rem, 3vw, 1.05rem)' 
            }}>
              {product.description}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 'clamp(10px, 2vw, 12px)',
            flexWrap: 'wrap' 
          }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                minWidth: 'clamp(150px, 40vw, 200px)',
                padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                backgroundColor: c.success,
                color: 'white',
                border: 'none',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: 'clamp(0.9rem, 3vw, 1.05rem)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.backgroundColor = '#7CB342'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 195, 74, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.backgroundColor = c.success
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 195, 74, 0.3)'
                }
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.opacity = '0.85'
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              ✓ {t('addToCart')}
            </button>
            
            <button
              onClick={() => navigate('/cart')}
              style={{
                padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 24px)',
                backgroundColor: 'transparent',
                color: c.primary,
                border: `2px solid ${c.primary}`,
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: 'clamp(0.9rem, 3vw, 1.05rem)',
                transition: 'all 0.3s ease',
                minWidth: 'clamp(120px, 30vw, 150px)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.backgroundColor = c.primary
                  e.currentTarget.style.color = theme === 'light' ? '#FFFFFF' : c.textDark
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = c.primary
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.opacity = '0.7'
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              🛒 {t('goToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}