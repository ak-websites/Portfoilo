import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCSfqOEfUEb7-OXEbeYogDrMejR1GmMNYU",
  authDomain: "portfolio-nayan.firebaseapp.com",
  projectId: "portfolio-nayan",
  storageBucket: "portfolio-nayan.firebasestorage.app",
  messagingSenderId: "47467635221",
  appId: "1:47467635221:web:7e58fda4b2f3c0b5ca241c",
  measurementId: "G-VTNLRYX6P2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
