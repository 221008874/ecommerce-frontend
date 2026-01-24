// src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'
import { db } from '../services/firebase' // ✅ assuming this file exists
import { doc, getDoc } from 'firebase/firestore'

export default function ProductDetail() {
  const { id } = useParams() // ✅ gets :id from URL
  const navigate = useNavigate()
  const { t, lang } = useLanguage()
  const { addToCart } = useCart()
  const { theme } = useTheme()
  const [product, setProduct] = useState(null)

  // ✅ Only ONE useEffect — inside the component
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
  }, [id, navigate]) // ✅ dependencies

  if (!product) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Loading...</div>
  }

  const handleAddToCart = () => {
    addToCart(product)
    alert('Added to cart!')
  }

  return (
    <div style={{ 
      padding: '32px', 
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#1A1A1A',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          style={{
            marginBottom: '24px',
            background: 'transparent',
            border: 'none',
            color: '#FF6B6B',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 0'
          }}
        >
          ← {t('backToProducts')}
        </button>

        {/* Real Cloudinary Image */}
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: '12px',
              marginBottom: '32px',
              border: `1px solid ${theme === 'light' ? '#F0F0F0' : '#3A3A3A'}`
            }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '400px',
            background: theme === 'light' 
              ? 'linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%)'
              : 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '32px',
            fontSize: '5rem',
            border: `1px solid ${theme === 'light' ? '#F0F0F0' : '#3A3A3A'}`
          }}>
            📦
          </div>
        )}

        {/* Product Info */}
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: '16px',
          color: theme === 'light' ? '#2C2416' : '#FFFFFF',
          fontWeight: '700'
        }}>
          {product.name}
        </h1>
        
        <p style={{ 
          color: '#FF6B6B',
          fontSize: '2rem', 
          fontWeight: '700',
          marginBottom: '24px'
        }}>
          ${product.price.toFixed(2)}
        </p>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ 
            fontWeight: '600',
            color: theme === 'light' ? '#2C2416' : '#FFFFFF',
            marginBottom: '8px'
          }}>
            <strong>{t('piecesPerBox')}:</strong> {product.piecesPerBox} pieces
          </p>
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <p style={{ 
            fontWeight: '600',
            color: theme === 'light' ? '#2C2416' : '#FFFFFF',
            marginBottom: '12px'
          }}>
            <strong>{t('flavors')}:</strong>
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {product.flavors.map((flavor, index) => (
              <span key={index} style={{
                background: theme === 'light' ? '#F8F8F8' : '#2C2416',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                color: theme === 'light' ? '#2C2416' : '#FFFFFF',
                border: `1px solid ${theme === 'light' ? '#E0E0E0' : '#3A3A3A'}`
              }}>
                {flavor}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ 
            fontWeight: '600',
            color: theme === 'light' ? '#2C2416' : '#FFFFFF',
            marginBottom: '8px'
          }}>
            <strong>{t('description')}:</strong>
          </p>
          <p style={{ 
            color: theme === 'light' ? '#666666' : '#A0A0A0',
            lineHeight: 1.6,
            fontSize: '1rem'
          }}>
            {product.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleAddToCart}
            style={{
              flex: 1,
              padding: '16px 24px',
              backgroundColor: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1.05rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF5252'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B6B'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {t('addToCart')}
          </button>
          
          <button
            onClick={() => navigate('/cart')}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              color: '#FF6B6B',
              border: '2px solid #FF6B6B',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '1.05rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6B6B'
              e.currentTarget.style.color = '#FFFFFF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#FF6B6B'
            }}
          >
            {t('goToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}