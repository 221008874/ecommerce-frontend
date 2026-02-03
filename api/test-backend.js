// api/test-backend.js
export default async function handler(req, res) {
  const API_KEY = process.env.PI_API_KEY;
  
  try {
    const response = await fetch('https://api.minepi.com/v2/me', {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      res.json({ success: true, app: data.app });
    } else {
      const errorText = await response.text();
      res.status(response.status).json({ success: false, error: errorText });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}