import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg6JyOqGBSIRFsp4rPUcDH9Ssg8r6llOs",
  authDomain: "fir-chatroom-b26b9.firebaseapp.com",
  projectId: "fir-chatroom-b26b9",
  storageBucket: "fir-chatroom-b26b9.appspot.com",
  messagingSenderId: "915181393353",
  appId: "1:915181393353:web:f368f33242d7eace010418",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firestore.getFirestore(app);

export { firestore, db as default };
