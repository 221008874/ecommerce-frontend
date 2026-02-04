import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { db } from '../services/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart()
  const { t, lang } = useLanguage()
  const { theme } = useTheme()
  const navigate = useNavigate()
  
  const [piAuthenticated, setPiAuthenticated] = useState(false)
  const [piAuthError, setPiAuthError] = useState(null)
  const [piLoading, setPiLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingPayment, setPendingPayment] = useState(null)

  const apiUrl = import.meta.env.VITE_API_URL || ''

  // ✅ CRITICAL: Complete pending payment helper
  const completePendingPayment = async (payment) => {
    console.log('🔄 Auto-completing pending payment:', payment.identifier);
    
    try {
      const txid = payment.transaction?.txid;
      if (!txid) {
        console.error('No txid in pending payment');
        return false;
      }

      const response = await fetch(`${apiUrl}/api/pi/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.identifier,
          txid: txid,
          orderDetails: { items, totalPrice, totalItems }
        })
      });

      if (response.ok) {
        console.log('✅ Pending payment completed');
        await addDoc(collection(db, 'orders'), {
          orderId: `order_${Date.now()}`,
          paymentId: payment.identifier,
          txid,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          })),
          totalPrice: payment.amount,
          totalItems: items.length,
          currency: 'PI',
          status: 'completed',
          createdAt: serverTimestamp()
        });
        
        setPendingPayment(null);
        clearCart();
        navigate('/order-success');
        return true;
      } else {
        const error = await response.json();
        console.error('Failed to complete pending:', error);
        return false;
      }
    } catch (error) {
      console.error('Error completing pending:', error);
      return false;
    }
  };

  // Pi authentication - ✅ FIXED: Added 'username' scope
  useEffect(() => {
    const authenticatePi = async () => {
      try {
        let attempts = 0
        const maxAttempts = 50
        
        while (!window.Pi && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (!window.Pi) {
          setPiLoading(false)
          setPiAuthError('Please open this app in Pi Browser')
          return
        }

        // ✅ CRITICAL: Must include 'username' scope
        const scopes = ['username', 'payments']
        
        // ✅ CRITICAL: Must complete pending payments immediately
        const onIncompletePaymentFound = async (payment) => {
          console.log('⚠️ INCOMPLETE PAYMENT FOUND:', payment);
          setPendingPayment(payment);
          
          // ✅ AUTO-COMPLETE pending payment immediately
          const completed = await completePendingPayment(payment);
          
          // Return payment object as required by SDK
          return payment;
        };

        const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
        console.log('✅ Pi authenticated:', auth.user?.username)
        setPiAuthenticated(true)
        setPiAuthError(null)
        
      } catch (error) {
        console.error('❌ Authentication failed:', error)
        setPiAuthError(error.message || 'Authentication failed')
        setPiAuthenticated(false)
      } finally {
        setPiLoading(false)
      }
    }
    authenticatePi()
  }, []) // ✅ Removed dependencies that cause re-runs

  // Manual pending payment completion
  const handleCompletePending = async () => {
    if (!pendingPayment) return;
    setIsProcessing(true);
    await completePendingPayment(pendingPayment);
    setIsProcessing(false);
  };

  const handleCheckout = async () => {
    if (!window.Pi) {
      alert('Pi not initialized. Please open in Pi Browser.');
      return;
    }

    if (isProcessing) {
      alert('Payment already in progress. Please wait...');
      return;
    }

    if (pendingPayment) {
      const shouldComplete = confirm('You have a pending payment. Complete it first?');
      if (shouldComplete) {
        await handleCompletePending();
      }
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💳 Creating new payment...');
      
      // ✅ FIXED: Use 'metadata' not 'meta'
      const paymentData = {
        amount: Number(totalPrice),
        memo: `Louable Order - ${totalItems} items`,
        metadata: { // ← FIXED: was 'meta'
          orderItems: items.map(i => i.name).join(', '),
          timestamp: Date.now()
        }
      };

      console.log('💳 Payment data:', paymentData);

      const callbacks = {
        onReadyForServerApproval: async (paymentId) => {
          console.log('🚀 onReadyForServerApproval called:', paymentId);
          
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`${apiUrl}/api/pi/approve`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId }),
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || `HTTP ${response.status}`);
            }
            
            const result = await response.json();
            console.log('✅ Server approval success:', result);
            
          } catch (error) {
            console.error('💥 Approval error:', error);
            alert('❌ Approval failed: ' + error.message);
            throw error;
          }
        },

        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log('🚀 onReadyForServerCompletion called:', paymentId, txid);
          
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(`${apiUrl}/api/pi/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                paymentId, 
                txid,
                orderDetails: { items, totalPrice, totalItems }
              }),
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || 'Completion failed');
            }

            const result = await response.json();
            console.log('✅ Server completion success:', result);

            // Save to Firebase
            await addDoc(collection(db, 'orders'), {
              orderId: `order_${Date.now()}`,
              paymentId,
              txid,
              items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity || 1
              })),
              totalPrice,
              totalItems,
              currency: 'PI',
              status: 'completed',
              createdAt: serverTimestamp()
            });

            console.log('✅ Order saved to Firebase');
            clearCart();
            navigate('/order-success', { 
              state: { orderId: paymentId, txid, totalPrice, items } 
            });
            
          } catch (error) {
            console.error('💥 Completion error:', error);
            alert('⚠️ Payment completed but order save failed. TXID: ' + txid);
            setIsProcessing(false);
          }
        },

        onCancel: (paymentId) => {
          console.log('❌ Payment cancelled:', paymentId);
          setIsProcessing(false);
          alert('Payment cancelled');
        },

        onError: (error, payment) => {
          console.error('💥 Payment error:', error, payment);
          setIsProcessing(false);
          
          if (error.message?.includes('pending payment')) {
            alert('⚠️ You have a pending payment. Please complete it first.');
          } else {
            alert('❌ Payment failed: ' + (error.message || 'Unknown error'));
          }
        }
      };

      // ✅ CRITICAL: Create payment with proper error handling
      const payment = await window.Pi.createPayment(paymentData, callbacks);
      console.log('💳 Payment created successfully:', payment?.identifier);

    } catch (error) {
      console.error('🔥 Checkout error:', error);
      alert('❌ Checkout failed: ' + (error.message || 'Please try again'));
      setIsProcessing(false);
    }
  };

  // ... rest of your component (AuthStatus, render, etc.) remains the same
}