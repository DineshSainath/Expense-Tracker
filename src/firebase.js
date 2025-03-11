// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfDCB4qsCy3LuEkMm2z_Ro7ySlIXPTQUw",
  authDomain: "expense-tracker-011.firebaseapp.com",
  projectId: "expense-tracker-011",
  storageBucket: "expense-tracker-011.firebasestorage.app",
  messagingSenderId: "530865394448",
  appId: "1:530865394448:web:cc7a6417fd0f806efdcb95",
  measurementId: "G-BYH1MDVX4V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
