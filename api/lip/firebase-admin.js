import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db = null;
let isConfigured = false;

try {
  if (getApps().length === 0) {
    // Check if we have credentials
    const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
    const hasIndividualCreds = !!(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
    
    if (!hasServiceAccount && !hasIndividualCreds) {
      console.log('⚠️ Firebase credentials not found - running without database');
    } else {
      let serviceAccount;
      
      if (hasServiceAccount) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } else {
        serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID || 'louable-b4c1a',
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        };
      }

      initializeApp({
        credential: cert(serviceAccount),
      });
      
      db = getFirestore();
      isConfigured = true;
      console.log('✅ Firebase Admin initialized');
    }
  } else {
    db = getFirestore();
    isConfigured = true;
  }
} catch (error) {
  console.error('❌ Firebase init error:', error.message);
  // Don't throw - let the API continue without Firebase
}

// Export safe db that won't crash if not configured - matches Firestore interface
export const safeDb = db || {
  collection: (collectionName) => ({
    add: async (data) => {
      console.log(`Firebase not configured - order not saved to ${collectionName}:`, data.orderId || 'no-order-id');
      return { 
        id: 'no-firebase-' + Date.now(),
        get: async () => ({ 
          data: () => data, 
          exists: true,
          id: 'no-firebase-' + Date.now()
        })
      };
    },
    doc: (docId) => ({
      get: async () => ({ 
        exists: false, 
        data: () => null,
        id: docId
      }),
      set: async (data, options) => {
        console.log(`Firebase not configured - doc ${docId} not set:`, data);
        return { writeTime: { toDate: () => new Date() } };
      },
      update: async (data) => {
        console.log(`Firebase not configured - doc ${docId} not updated:`, data);
        return { writeTime: { toDate: () => new Date() } };
      }
    }),
    where: () => ({
      get: async () => ({ 
        docs: [], 
        empty: true,
        forEach: () => {},
        size: 0
      })
    }),
    orderBy: () => ({
      get: async () => ({
        docs: [],
        empty: true,
        forEach: () => {},
        size: 0
      })
    })
  })
};

export const firebaseAvailable = isConfigured;