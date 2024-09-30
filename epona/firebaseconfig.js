import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBlUM-8On67If8tkE8X6NweRQUXxTHA1bc",
    authDomain: "epona-mobile.firebaseapp.com",
    projectId: "epona-mobile",
    storageBucket: "epona-mobile.appspot.com",
    messagingSenderId: "381598393932",
    appId: "1:381598393932:web:6a6d14eada5f7229acb6e9",
    measurementId: "G-3PWPK786TQ"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const auth = getAuth(app);
  export const storage = getStorage(app);

    export {db, auth};