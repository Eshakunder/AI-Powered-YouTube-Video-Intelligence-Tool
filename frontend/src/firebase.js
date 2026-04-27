// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4ALH_Sg7RLptG7ZF3l3S_TKxNdUJsB-A",
  authDomain: "ai-video-intelligence-8d98c.firebaseapp.com",
  projectId: "ai-video-intelligence-8d98c",
  storageBucket: "ai-video-intelligence-8d98c.firebasestorage.app",
  messagingSenderId: "236179154217",
  appId: "1:236179154217:web:fa05ed39698ea5e4fa4338",
  measurementId: "G-ESNQWTKZTY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and EXPORT services
export const auth = getAuth(app);
export const analytics = getAnalytics(app);