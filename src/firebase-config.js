// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeHseMqJ9JDLR1eSg6a4vqxC4KX7Wnc00",
  authDomain: "vaulnote-194b1.firebaseapp.com",
  projectId: "vaulnote-194b1",
  storageBucket: "vaulnote-194b1.appspot.com",
  messagingSenderId: "590664782284",
  appId: "1:590664782284:web:7a0eaa5086dad66b270d69",
  measurementId: "G-S06MG9CR77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider  = new GoogleAuthProvider();
export const db = getFirestore(app);