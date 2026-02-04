// api/lib/firebase-admin.js
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let dbInstance = null;

function initializeFirebase() {
  if (getApps().length > 0) {
    console.log('Firebase already initialized');
    return getFirestore();
  }

  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || 'louable-b4c1a',
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };
    } else {
      console.error('❌ Firebase credentials not configured');
      // Return a mock db that throws descriptive errors
      return {
        collection: () => {
          throw new Error('Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL env vars.');
        }
      };
    }

    initializeApp({
      credential: cert(serviceAccount),
    });

    console.log('✅ Firebase Admin initialized');
    return getFirestore();

  } catch (error) {
    console.error('❌ Firebase Admin error:', error.message);
    // Return a mock db that throws errors when used
    return {
      collection: () => {
        throw new Error(`Firebase initialization failed: ${error.message}`);
      }
    };
  }
}

// Initialize immediately
dbInstance = initializeFirebase();

// Export at top level only
export const db = dbInstance;