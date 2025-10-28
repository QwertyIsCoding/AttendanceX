// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmuniK3qPkWT64UfPcUnerR2TnBTqoxo0",
  authDomain: "attendance-4bfda.firebaseapp.com",
  projectId: "attendance-4bfda",
  storageBucket: "attendance-4bfda.firebasestorage.app",
  messagingSenderId: "984620523158",
  appId: "1:984620523158:web:1cecf2e6af63f06212acb7",
  measurementId: "G-BVBTVTJE36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);