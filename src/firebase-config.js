// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-DZBstJoa_QNGSKddzQ1MwN5_exIcL60",
  authDomain: "vaulnote-4afd1.firebaseapp.com",
  projectId: "vaulnote-4afd1",
  storageBucket: "vaulnote-4afd1.appspot.com",
  messagingSenderId: "359977719927",
  appId: "1:359977719927:web:020ee8ea8c761f22a78e72",
  measurementId: "G-BKMTW1FEN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider  = new GoogleAuthProvider();
export const db = getFirestore(app);