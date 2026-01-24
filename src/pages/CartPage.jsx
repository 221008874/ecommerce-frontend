import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart()
  const { t, lang } = useLanguage()
  const { theme } = useTheme()
  const navigate = useNavigate()

  if (totalItems === 0) {
    return (
      <div style={{ 
        padding: '60px 24px', 
        textAlign: 'center', 
        background: theme === 'light' ? '#FFFFFF' : '#1A1A1A',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Empty Cart Icon */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '24px',
          opacity: 0.3
        }}>
          🛒
        </div>
        
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '12px',
          fontWeight: '700',
          color: theme === 'light' ? '#2C2416' : '#FFFFFF'
        }}>
          {t('emptyCart')}
        </h2>
        
        <p style={{ 
          margin: '0 0 32px 0', 
          color: theme === 'light' ? '#666666' : '#A0A0A0',
          fontSize: '1.1rem'
        }}>
          {t('addProducts')}
        </p>
        
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '14px 32px',
            background: '#FF6B6B',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '1rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.backgroundColor = '#FF5252'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.backgroundColor = '#FF6B6B'
          }}
        >
          {t('continueShopping')}
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '32px 24px 80px', 
      background: theme === 'light' ? '#FFFFFF' : '#1A1A1A',
      minHeight: '100vh',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
        }}>
          <h2 style={{ 
            margin: 0,
            fontSize: '2rem', 
            fontWeight: '700',
            color: theme === 'light' ? '#2C2416' : '#FFFFFF'
          }}>
            {t('cart')} 
            <span style={{
              marginLeft: lang === 'ar' ? '0' : '12px',
              marginRight: lang === 'ar' ? '12px' : '0',
              color: '#FF6B6B',
              fontSize: '1.5rem'
            }}>
              ({totalItems})
            </span>
          </h2>
          
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `2px solid ${theme === 'light' ? '#2C2416' : '#FFFFFF'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              color: theme === 'light' ? '#2C2416' : '#FFFFFF',
              fontWeight: '600',
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
          >
            ← {t('continueShopping')}
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          {items.map((item, index) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '20px',
                padding: '24px',
                backgroundColor: theme === 'light' ? '#FAFAFA' : '#2C2416',
                borderRadius: '8px',
                alignItems: 'center',
                flexDirection: lang === 'ar' ? 'row-reverse' : 'row',
                transition: 'all 0.3s ease',
                animation: `slideUp 0.4s ease-out ${index * 0.1}s backwards`,
                border: `1px solid ${theme === 'light' ? '#F0F0F0' : '#3A3A3A'}`
              }}
            >
              {/* Product Image Placeholder */}
              <div style={{
                width: '80px',
                height: '80px',
                background: theme === 'light'
                  ? 'linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%)'
                  : 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '2rem',
                flexShrink: 0
              }}>
                📦
              </div>

              {/* Product Info */}
              <div style={{ 
                flex: 1,
                textAlign: lang === 'ar' ? 'right' : 'left'
              }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: theme === 'light' ? '#2C2416' : '#FFFFFF'
                }}>
                  {item.name}
                </h3>
                <p style={{ 
                  color: '#FF6B6B',
                  fontWeight: '700', 
                  margin: 0,
                  fontSize: '1.2rem'
                }}>
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                background: theme === 'light' ? '#FFFFFF' : '#1A1A1A',
                padding: '8px 12px',
                borderRadius: '8px',
                border: `1px solid ${theme === 'light' ? '#E0E0E0' : '#3A3A3A'}`
              }}>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'transparent',
                    border: `1px solid ${theme === 'light' ? '#2C2416' : '#FFFFFF'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: theme === 'light' ? '#2C2416' : '#FFFFFF',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF6B6B'
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#FF6B6B'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = theme === 'light' ? '#2C2416' : '#FFFFFF'
                    e.currentTarget.style.borderColor = theme === 'light' ? '#2C2416' : '#FFFFFF'
                  }}
                >
                  −
                </button>
                
                <span style={{ 
                  minWidth: '32px', 
                  textAlign: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  color: theme === 'light' ? '#2C2416' : '#FFFFFF'
                }}>
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'transparent',
                    border: `1px solid ${theme === 'light' ? '#2C2416' : '#FFFFFF'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: theme === 'light' ? '#2C2416' : '#FFFFFF',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF6B6B'
                    e.currentTarget.style.color = '#FFFFFF'
                    e.currentTarget.style.borderColor = '#FF6B6B'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = theme === 'light' ? '#2C2416' : '#FFFFFF'
                    e.currentTarget.style.borderColor = theme === 'light' ? '#2C2416' : '#FFFFFF'
                  }}
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  padding: '10px 16px',
                  color: '#EF5350',
                  background: 'transparent',
                  border: '1px solid #EF5350',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  marginLeft: lang === 'ar' ? '0' : '16px',
                  marginRight: lang === 'ar' ? '16px' : '0'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EF5350'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#EF5350'
                }}
              >
                {t('remove')}
              </button>
            </div>
          ))}
        </div>

        {/* Summary & Checkout */}
        <div style={{
          padding: '32px',
          background: theme === 'light' ? '#FAFAFA' : '#2C2416',
          borderRadius: '8px',
          maxWidth: '500px',
          margin: '0 auto',
          animation: 'slideUp 0.6s ease-out 0.3s backwards',
          border: `1px solid ${theme === 'light' ? '#F0F0F0' : '#3A3A3A'}`
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '1.5rem', 
            fontWeight: '700',
            color: theme === 'light' ? '#2C2416' : '#FFFFFF',
            marginBottom: '24px',
            flexDirection: lang === 'ar' ? 'row-reverse' : 'row'
          }}>
            <span>{t('total')}:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <button
            onClick={() => alert('Checkout not implemented yet')}
            style={{
              width: '100%',
              padding: '16px',
              background: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.backgroundColor = '#FF5252'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.backgroundColor = '#FF6B6B'
            }}
          >
            ✓ {t('checkout')}
          </button>
        </div>
      </div>
    </div>
  )
}