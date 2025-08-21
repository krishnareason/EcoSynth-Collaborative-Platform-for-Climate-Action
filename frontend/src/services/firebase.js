import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADzVWEzHlpIkOuhTV7-3CcilmlslPOr1Y",
  authDomain: "ecosynth-hackathon.firebaseapp.com",
  projectId: "ecosynth-hackathon",
  storageBucket: "ecosynth-hackathon.firebasestorage.app",
  messagingSenderId: "314791917034",
  appId: "1:314791917034:web:47c5aae053aba796486e93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export all the services you need individually
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// DO NOT add another export statement here. The ones above are sufficient.