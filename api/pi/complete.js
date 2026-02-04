export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    return res.json({ status: 'ready', piKeyConfigured: !!process.env.PI_API_KEY });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Simple body parsing
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { paymentId, txid, orderDetails } = body || {};

    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'PI_API_KEY not set' });

    const isSandbox = apiKey.includes('sandbox');
    // FIXED: Removed spaces in URLs
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
      return res.status(piRes.status).json({ error: 'Pi API error', details: piData });
    }

    return res.json({ success: true, paymentId, txid, piData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export const config = {
  api: { bodyParser: true }
};