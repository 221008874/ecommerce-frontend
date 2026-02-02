// api/pi/approve.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    // 🔥 ADD THIS DEBUG LOG
    console.log('🔍 PI_API_KEY length:', process.env.PI_API_KEY?.length || 'MISSING');
    
    if (!process.env.PI_API_KEY) {
      console.error('❌ PI_API_KEY is completely missing');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    if (process.env.PI_API_KEY.length !== 64) {
      console.error('❌ PI_API_KEY has wrong length:', process.env.PI_API_KEY.length);
      return res.status(500).json({ error: 'Invalid API key configuration' });
    }

    const response = await fetch('https://api.minepi.com/v2/payments/' + paymentId + '/approve', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.PI_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Pi API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: 'Pi Network error: ' + errorText 
      });
    }

    const result = await response.json();
    console.log('✅ Payment approved:', result);
    return res.status(200).json({ status: 'approved' });

  } catch (error) {
    console.error('🔥 Approve failed:', error.message || error);
    return res.status(500).json({ 
      error: error.message || 'Failed to approve payment'
    });
  }
}