import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home')
    }, 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'rgba(212, 165, 116, 0.15)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'rgba(232, 154, 60, 0.12)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'pulse 5s ease-in-out infinite reverse'
      }}></div>

      {/* Logo/Icon */}
      <div style={{
        fontSize: '5rem',
        marginBottom: '32px',
        animation: 'slideUp 0.8s ease-out',
        filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))'
      }}>
        🛍️
      </div>

      {/* App Name */}
      <h1 style={{
        fontSize: '3.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #D4A574 0%, #E89A3C 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '16px',
        letterSpacing: '-2px',
        animation: 'slideUp 0.8s ease-out 0.2s backwards',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
      }}>
        ShopEasy
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: '1.3rem',
        color: '#F5EDE0',
        marginBottom: '48px',
        animation: 'slideUp 0.8s ease-out 0.4s backwards',
        fontWeight: '500',
        letterSpacing: '0.5px'
      }}>
        Your Premium Shopping Companion
      </p>

      {/* Loading Spinner */}
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(212, 165, 116, 0.3)',
        borderTop: '4px solid #D4A574',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite, slideUp 0.8s ease-out 0.6s backwards'
      }}></div>
    </div>
  )
}