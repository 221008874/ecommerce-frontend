import fetch from 'node-fetch';

export default async function handler(req, res) {
  // CORS headers - MUST be first, before any logic that could fail
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body safely
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    
    const { paymentId, txid, orderDetails } = body || {};
    
    console.log('Complete called:', { paymentId, txid });

    if (!paymentId || !txid) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { paymentId: !!paymentId, txid: !!txid }
      });
    }

    // Check API key - return clear error if missing
    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      console.error('❌ PI_API_KEY not set');
      return res.status(500).json({ 
        error: 'Server configuration error: PI_API_KEY not set. Please add PI_API_KEY to Vercel environment variables.' 
      });
    }

    // Determine environment
    const isSandbox = apiKey.includes('sandbox') || process.env.PI_SANDBOX === 'true';
    const baseUrl = isSandbox ? 'https://api.sandbox.pi' : 'https://api.mainnet.pi';
    
    const url = `${baseUrl}/v2/payments/${paymentId}/complete`;
    
    console.log('Calling Pi API:', url);

    // Call Pi API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const piRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ txid }),
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));

    console.log('Pi response status:', piRes.status);

    if (!piRes.ok) {
      const errText = await piRes.text();
      console.error('Pi API error:', piRes.status, errText);
      return res.status(piRes.status).json({ 
        error: 'Pi API error', 
        status: piRes.status,
        details: errText 
      });
    }

    const piData = await piRes.json();
    console.log('Pi success');

    // Try Firebase only if configured (optional)
    let firebaseId = null;
    try {
      // Only import if Firebase env vars are set
      if (process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_SERVICE_ACCOUNT) {
        const { db } = await import('../lib/firebase-admin.js');
        const { FieldValue } = await import('firebase-admin/firestore');
        
        const docRef = await db.collection('orders').add({
          orderId: `order_${Date.now()}`,
          paymentId,
          txid,
          items: orderDetails?.items || [],
          totalPrice: orderDetails?.totalPrice || 0,
          totalItems: orderDetails?.totalItems || 0,
          status: 'completed',
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp()
        });
        firebaseId = docRef.id;
        console.log('Saved to Firebase:', firebaseId);
      } else {
        console.log('⚠️ Firebase not configured, skipping database save');
      }
    } catch (fbError) {
      console.error('Firebase error (continuing):', fbError.message);
    }

    return res.status(200).json({
      success: true,
      paymentId,
      txid,
      firebaseId,
      piData
    });

  } catch (error) {
    console.error('Complete endpoint error:', error);
    return res.status(500).json({ 
      error: error.message,
      type: error.name || 'Error'
    });
  }
}