// api/pi/approve.js
export default async function handler(req, res) {
  // Set JSON response header immediately
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse request body safely
    let body = {};
    try {
      body = req.body || {};
    } catch (parseError) {
      console.error('❌ Body parse error:', parseError);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { paymentId } = body;

    if (!paymentId) {
      console.error('❌ Missing paymentId');
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    // Load pi-sdk dynamically
    let PiNetwork;
    try {
      const pkg = await import('pi-sdk');
      PiNetwork = pkg.PiNetwork;
    } catch (importError) {
      console.error('❌ pi-sdk import failed:', importError);
      return res.status(500).json({ error: 'Payment service unavailable' });
    }

    if (!process.env.PI_API_KEY) {
      console.error('❌ PI_API_KEY missing in environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Initialize and approve
    PiNetwork.init({
      version: "2.0",
      sandbox: true,
      apiKey: process.env.PI_API_KEY
    });

    console.log('🚀 Approving payment:', paymentId);
    await PiNetwork.approvePayment(paymentId);
    
    console.log('✅ Payment approved successfully');
    return res.status(200).json({ status: 'approved' });

  } catch (error) {
    // Log full error for debugging
    console.error('🔥 Approve failed:', {
      message: error.message,
      stack: error.stack,
      paymentId: req.body?.paymentId
    });

    // Always return valid JSON
    return res.status(500).json({ 
      error: error.message || 'Failed to approve payment',
      success: false
    });
  }
}