// src/components/CartBadge.jsx
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'

export default function CartBadge({ isMobile = false }) {
  const { totalItems } = useCart()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const colors = {
    light: {
      primary: '#3E2723',
      secondary: '#D4A017',
      textDark: '#2E1B1B',
    },
    dark: {
      primary: '#F8F4F0',
      secondary: '#D4A017',
      textDark: '#F8F4F0',
    }
  }

  const c = theme === 'light' ? colors.light : colors.dark

  return (
    <div
      onClick={() => navigate('/cart')}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `2px solid rgba(255, 255, 255, 0.4)`,
        borderRadius: '50%',
        width: isMobile ? '48px' : '56px',
        height: isMobile ? '48px' : '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: isMobile ? '1.3rem' : '1.5rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        color: '#FFFFFF',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
        e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
        e.currentTarget.style.transform = 'scale(1) translateY(0)'
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)'
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.9)'
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      🛒
      {totalItems > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'linear-gradient(135deg, #FF3B3B, #DC2626)',
            color: '#fff',
            borderRadius: '50%',
            width: isMobile ? '22px' : '26px',
            height: isMobile ? '22px' : '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '0.65rem' : '0.75rem',
            fontWeight: 'bold',
            border: `3px solid #FFFFFF`,
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
            animation: 'cartBadgePulse 2s ease-in-out infinite'
          }}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </div>
  )
}
