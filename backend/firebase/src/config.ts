// firebase/src/config.ts
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const getFirebaseConfig = (): FirebaseConfig => {
  if (typeof window !== 'undefined') {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      throw new Error('Missing Firebase configuration in Next.js environment');
    }
    
    return {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!
    };
  }

  // React Native environment
  try {
    // Import React Native environment variables
    const {
      FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID
    } = require('@env');

    return {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID
    };
  } catch (error) {
    throw new Error('Missing Firebase configuration in React Native environment');
  }
};

let firebaseApp: FirebaseApp | undefined;

export const initializeFirebase = (): FirebaseApp => {
  if (!firebaseApp && !getApps().length) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }
  return firebaseApp || getApps()[0];
};