// client/src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADOycT17y4mRm30iVzqDBsCImZ-7JV-0U",
  authDomain: "blitz-74dc8.firebaseapp.com",
  projectId: "blitz-74dc8",
  storageBucket: "blitz-74dc8.appspot.com",
  messagingSenderId: "784625944747",
  appId: "1:784625944747:web:eb450ae5cae13d54770fee",
  measurementId: "G-DXM86JTRLP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, storage};
