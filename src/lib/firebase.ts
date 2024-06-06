// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAWd2YpEl5vgcEHv7Qd4zaW4G448Ne1XYY",
    authDomain: "job-board-dd28c.firebaseapp.com",
    projectId: "job-board-dd28c",
    storageBucket: "job-board-dd28c.appspot.com",
    messagingSenderId: "582457296856",
    appId: "1:582457296856:web:f305a541a4a1c3eeb514ad",
    measurementId: "G-TD8M3NB00J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app);


export { db, storage };