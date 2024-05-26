// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYdO6MMFvXwQ2Dui7-p2BkXMKR4NJVyUM",
  authDomain: "portal-fb46f.firebaseapp.com",
  projectId: "portal-fb46f",
  storageBucket: "portal-fb46f.appspot.com",
  messagingSenderId: "175098283144",
  appId: "1:175098283144:web:c79f4ec220cb26e755cb3d",
  measurementId: "G-ZV996FKCKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };