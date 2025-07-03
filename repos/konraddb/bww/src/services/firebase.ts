// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA7tlvkkqLHfibC18FrreXTL-kLL-Fj9Y",
  authDomain: "my-bww-95404.firebaseapp.com",
  projectId: "my-bww-95404",
  storageBucket: "my-bww-95404.appspot.com",
  messagingSenderId: "972804541598",
  appId: "1:972804541598:web:8c2f68a4666f042af77f8f",
  measurementId: "G-BEY3FFQDVY",
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
