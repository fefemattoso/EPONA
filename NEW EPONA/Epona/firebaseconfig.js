import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyByoPoSX5-1F0MEEo_O8jGm_zzRVDf0s2M",
    authDomain: "new-epona.firebaseapp.com",
    projectId: "new-epona",
    storageBucket: "new-epona.appspot.com",
    messagingSenderId: "244280196386",
    appId: "1:244280196386:web:8591ec697025afdf50397b",
    measurementId: "G-7NL8MBCWFX"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const storage = getStorage();