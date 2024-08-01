import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCopYKy_irjsGTtMtnAKkOnK9g2-dX0vPs",
  authDomain: "techware-282d0.firebaseapp.com",
  projectId: "techware-282d0",
  storageBucket: "techware-282d0.appspot.com",
  messagingSenderId: "707220351839",
  appId: "1:707220351839:web:b71860285bb8f1ea40e4ea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage}