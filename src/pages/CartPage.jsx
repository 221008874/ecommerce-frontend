// src/pages/CartPage.jsx
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart()
  const { t, lang } = useLanguage()
  const { theme, getImage } = useTheme()
  const navigate = useNavigate()

  const colors = {
    light: {
      primary: '#3E2723',
      secondary: '#D4A017',
      background: '#F8F4F0',
      card: '#FCFAF8',
      textDark: '#2E1B1B',
      textLight: '#6B5E57',
      success: '#8BC34A',
      danger: '#D32F2F',
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
      danger: '#EF5350',
      border: '#3E2723'
    }
  }

  const c = theme === 'light' ? colors.light : colors.dark

  if (totalItems === 0) {
    return (
      <div style={{ 
        padding: 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 24px)',
        textAlign: 'center', 
        background: c.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Logo in empty cart */}
        <div style={{
          position: 'absolute',
          top: 'clamp(16px, 3vw, 24px)',
          left: lang === 'ar' ? 'auto' : 'clamp(16px, 3vw, 24px)',
          right: lang === 'ar' ? 'clamp(16px, 3vw, 24px)' : 'auto',
          height: 'clamp(50px, 10vw, 60px)'
        }}>
          <img 
            src={getImage('logo')} 
            alt="Louable" 
            style={{ height: '100%' }} 
          />
        </div>

        <div style={{
          fontSize: 'clamp(3.5rem, 12vw, 5rem)',
          marginBottom: 'clamp(16px, 4vw, 24px)',
          opacity: 0.3,
          filter: 'grayscale(40%) sepia(20%) hue-rotate(10deg)'
        }}>
          🛒
        </div>
        
        <h2 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2rem)',
          marginBottom: '12px',
          fontWeight: '700',
          color: c.textDark
        }}>
          {t('emptyCart')}
        </h2>
        
        <p style={{ 
          margin: '0 0 clamp(24px, 5vw, 32px) 0',
          color: c.textLight,
          fontSize: 'clamp(0.9rem, 3vw, 1.1rem)',
          maxWidth: '90%'
        }}>
          {t('addProducts')}
        </p>
        
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: 'clamp(12px, 3vw, 14px) clamp(24px, 6vw, 32px)',
            background: c.success,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: 'clamp(0.9rem, 3vw, 1rem)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.backgroundColor = '#7CB342'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 195, 74, 0.4)'
            }
          }}
          onMouseLeave={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.backgroundColor = c.success
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
          {t('continueShopping')}
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 24px) clamp(60px, 10vw, 80px)',
      background: c.background,
      minHeight: '100vh',
      animation: 'fadeIn 0.5s ease-out',
      position: 'relative'
    }}>
      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: 'clamp(16px, 3vw, 24px)',
        left: lang === 'ar' ? 'auto' : 'clamp(16px, 3vw, 24px)',
        right: lang === 'ar' ? 'clamp(16px, 3vw, 24px)' : 'auto',
        zIndex: 10,
        height: 'clamp(50px, 10vw, 60px)'
      }}>
        <img 
          src={getImage('logo')} 
          alt="Louable" 
          style={{ height: '100%' }} 
        />
      </div>

      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        paddingTop: 'clamp(50px, 10vw, 60px)' 
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'clamp(24px, 5vw, 32px)',
          gap: 'clamp(12px, 3vw, 16px)',
          flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
          flexWrap: 'wrap'
        }}>
          <h2 style={{ 
            margin: 0,
            fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
            fontWeight: '700',
            color: c.textDark
          }}>
            {t('cart')} ({totalItems})
          </h2>
          
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: 'clamp(8px, 2vw, 10px) clamp(16px, 3vw, 20px)',
              background: 'transparent',
              border: `2px solid ${c.primary}`,
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              cursor: 'pointer',
              color: c.primary,
              fontWeight: '600',
              fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.background = c.primary
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.transform = 'translateX(-2px)'
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
            ← {t('continueShopping')}
          </button>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'clamp(12px, 3vw, 16px)',
          marginBottom: 'clamp(24px, 5vw, 32px)'
        }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: 'clamp(12px, 3vw, 20px)',
                padding: 'clamp(16px, 3vw, 24px)',
                backgroundColor: c.card,
                borderRadius: 'clamp(10px, 2vw, 12px)',
                alignItems: 'center',
                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.4s ease-out ${index * 0.1}s backwards`,
                border: `1px solid ${c.border}`,
                boxShadow: theme === 'light' 
                  ? '0 2px 8px rgba(62, 39, 35, 0.08)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
                flexWrap: 'wrap'
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = theme === 'light'
                    ? '0 4px 16px rgba(62, 39, 35, 0.12)'
                    : '0 4px 16px rgba(0, 0, 0, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = theme === 'light'
                    ? '0 2px 8px rgba(62, 39, 35, 0.08)'
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              {/* Product Image */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: 'clamp(60px, 15vw, 80px)',
                    height: 'clamp(60px, 15vw, 80px)',
                    objectFit: 'cover',
                    borderRadius: 'clamp(6px, 1.5vw, 8px)',
                    border: `1px solid ${c.border}`,
                    flexShrink: 0
                  }}
                />
              ) : (
                <div style={{
                  width: 'clamp(60px, 15vw, 80px)',
                  height: 'clamp(60px, 15vw, 80px)',
                  background: theme === 'light'
                    ? 'linear-gradient(135deg, #E8DDD4 0%, #D4C4B8 100%)'
                    : 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)',
                  borderRadius: 'clamp(6px, 1.5vw, 8px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  flexShrink: 0,
                  border: `1px solid ${c.border}`
                }}>
                  🍫
                </div>
              )}

              <div style={{ 
                flex: 1,
                textAlign: lang === 'ar' ? 'right' : 'left',
                minWidth: 0
              }}>
                <h3 style={{ 
                  margin: '0 0 clamp(4px, 1vw, 8px) 0',
                  fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
                  fontWeight: '600',
                  color: c.textDark,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {item.name}
                </h3>
                <p style={{ 
                  color: c.secondary,
                  fontWeight: '700', 
                  margin: 0,
                  fontSize: 'clamp(1rem, 3.5vw, 1.2rem)'
                }}>
                  ${item.price.toFixed(2)}
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'clamp(8px, 2vw, 12px)',
                background: c.background,
                padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 12px)',
                borderRadius: 'clamp(6px, 1.5vw, 8px)',
                border: `1px solid ${c.border}`
              }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: 'clamp(28px, 7vw, 32px)',
                    height: 'clamp(28px, 7vw, 32px)',
                    background: 'transparent',
                    border: `1px solid ${c.primary}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                    fontWeight: '700',
                    color: c.primary,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.background = c.accent || c.primary
                      e.currentTarget.style.color = '#FFFFFF'
                      e.currentTarget.style.borderColor = c.accent || c.primary
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = c.primary
                      e.currentTarget.style.borderColor = c.primary
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.opacity = '0.7'
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  −
                </button>
                
                <span style={{ 
                  minWidth: 'clamp(24px, 6vw, 32px)',
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: 'clamp(0.9rem, 3vw, 1rem)',
                  color: c.textDark
                }}>
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: 'clamp(28px, 7vw, 32px)',
                    height: 'clamp(28px, 7vw, 32px)',
                    background: 'transparent',
                    border: `1px solid ${c.primary}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                    fontWeight: '700',
                    color: c.primary,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.background = c.accent || c.primary
                      e.currentTarget.style.color = '#FFFFFF'
                      e.currentTarget.style.borderColor = c.accent || c.primary
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (window.innerWidth >= 768) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = c.primary
                      e.currentTarget.style.borderColor = c.primary
                      e.currentTarget.style.transform = 'scale(1)'
                    }
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.opacity = '0.7'
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
                  color: c.danger,
                  background: 'transparent',
                  border: `1px solid ${c.danger}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  marginLeft: lang === 'ar' ? '0' : 'auto',
                  marginRight: lang === 'ar' ? 'auto' : '0',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.background = c.danger
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth >= 768) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = c.danger
                    e.currentTarget.style.transform = 'scale(1)'
                  }
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.opacity = '0.7'
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                {t('remove')}
              </button>
            </div>
          ))}
        </div>

        <div style={{
          padding: 'clamp(24px, 5vw, 32px)',
          background: c.card,
          borderRadius: 'clamp(10px, 2vw, 12px)',
          maxWidth: '500px',
          margin: '0 auto',
          animation: 'slideUp 0.6s ease-out 0.3s backwards',
          border: `2px solid ${c.border}`,
          boxShadow: theme === 'light'
            ? '0 4px 20px rgba(62, 39, 35, 0.12)'
            : '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
            fontWeight: '700',
            color: c.textDark,
            marginBottom: 'clamp(16px, 4vw, 24px)',
            flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span>{t('total')}:</span>
            <span style={{ color: c.secondary }}>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={() => alert('Checkout not implemented yet')}
            style={{
              width: '100%',
              padding: 'clamp(12px, 3vw, 16px)',
              background: c.success,
              color: 'white',
              border: 'none',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              fontWeight: '700',
              fontSize: 'clamp(0.95rem, 3vw, 1.1rem)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.backgroundColor = '#7CB342'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 195, 74, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              if (window.innerWidth >= 768) {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.backgroundColor = c.success
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
            ✓ {t('checkout')}
          </button>
        </div>
      </div>
    </div>
  )
}