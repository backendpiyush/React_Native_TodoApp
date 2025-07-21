// firebaseConfig.ts or firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Only Firestore needed

const firebaseConfig = {
  apiKey: "AIzaSyAyHrKU0zIp4YpmPU7wzgVE831nHL9FuDI",
  authDomain: "todoapp-c8f9a.firebaseapp.com",
  projectId: "todoapp-c8f9a",
  storageBucket: "todoapp-c8f9a.appspot.com", // ✅ Corrected the URL (was missing .googleapis)
  messagingSenderId: "1094183643896",
  appId: "1:1094183643896:web:07589aa4180b3fe215690d",
  measurementId: "G-PT2YHBXHYX" // This can be ignored in Expo
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore (what your app actually uses)
export const db = getFirestore(app);
