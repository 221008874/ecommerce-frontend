// api/pi/approve.js
import { PiNetwork } from 'pi-sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // تأكد من تهيئة SDK بشكل صحيح
    PiNetwork.init({
      version: "2.0",
      sandbox: true,
      apiKey: process.env.PI_API_KEY // يجب أن يكون موجودًا في Vercel
    });

    const { paymentId } = req.body;

    if (!paymentId) {
      console.error('❌ Missing paymentId in approve request');
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    console.log('🚀 Approving payment:', paymentId);
    
    // الموافقة على الدفعة
    await PiNetwork.approvePayment(paymentId);
    
    console.log('✅ Payment approved successfully');
    return res.json({ status: 'approved' });

  } catch (error) {
    console.error('🔥 Approve payment FAILED:', error.message || error);
    
    // أرسل تفاصيل الخطأ لتسهيل التصحيح
    return res.status(500).json({ 
      error: error.message || 'Failed to approve payment',
      details: error.toString()
    });
  }
}