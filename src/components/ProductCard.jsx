// src/components/ProductCard.jsx
import { useLanguage } from '../context/LanguageContext'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { t, lang } = useLanguage()

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '16px',
      width: '180px',
      boxShadow: '0 4px 12px var(--shadow)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {/* REAL CLOUDINARY IMAGE */}
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: '100%',
            height: '160px',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '160px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          border: '1px dashed var(--border-color)'
        }}>
          No Image
        </div>
      )}

      <h3 style={{ 
        margin: 0, 
        fontSize: '1rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {product.name}
      </h3>
      <p style={{ 
        color: '#4CAF50', 
        fontWeight: 'bold', 
        margin: 0,
        fontSize: '1.1rem'
      }}>
        ${product.price.toFixed(2)}
      </p>

      <Link
        to={`/product/${product.id}`}
        style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '0.9rem',
          textAlign: 'center',
          textDecoration: 'none'
        }}
      >
        {t('viewDetails')}
      </Link>
    </div>
  )
}