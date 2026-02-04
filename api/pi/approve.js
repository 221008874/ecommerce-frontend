// api/pi/approve.js - Handles GET for testing, POST for actual use
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'endpoint ready',
      message: 'Send POST request with {paymentId}',
      piKeyConfigured: !!process.env.PI_API_KEY,
      time: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'PI_API_KEY not set' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    } else if (Buffer.isBuffer(body)) {
      body = JSON.parse(body.toString());
    }
    
    const { paymentId } = body || {};
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId', received: body });
    }

    const isSandbox = apiKey.includes('sandbox');
    const baseUrl = isSandbox ? 'https://api.sandbox.pi' : 'https://api.mainnet.pi';
    
    const piRes = await fetch(`${baseUrl}/v2/payments/${paymentId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const piData = await piRes.json();

    if (!piRes.ok) {
      return res.status(piRes.status).json({ 
        error: 'Pi API error', 
        details: piData 
      });
    }

    return res.status(200).json({
      status: 'approved',
      paymentId,
      data: piData
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}