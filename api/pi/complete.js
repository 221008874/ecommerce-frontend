// api/pi/complete.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId, txid } = req.body;
    
    if (!paymentId || !txid) {
      return res.status(400).json({ error: 'Missing paymentId or txid' });
    }

    console.log('✅ Order completed:', paymentId, txid);
    return res.status(200).json({ success: true, message: 'Order completed' });

  } catch (error) {
    console.error('🔥 Complete failed:', error.message || error);
    return res.status(500).json({ 
      error: error.message || 'Failed to complete payment'
    });
  }
}