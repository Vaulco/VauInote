// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAS6dZ-GYg1Upj8v2hOpYQmgb4J5Qwgzmc",
  authDomain: "vaulnote-com.firebaseapp.com",
  projectId: "vaulnote-com",
  storageBucket: "vaulnote-com.appspot.com",
  messagingSenderId: "451368071601",
  appId: "1:451368071601:web:d9feecb573b02aeb450d90",
  measurementId: "G-54J85EHPY2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider  = new GoogleAuthProvider();
export const db = getFirestore(app);