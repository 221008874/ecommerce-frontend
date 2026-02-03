// api/test-pi.js
export default async function handler(req, res) {
  const API_KEY = process.env.PI_API_KEY;
  
  try {
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    
    const data = await response.json();
    res.json({ 
      success: response.ok,
      status: response.status,
       data
    });
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    });
  }
}