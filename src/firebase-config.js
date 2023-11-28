// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
// TODO Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKDi59zntaBcRmzMn-g8yT5cX6DvpxHWQ",
  authDomain: "vaulonte-off.firebaseapp.com",
  projectId: "vaulonte-off",
  storageBucket: "vaulonte-off.appspot.com",
  messagingSenderId: "793352463443",
  appId: "1:793352463443:web:d2fccd67171cc4b4b092a6",
  measurementId: "G-5SDMQW7CTR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider  = new GoogleAuthProvider();
export const db = getFirestore(app);