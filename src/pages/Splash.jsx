// src/pages/Splash.jsx
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
      background: 'linear-gradient(135deg, #3E2723 0%, #5D4037 50%, #2E1B1B 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(16px, 4vw, 24px)'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '-10%',
        width: 'clamp(300px, 60vw, 500px)',
        height: 'clamp(300px, 60vw, 500px)',
        background: 'radial-gradient(circle, rgba(212, 160, 23, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(clamp(60px, 15vw, 80px))',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-10%',
        width: 'clamp(350px, 70vw, 600px)',
        height: 'clamp(350px, 70vw, 600px)',
        background: 'radial-gradient(circle, rgba(232, 221, 212, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(clamp(70px, 18vw, 100px))',
        animation: 'pulse 5s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 'clamp(250px, 50vw, 400px)',
        height: 'clamp(250px, 50vw, 400px)',
        background: 'radial-gradient(circle, rgba(93, 64, 55, 0.25) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(clamp(50px, 12vw, 60px))',
        animation: 'pulse 3.5s ease-in-out infinite',
        transform: 'translate(-50%, -50%)'
      }}></div>

      {/* Chocolate Icon with Animation */}
      <div style={{
        fontSize: 'clamp(4rem, 15vw, 6rem)',
        marginBottom: 'clamp(24px, 6vw, 32px)',
        animation: 'slideUp 0.8s ease-out, float 3s ease-in-out infinite',
        filter: 'drop-shadow(0 10px 30px rgba(212, 160, 23, 0.4))',
        position: 'relative',
        zIndex: 10
      }}>
        🍫
      </div>

      {/* App Name with Gradient */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 10vw, 4rem)',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #D4A017 0%, #E8A93C 50%, #F5C561 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 'clamp(12px, 3vw, 16px)',
        letterSpacing: '-2px',
        animation: 'slideUp 0.8s ease-out 0.2s backwards',
        textShadow: '0 4px 20px rgba(212, 160, 23, 0.3)',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        ShopEasy
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: 'clamp(1rem, 4vw, 1.4rem)',
        color: '#F8F4F0',
        marginBottom: 'clamp(32px, 8vw, 48px)',
        animation: 'slideUp 0.8s ease-out 0.4s backwards',
        fontWeight: '500',
        letterSpacing: '1px',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        padding: '0 clamp(16px, 4vw, 24px)'
      }}>
        Your Premium Chocolate Experience
      </p>

      {/* Loading Spinner */}
      <div style={{
        width: 'clamp(50px, 12vw, 60px)',
        height: 'clamp(50px, 12vw, 60px)',
        border: '5px solid rgba(212, 160, 23, 0.2)',
        borderTop: '5px solid #D4A017',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite, slideUp 0.8s ease-out 0.6s backwards',
        boxShadow: '0 0 20px rgba(212, 160, 23, 0.3)',
        position: 'relative',
        zIndex: 10
      }}></div>

      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        bottom: 'clamp(30px, 8vw, 40px)',
        display: 'flex',
        gap: 'clamp(8px, 2vw, 12px)',
        animation: 'fadeIn 1.5s ease-out',
        zIndex: 10
      }}>
        <div style={{
          width: 'clamp(30px, 8vw, 40px)',
          height: '4px',
          background: 'rgba(212, 160, 23, 0.6)',
          borderRadius: '2px',
          animation: 'expandWidth 1s ease-out 1s backwards'
        }}></div>
        <div style={{
          width: 'clamp(45px, 12vw, 60px)',
          height: '4px',
          background: 'rgba(212, 160, 23, 0.8)',
          borderRadius: '2px',
          animation: 'expandWidth 1s ease-out 1.1s backwards'
        }}></div>
        <div style={{
          width: 'clamp(30px, 8vw, 40px)',
          height: '4px',
          background: 'rgba(212, 160, 23, 0.6)',
          borderRadius: '2px',
          animation: 'expandWidth 1s ease-out 1.2s backwards'
        }}></div>
      </div>

      {/* Additional Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes expandWidth {
          from { width: 0; opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}