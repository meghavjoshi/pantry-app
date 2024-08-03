// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvtuTlzXOxSK-GjYsAkslyHqIeDWra-WA",
  authDomain: "inventory-management-5ce04.firebaseapp.com",
  projectId: "inventory-management-5ce04",
  storageBucket: "inventory-management-5ce04.appspot.com",
  messagingSenderId: "279467101761",
  appId: "1:279467101761:web:6519a3a4de9195fbcdc0c0",
  measurementId: "G-TP3MQQ36TS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore};

