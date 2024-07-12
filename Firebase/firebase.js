import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBNY9QgiSZgEyY4soyUEkcPNjA6JCDF8AU",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "collegematcher-46019",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "927238517919",
  appId: "1:927238517919:android:0109f3299db0f46c5cdeaa"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
