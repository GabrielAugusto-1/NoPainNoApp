
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAGI12wJkdb_dWtf76mYECWh08NY4rnZhE",
  authDomain: "nopainnoappbanco.firebaseapp.com",
  databaseURL: "https://nopainnoappbanco-default-rtdb.firebaseio.com",
  projectId: "nopainnoappbanco",
  storageBucket: "nopainnoappbanco.firebasestorage.app",
  messagingSenderId: "545945757828",
  appId: "1:545945757828:web:af5e92c1548ac99962bad1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const database = getDatabase(app)

export default app;