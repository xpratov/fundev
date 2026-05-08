// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBacsE-PJGLc5v0KUnbmn_Xdr86yE1rxN4",
  authDomain: "fundev-d923a.firebaseapp.com",
  projectId: "fundev-d923a",
  storageBucket: "fundev-d923a.firebasestorage.app",
  messagingSenderId: "398196207203",
  appId: "1:398196207203:web:7daa77d9b7bf35e7001256",
  measurementId: "G-M2MGNDR3V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const db = getFirestore(app)