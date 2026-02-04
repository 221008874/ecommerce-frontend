export default async function handler(req, res) {
  // CORS headers FIRST - before any other logic
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'GET') {
    return res.json({ 
      status: 'ready', 
      piKeyConfigured: !!process.env.PI_API_KEY,
      firebaseConfigured: false
    });
  }
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { paymentId } = req.body || {};
    if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'PI_API_KEY not set' });

    // Validate API key format
    if (!apiKey.match(/^(sandbox_|mainnet_)/)) {
      console.warn('⚠️ PI_API_KEY does not start with sandbox_ or mainnet_');
    }

    const isSandbox = apiKey.startsWith('sandbox_') || process.env.PI_SANDBOX === 'true';
    const baseUrl = isSandbox 
      ? 'https://api.sandbox.minepi.com'
      : 'https://api.minepi.com';
    
    const piRes = await fetch(`${baseUrl}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await piRes.json();
    
    if (!piRes.ok) {
      return res.status(piRes.status).json({ 
        error: 'Pi API error', 
        status: piRes.status,
        details: data 
      });
    }

    // Try Firebase - but don't fail if it doesn't work
    let firebaseId = null;
    let firebaseError = null;
    
    try {
      const { safeDb } = await import('./lib/firebase-admin.js');
      const { FieldValue } = await import('firebase-admin/firestore');
      
      const docRef = await safeDb.collection('payments').add({
        paymentId,
        action: 'approved',
        status: 'approved',
        createdAt: FieldValue.serverTimestamp(),
        environment: isSandbox ? 'sandbox' : 'mainnet'
      });
      firebaseId = docRef.id;
    } catch (fbErr) {
      firebaseError = fbErr.message;
      console.log('Firebase save failed:', fbErr.message);
    }

    return res.json({ 
      status: 'approved', 
      paymentId, 
      firebaseId,
      firebaseError,
      data 
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: { bodyParser: true }
};