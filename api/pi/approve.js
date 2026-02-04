export default async function handler(req, res) {
  // CORS headers FIRST
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  if (req.method === 'GET') {
    return res.json({ 
      status: 'ready', 
      piKeyConfigured: !!process.env.PI_API_KEY
    });
  }
  
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { paymentId, txid, orderDetails } = body || {};

    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'PI_API_KEY not set' });
    }

    const isSandbox = apiKey.startsWith('sandbox_') || process.env.PI_SANDBOX === 'true';
    const baseUrl = isSandbox 
      ? 'https://api.sandbox.minepi.com'
      : 'https://api.minepi.com';
    
    const url = `${baseUrl}/v2/payments/${paymentId}/complete`;

    const piRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid })
    });

    const piData = await piRes.json();

    if (!piRes.ok) {
      return res.status(piRes.status).json({ 
        error: 'Pi API error', 
        status: piRes.status,
        details: piData
      });
    }

    // Log order details to console (no Firebase)
    console.log('Payment completed:', {
      paymentId,
      txid,
      orderDetails,
      timestamp: new Date().toISOString()
    });

    return res.json({ 
      success: true, 
      paymentId, 
      txid, 
      piData 
    });
    
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: { bodyParser: true }
};