import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration for projectelallavor
const firebaseConfig = {
  apiKey: "AIzaSyDrXxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "projectelallavor.firebaseapp.com",
  projectId: "projectelallavor",
  storageBucket: "projectelallavor.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnopqrst",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
