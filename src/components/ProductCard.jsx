// src/components/ProductCard.jsx
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage()
  const { theme } = useTheme()

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

  return (
    <div 
      style={{
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 'clamp(10px, 2vw, 12px)',
        padding: 'clamp(12px, 3vw, 16px)',
        width: '100%',
        maxWidth: '100%',
        boxShadow: theme === 'light'
          ? '0 4px 12px rgba(62, 39, 35, 0.08)'
          : '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(10px, 2vw, 12px)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = theme === 'light'
            ? '0 8px 24px rgba(62, 39, 35, 0.15)'
            : '0 8px 24px rgba(0, 0, 0, 0.5)'
          e.currentTarget.style.borderColor = c.secondary
        }
      }}
      onMouseLeave={(e) => {
        if (window.innerWidth >= 768) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = theme === 'light'
            ? '0 4px 12px rgba(62, 39, 35, 0.08)'
            : '0 4px 12px rgba(0, 0, 0, 0.3)'
          e.currentTarget.style.borderColor = c.border
        }
      }}
      onTouchStart={(e) => {
        e.currentTarget.style.opacity = '0.9'
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.opacity = '1'
      }}
    >
      {/* REAL CLOUDINARY IMAGE */}
      {product.imageUrl ? (
        <div style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          aspectRatio: '1 / 1'
        }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 'clamp(6px, 1.5vw, 8px)',
              transition: 'transform 0.3s ease'
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
          {/* Premium Badge */}
          <div style={{
            position: 'absolute',
            top: 'clamp(6px, 1.5vw, 8px)',
            right: lang === 'ar' ? 'auto' : 'clamp(6px, 1.5vw, 8px)',
            left: lang === 'ar' ? 'clamp(6px, 1.5vw, 8px)' : 'auto',
            background: c.secondary,
            color: '#FFFFFF',
            padding: 'clamp(3px, 1vw, 4px) clamp(6px, 1.5vw, 8px)',
            borderRadius: '4px',
            fontSize: 'clamp(0.65rem, 2vw, 0.7rem)',
            fontWeight: '700',
            boxShadow: '0 2px 8px rgba(212, 160, 23, 0.3)',
            whiteSpace: 'nowrap'
          }}>
            ✨ NEW
          </div>
        </div>
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: theme === 'light'
            ? 'linear-gradient(135deg, #E8DDD4 0%, #D4C4B8 100%)'
            : 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: c.textLight,
          fontSize: 'clamp(0.8rem, 2.5vw, 0.875rem)',
          border: `1px dashed ${c.border}`,
          flexDirection: 'column',
          gap: '8px'
        }}>
          <span style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>🍫</span>
          <span>No Image</span>
        </div>
      )}
      
      <h3 style={{ 
        margin: 0, 
        fontSize: 'clamp(0.9rem, 3vw, 1rem)',
        fontWeight: '600',
        color: c.textDark,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        transition: 'color 0.2s ease'
      }}>
        {product.name}
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(6px, 2vw, 8px)',
        flexWrap: 'wrap'
      }}>
        <p style={{ 
          color: c.secondary, 
          fontWeight: '700', 
          margin: 0,
          fontSize: 'clamp(1rem, 3.5vw, 1.2rem)',
          textShadow: theme === 'light' ? 'none' : '0 2px 4px rgba(212, 160, 23, 0.3)'
        }}>
          ${product.price.toFixed(2)}
        </p>
        
        {/* Rating Stars */}
        <div style={{
          display: 'flex',
          gap: '2px',
          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'
        }}>
          {'⭐'.repeat(5)}
        </div>
      </div>
      
      <Link
        to={`/product/${product.id}`}
        style={{
          marginTop: 'clamp(6px, 1.5vw, 8px)',
          padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
          backgroundColor: c.success,
          color: 'white',
          border: 'none',
          borderRadius: 'clamp(6px, 1.5vw, 8px)',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: 'clamp(0.85rem, 2.5vw, 0.9rem)',
          textAlign: 'center',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(139, 195, 74, 0.3)',
          display: 'block'
        }}
        onMouseEnter={(e) => {
          if (window.innerWidth >= 768) {
            e.currentTarget.style.backgroundColor = '#7CB342'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 195, 74, 0.4)'
          }
        }}
        onMouseLeave={(e) => {
          if (window.innerWidth >= 768) {
            e.currentTarget.style.backgroundColor = c.success
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 195, 74, 0.3)'
          }
        }}
        onTouchStart={(e) => {
          e.currentTarget.style.opacity = '0.85'
        }}
        onTouchEnd={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
      >
        {t('viewDetails')}
      </Link>
    </div>
  )
}