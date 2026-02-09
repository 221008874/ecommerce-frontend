export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { paymentId } = req.body;
    
    console.log('📝 Approve called with:', { paymentId });

    if (!paymentId) {
      console.error('❌ Missing paymentId');
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    const apiKey = process.env.PI_API_KEY;
    
    // 🔍 DEBUG: Log API key info (safely)
    console.log('🔍 API Key exists:', !!apiKey);
    console.log('🔍 API Key length:', apiKey?.length);
    console.log('🔍 API Key starts with sandbox:', apiKey?.startsWith('sandbox_'));
    console.log('🔍 API Key first 10 chars:', apiKey?.substring(0, 10));
    
    if (!apiKey) {
      console.error('❌ PI_API_KEY not set');
      return res.status(500).json({ error: 'PI_API_KEY not set' });
    }

    const isSandbox = apiKey.startsWith('sandbox_');
    const baseUrl = isSandbox 
      ? 'https://api.sandbox.minepi.com'
      : 'https://api.minepi.com';
    
    const url = `${baseUrl}/v2/payments/${paymentId}/approve`;
    
    console.log('🌐 Environment:', isSandbox ? 'TESTNET' : 'MAINNET');
    console.log('🌐 Full URL:', url);

    // 🔍 DEBUG: Log the exact request we're about to make
    console.log('📤 Sending request to Pi API...');
    console.log('📤 Headers:', {
      'Authorization': `Key ${apiKey.substring(0, 10)}...`,
      'Content-Type': 'application/json'
    });

    const piResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📥 Pi API response status:', piResponse.status);
    console.log('📥 Pi API response ok:', piResponse.ok);

    const responseText = await piResponse.text();
    
    // 🔍 DEBUG: Log raw response
    console.log('📥 Raw response text:', responseText);

    if (piResponse.ok) {
      const result = JSON.parse(responseText);
      console.log('✅ Success:', result);
      return res.json({ 
        success: true,
        status: 'approved',
        paymentId,
        network: isSandbox ? 'testnet' : 'mainnet',
        data: result 
      });
    } else {
      // 🔍 DEBUG: Log detailed error
      console.error('❌ Pi API error:', {
        status: piResponse.status,
        statusText: piResponse.statusText,
        body: responseText
      });
      
      return res.status(piResponse.status).json({ 
        error: 'Pi approval failed',
        status: piResponse.status,
        details: responseText 
      });
    }
  } catch (error) {
    console.error('💥 Exception:', error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
}