// api/pi/complete.js - Handles GET for testing, POST for actual use
export default async function handler(req, res) {
  // CORS headers FIRST
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET for testing - show status
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'endpoint ready',
      message: 'Send POST request with {paymentId, txid}',
      piKeyConfigured: !!process.env.PI_API_KEY,
      time: new Date().toISOString()
    });
  }

  // POST for actual payment completion
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use GET for testing or POST for payment completion.' });
  }

  try {
    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'PI_API_KEY not set in Vercel env' });
    }

    // Parse body
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (Buffer.isBuffer(body)) {
      body = JSON.parse(body.toString());
    }
    
    const { paymentId, txid, orderDetails } = body || {};
    
    console.log('Complete request:', { paymentId, txid });

    if (!paymentId || !txid) {
      return res.status(400).json({ 
        error: 'Missing paymentId or txid', 
        received: body 
      });
    }

    // Call Pi API
    const isSandbox = apiKey.includes('sandbox');
    const baseUrl = isSandbox ? 'https://api.sandbox.pi' : 'https://api.mainnet.pi';
    
    console.log('Calling:', `${baseUrl}/v2/payments/${paymentId}/complete`);

    const piRes = await fetch(`${baseUrl}/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const piData = await piRes.json();

    if (!piRes.ok) {
      console.error('Pi API error:', piRes.status, piData);
      return res.status(piRes.status).json({ 
        error: 'Pi API error', 
        status: piRes.status,
        details: piData 
      });
    }

    // Try save to Firebase (optional)
    let firebaseId = null;
    try {
      if (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_SERVICE_ACCOUNT) {
        const { db } = await import('../lib/firebase-admin.js');
        const { FieldValue } = await import('firebase-admin/firestore');
        
        const docRef = await db.collection('orders').add({
          orderId: `order_${Date.now()}`,
          paymentId,
          txid,
          items: orderDetails?.items || [],
          totalPrice: orderDetails?.totalPrice || 0,
          status: 'completed',
          createdAt: FieldValue.serverTimestamp()
        });
        firebaseId = docRef.id;
      }
    } catch (fbError) {
      console.log('Firebase save skipped:', fbError.message);
    }

    return res.status(200).json({
      success: true,
      paymentId,
      txid,
      firebaseId,
      piData
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}