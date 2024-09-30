import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const tasksConfig = {
    apiKey: "AIzaSyDr8q-P3x2ExdaiiAAy0gA4-e9QEN5XbMk",
    authDomain: "dailytasks-b976b.firebaseapp.com",
    projectId: "dailytasks-b976b",
    storageBucket: "dailytasks-b976b.appspot.com",
    messagingSenderId: "940174185527",
    appId: "1:940174185527:web:93f5bddbe4a5b975cbdbb2",
    measurementId: "G-JG0KF93V7X"
  };

  const app = initializeApp(tasksConfig);

  const db = getFirestore(app);

  const auth = getAuth(app);
  export const storage = getStorage(app);

    export {db, auth};