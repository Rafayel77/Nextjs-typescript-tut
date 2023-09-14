import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzfxYjHdf77rrydwRI6CtlKoZgXVFUu88",
  authDomain: "nextjs-project-dd7dc.firebaseapp.com",
  projectId: "nextjs-project-dd7dc",
  storageBucket: "nextjs-project-dd7dc.appspot.com",
  messagingSenderId: "422516032002",
  appId: "1:422516032002:web:ca1e3c27ec83c7daf3dd1b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
