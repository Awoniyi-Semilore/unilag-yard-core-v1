// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA3lnr1AbvtY5yX6yM-iqUCUrhRaMYXLJI",
  authDomain: "unilaag-yard.firebaseapp.com",
  projectId: "unilaag-yard",
  storageBucket: "unilaag-yard.appspot.com",
  messagingSenderId: "323600018682",
  appId: "1:323600018682:web:fd35a25e179f40144ded43",
  measurementId: "G-RR8BREBWM1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


