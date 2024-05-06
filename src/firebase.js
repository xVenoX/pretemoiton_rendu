// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getDatabase} from "firebase/database";
import {getFirestore} from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import 'firebase/auth';
import 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACbCWGkpz0AWYG5VcXHwV8iK2pTFMhUjM",
  authDomain: "pretemoiton.firebaseapp.com",
  projectId: "pretemoiton",
  storageBucket: "pretemoiton.appspot.com",
  messagingSenderId: "512893424066",
  appId: "1:512893424066:web:c9bf8e977ac4e0fc5c465b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const db= getFirestore(app);
export const storage = getStorage(app);
