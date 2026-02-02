// src/pages/CartPage_FIXED.jsx
// Fixed version with corrected Pi Network integration
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity } = useCart()
  const { t, lang } = useLanguage()
  const { theme, getImage } = useTheme()
  const navigate = useNavigate()
  
  // ✅ FIXED: Corrected handleCheckout function
  const handleCheckout = async () => {
    if (!window.Pi) {
      alert("Please open this app in Pi Browser");
      return;
    }

    try {
      const paymentData = {
        amount: totalPrice, // Use actual cart total
        memo: `Order for ${totalItems} items`,
        metadata: { 
          orderId: `order_${Date.now()}`,
          itemCount: totalItems,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      };

      const callbacks = {
        onReadyForServerApproval: async (paymentId) => {
          console.log("🚀 Ready for approval:", paymentId);
          try {
            // ✅ FIXED: Corrected Content-Type header
            const response = await fetch('/api/pi/approve', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }, // Fixed typo
              body: JSON.stringify({ paymentId })
            });
            
            if (!response.ok) {
              throw new Error(`Approval failed: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("✅ Approved:", result);
          } catch (error) {
            console.error("❌ Approval error:", error);
            throw error;
          }
        },
        
        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log("✅ Payment completed:", paymentId, txid);
          try {
            const response = await fetch('/api/pi/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                paymentId, 
                txid,
                orderDetails: {
                  items,
                  totalPrice,
                  totalItems
                }
              })
            });
            
            if (!response.ok) {
              throw new Error(`Completion failed: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("✅ Order saved:", result);
            
            // Clear cart and show success
            alert("✅ Order confirmed! Transaction ID: " + txid);
            // You might want to clear the cart here or redirect to success page
            // clearCart(); // Implement this in your CartContext if needed
            navigate('/order-success'); // Redirect to success page
            
          } catch (error) {
            console.error("❌ Completion error:", error);
            alert("Order placed but failed to save. Please contact support with transaction ID: " + txid);
          }
        },
        
        onCancel: (paymentId) => {
          console.log("❌ Payment cancelled:", paymentId);
          alert("Payment was cancelled");
        },
        
        onError: (error, payment) => {
          console.error("💥 Payment error:", error, payment);
          alert("Payment failed: " + (error.message || 'Unknown error'));
        }
      };

      // ✅ Create payment
      const payment = await window.Pi.createPayment(paymentData, callbacks);
      console.log("💳 Payment created:", payment.identifier);
      
    } catch (error) {
      console.error("🔥 Checkout error:", error);
      alert("Checkout failed: " + (error.message || 'Please try again'));
    }
  };

  // ✅ FIXED: Pi authentication on mount
  useEffect(() => {
    const initializePi = async () => {
      if (typeof window === 'undefined' || !window.Pi) {
        console.warn('⚠️ Pi SDK not available');
        return;
      }

      try {
        const scopes = ['payments'];
        
        // Handle incomplete payments
        const onIncompletePaymentFound = (payment) => {
          console.log('🔄 Incomplete payment found:', payment.identifier);
          // You can resume or handle incomplete payments here
          return window.Pi.createPayment(payment, {
            onReadyForServerApproval: async (paymentId) => {
              const response = await fetch('/api/pi/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId })
              });
              const result = await response.json();
              console.log("✅ Resumed payment approved:", result);
            },
            onReadyForServerCompletion: async (paymentId, txid) => {
              await fetch('/api/pi/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, txid })
              });
              alert("✅ Resumed order confirmed!");
            },
            onCancel: () => console.log("❌ Resumed payment cancelled"),
            onError: (error) => console.error("💥 Resumed payment error:", error)
          });
        };

        await window.Pi.authenticate(scopes, onIncompletePaymentFound);
        console.log('✅ Pi authenticated successfully');
        
      } catch (error) {
        console.error('❌ Pi authentication failed:', error);
      }
    };

    initializePi();
  }, []);

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  const isMobile = windowWidth < 768
  const isSmallMobile = windowWidth < 480

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  // [REST OF YOUR COMPONENT CODE REMAINS THE SAME - only the handleCheckout and useEffect were changed]
  // I'm including just the key parts that changed, you can keep all your existing JSX

  if (totalItems === 0) {
    return (
      <div style={{ 
        padding: isMobile ? '2rem 1rem' : 'clamp(40px, 8vw, 60px) clamp(16px, 4vw, 24px)',
        textAlign: 'center', 
        background: c.background,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2 style={{
          fontSize: isMobile ? '1.6rem' : 'clamp(1.8rem, 6vw, 2.5rem)',
          marginBottom: '16px',
          fontWeight: '700',
          color: c.textDark
        }}>
          {t('emptyCart')}
        </h2>
        
        <p style={{ 
          margin: isMobile ? '0 0 2rem 0' : '0 0 clamp(32px, 6vw, 48px) 0',
          color: c.textLight
        }}>
          {t('addProducts')}
        </p>
        
        <button onClick={() => navigate('/home')} style={{
          padding: isMobile ? '12px 28px' : 'clamp(14px, 3.5vw, 18px) clamp(32px, 7vw, 48px)',
          background: `linear-gradient(135deg, ${c.success} 0%, #7CB342 100%)`,
          color: '#FFFFFF',
          border: 'none',
          borderRadius: isMobile ? '10px' : 'clamp(8px, 2vw, 12px)',
          cursor: 'pointer',
          fontWeight: '700',
          fontSize: isMobile ? '0.95rem' : 'clamp(1rem, 3.5vw, 1.15rem)'
        }}>
          {t('continueShopping')}
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: isMobile ? '1.5rem 1rem 5rem' : 'clamp(24px, 4vw, 32px) clamp(16px, 3vw, 24px) clamp(80px, 12vw, 100px)',
      background: c.background,
      minHeight: '100vh'
    }}>
      {/* Your existing cart items rendering code */}
      <div style={{ maxWidth: '950px', margin: '0 auto' }}>
        {/* Cart items list - keep your existing code */}
        
        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          style={{
            width: '100%',
            padding: isMobile ? '14px' : 'clamp(14px, 3.5vw, 20px)',
            background: `linear-gradient(135deg, ${c.success} 0%, #7CB342 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: isMobile ? '10px' : 'clamp(8px, 2vw, 12px)',
            fontWeight: '700',
            fontSize: isMobile ? '1rem' : 'clamp(1.05rem, 3.5vw, 1.25rem)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <span>✓</span>
          {t('checkout')}
        </button>
      </div>
    </div>
  )
}