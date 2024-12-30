import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMf6Fcx3QBEIku6za-bXN3BaSjQLB5wY0",
  authDomain: "evehub-3ac27.firebaseapp.com",
  projectId: "evehub-3ac27",
  storageBucket: "evehub-3ac27.appspot.com",
  messagingSenderId: "304350232087",
  appId: "1:304350232087:web:437d4450a1ee51f8b82652"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
