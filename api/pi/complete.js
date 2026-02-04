export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'PI_API_KEY not configured' });
    }

    // ✅ FIXED: No space, correct auth header
    const url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
    
    const piResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`, // ✅ Changed from Bearer to Key
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ txid }) // Must match Pi API format
    });

    if (!piResponse.ok) {
      const errorText = await piResponse.text();
      throw new Error(`Pi API error: ${errorText}`);
    }

    const piResult = await piResponse.json();
    
    // ✅ SECURITY: Only mark complete after Pi API confirms success
    return res.status(200).json({ 
      success: true, 
      orderId: `order_${Date.now()}`,
      txid,
      piData: piResult // Include Pi's response for verification
    });
    
  } catch (error) {
    console.error('💥 Error:', error);
    return res.status(500).json({ error: error.message });
  }
}