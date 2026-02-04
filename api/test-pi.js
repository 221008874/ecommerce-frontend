export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.PI_API_KEY;
  
  if (!API_KEY) {
    return res.json({ 
      success: false, 
      error: 'PI_API_KEY not configured',
      configured: false
    });
  }

  try {
    const isSandbox = API_KEY.startsWith('sandbox_');
    const baseUrl = isSandbox 
      ? 'https://api.sandbox.minepi.com'
      : 'https://api.minepi.com';
    
    const response = await fetch(`${baseUrl}/v2/me`, {
      headers: { 
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    res.json({ 
      success: response.ok,
      status: response.status,
      environment: isSandbox ? 'sandbox' : 'mainnet',
      configured: true,
      data
    });
  } catch (error) {
    res.json({ 
      success: false, 
      configured: true,
      error: error.message 
    });
  }
}