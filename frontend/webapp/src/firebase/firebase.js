import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB8jaE2TC-PsoNMyox1mtA7n3ggmAu3nss",
    authDomain: "sketchifyai-31ce5.firebaseapp.com",
    projectId: "sketchifyai-31ce5",
    storageBucket: "sketchifyai-31ce5.firebasestorage.app",
    messagingSenderId: "813596022105",
    appId: "1:813596022105:web:9db977c276ee993a4ca848",
    measurementId: "G-6FZZKKLBH9"
  };

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, addDoc, collection };
