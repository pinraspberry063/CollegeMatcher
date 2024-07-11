// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNY9QgiSZgEyY4soyUEkcPNjA6JCDF8AU",
  authDomain: "collegematcher-46019.firebaseapp.com",
  projectId: "collegematcher-46019",
  storageBucket: "collegematcher-46019.appspot.com",
  messagingSenderId: "927238517919",
  appId: "1:927238517919:android:0109f3299db0f46c5cdeaa"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
