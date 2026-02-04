// api/pi/complete.js
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

  // GET for testing
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'endpoint ready',
      message: 'Send POST request with {paymentId, txid}',
      piKeyConfigured: !!process.env.PI_API_KEY,
      time: new Date().toISOString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body with multiple fallbacks
    let body;
    
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON string', received: req.body });
      }
    } else if (Buffer.isBuffer(req.body)) {
      try {
        body = JSON.parse(req.body.toString());
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON in buffer', received: req.body.toString() });
      }
    } else if (typeof req.body === 'object' && req.body !== null) {
      body = req.body;
    } else {
      // Try to read raw body
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const rawBody = Buffer.concat(chunks).toString();
      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON in stream', received: rawBody });
      }
    }

    console.log('Parsed body:', body);

    const { paymentId, txid, orderDetails } = body || {};
    
    if (!paymentId || !txid) {
      return res.status(400).json({ 
        error: 'Missing paymentId or txid', 
        received: body 
      });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'PI_API_KEY not set' });
    }

    const isSandbox = apiKey.includes('sandbox');
    const baseUrl = isSandbox ? 'https://api.sandbox.pi' : 'https://api.mainnet.pi';
    
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
      return res.status(piRes.status).json({ 
        error: 'Pi API error', 
        status: piRes.status,
        details: piData 
      });
    }

    return res.status(200).json({
      success: true,
      paymentId,
      txid,
      piData
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}

// Disable body parsing to handle it manually
export const config = {
  api: {
    bodyParser: false,
  },
};