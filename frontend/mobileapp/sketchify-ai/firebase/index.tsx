import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB8jaE2TC-PsoNMyox1mtA7n3ggmAu3nss",
  authDomain: "sketchifyai-31ce5.firebaseapp.com",
  projectId: "sketchifyai-31ce5",
  storageBucket: "sketchifyai-31ce5.firebasestorage.app",
  messagingSenderId: "813596022105",
  appId: "1:813596022105:web:9db977c276ee993a4ca848",
  measurementId: "G-6FZZKKLBH9"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
