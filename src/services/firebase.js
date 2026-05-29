import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqXCWyK70QMNYwJgLncVPKoMRFu1t4pv8",
  authDomain: "road-complaint-syste.firebaseapp.com",
  projectId: "road-complaint-syste",
  storageBucket: "road-complaint-syste.firebasestorage.app",
  messagingSenderId: "868817718139",
  appId: "1:868817718139:web:364bc3b3f9d9b224028bde",
  measurementId: "G-32E6VF96NK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;