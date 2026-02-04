// api/lib/firebase-admin.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only once
if (!getApps().length) {
  // For Vercel, use environment variables
  // Add these in Vercel Dashboard: Project Settings > Environment Variables
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        // Fallback to individual env vars
        projectId: process.env.FIREBASE_PROJECT_ID || 'louable-b4c1a',
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };

  if (!serviceAccount.privateKey && !process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.warn('⚠️ Firebase credentials not fully configured');
  }

  try {
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
    });
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin init error:', error);
    throw error;
  }
}

export const db = getFirestore();