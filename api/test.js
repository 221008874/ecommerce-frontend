// api/test.js
export default async function handler(req, res) {
  res.json({ 
    success: true, 
    message: 'API endpoint is working!',
    hasApiKey: !!process.env.PI_API_KEY,
    keyLength: process.env.PI_API_KEY?.length || 0
  });
}