// api/pi/approve.js
// ✅ FIXED: Secure backend implementation with environment variables

export default async function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change to your domain in production
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Set content type
  res.setHeader('Content-Type', 'application/json');
  
  // Only POST allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get paymentId from request
    const { paymentId } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    // ✅ CRITICAL: Get API key from environment variable (NOT hardcoded!)
    const apiKey = process.env.PI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ PI_API_KEY environment variable not set!');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'API key not configured' 
      });
    }

    console.log('📝 Approving payment:', paymentId);

    // Build URL correctly
    const url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    
    // Make request to Pi API
    const piResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle response
    if (piResponse.ok) {
      const result = await piResponse.json();
      console.log('✅ Payment approved successfully:', paymentId);
      return res.status(200).json({ 
        status: 'approved',
        paymentId,
        data: result
      });
    } else {
      const errorText = await piResponse.text();
      console.error('❌ Pi API Error:', piResponse.status, errorText);
      
      return res.status(piResponse.status).json({ 
        error: 'Payment approval failed',
        details: errorText,
        statusCode: piResponse.status
      });
    }
    
  } catch (error) {
    console.error('💥 Server Error in approve:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}