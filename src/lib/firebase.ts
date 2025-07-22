// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "pmii-digital-hub",
  appId: "1:373870118437:web:cdc1ed9cb95d47d05fe1cc",
  storageBucket: "pmii-digital-hub.firebasestorage.app",
  apiKey: "AIzaSyCJmgDIIzUzRAob7IXhq2XeZuePVcdtm18",
  authDomain: "pmii-digital-hub.firebaseapp.com",
  messagingSenderId: "373870118437",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export { app, db };
