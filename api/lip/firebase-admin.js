import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Use global to prevent re-initialization in serverless environment
const globalWithFirebase = global;

export const getFirebaseAdmin = () => {
  if (globalWithFirebase.firebaseAdmin) {
    return globalWithFirebase.firebaseAdmin;
  }

  let db = null;
  let isConfigured = false;

  try {
    const apps = getApps();
    
    if (apps.length === 0) {
      // Check if we have credentials
      const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
      const hasIndividualCreds = !!(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
      
      if (!hasServiceAccount && !hasIndividualCreds) {
        console.log('⚠️ Firebase credentials not found - running without database');
      } else {
        let serviceAccount;
        
        if (hasServiceAccount) {
          try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          } catch (e) {
            console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
            throw e;
          }
        } else {
          // Fix private key formatting for Vercel environment
          const privateKey = process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1')
            : undefined;

          if (!privateKey) {
            throw new Error('FIREBASE_PRIVATE_KEY is empty');
          }

          serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID || 'louable-b4c1a',
            privateKey: privateKey,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          };
        }

        // Validate service account
        if (!serviceAccount.privateKey || !serviceAccount.clientEmail) {
          throw new Error('Invalid service account: missing privateKey or clientEmail');
        }

        const app = initializeApp({
          credential: cert(serviceAccount),
        });
        
        db = getFirestore(app);
        isConfigured = true;
        console.log('✅ Firebase Admin initialized');
      }
    } else {
      const app = getApp();
      db = getFirestore(app);
      isConfigured = true;
      console.log('✅ Firebase Admin reused existing app');
    }
  } catch (error) {
    console.error('❌ Firebase init error:', error.message);
    // Don't throw - let the API continue without Firebase
  }

  const firebaseAdmin = {
    db,
    isConfigured,
    FieldValue
  };

  // Cache for serverless environment
  globalWithFirebase.firebaseAdmin = firebaseAdmin;
  
  return firebaseAdmin;
};

// Safe db that won't crash if not configured
export const getSafeDb = () => {
  const { db, isConfigured, FieldValue } = getFirebaseAdmin();
  
  if (db) return { db, FieldValue, isConfigured };
  
  // Return mock that matches Firestore interface
  return {
    db: {
      collection: (collectionName) => ({
        add: async (data) => {
          console.log(`[MOCK] Firebase not configured - order not saved to ${collectionName}:`, data.orderId || 'no-order-id');
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
            console.log(`[MOCK] Firebase not configured - doc ${docId} not set`);
            return { writeTime: { toDate: () => new Date() } };
          },
          update: async (data) => {
            console.log(`[MOCK] Firebase not configured - doc ${docId} not updated`);
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
    },
    FieldValue: {
      serverTimestamp: () => new Date().toISOString(),
      increment: (n) => n,
      arrayUnion: (...elements) => elements,
      arrayRemove: (...elements) => elements
    },
    isConfigured: false
  };
};

export { FieldValue };