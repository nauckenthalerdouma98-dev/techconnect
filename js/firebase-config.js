// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0vvCEOAsPIevk6O0C9DgyigFLSlbvCSI",
  authDomain: "techconnect-e09b5.firebaseapp.com",
  projectId: "techconnect-e09b5",
  storageBucket: "techconnect-e09b5.firebasestorage.app",
  messagingSenderId: "768554488751",
  appId: "1:768554488751:web:7d0d56461ee1b9a1e2d55a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();