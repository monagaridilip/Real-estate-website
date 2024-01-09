// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-website-6ba08.firebaseapp.com",
  projectId: "real-estate-website-6ba08",
  storageBucket: "real-estate-website-6ba08.appspot.com",
  messagingSenderId: "543623687598",
  appId: "1:543623687598:web:02de2bb7eb94213661ac3f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);