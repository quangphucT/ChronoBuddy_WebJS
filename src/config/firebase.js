// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo_z_bFTepfzkzsRngUfvhwwU7eUoLSWo",
  authDomain: "tracking-e659f.firebaseapp.com",
  databaseURL: "https://tracking-e659f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tracking-e659f",
  storageBucket: "tracking-e659f.firebasestorage.app",
  messagingSenderId: "645205251812",
  appId: "1:645205251812:web:d303d2b93cbec28ff6bef1",
  measurementId: "G-YS7S9PNMWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database, analytics };
export default app;