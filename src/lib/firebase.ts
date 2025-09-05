// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB8vsPtC9uLXaOP5F6qLtKOV-EUDQpTLYs",
  authDomain: "talent-network-14ee1.firebaseapp.com",
  projectId: "talent-network-14ee1",
  storageBucket: "talent-network-14ee1.firebasestorage.app",
  messagingSenderId: "1025095551394",
  appId: "1:1025095551394:web:c2413e8f6db0d208b54afb",
  measurementId: "G-9LPKKQKW2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Cloud Storage
export const storage = getStorage(app);