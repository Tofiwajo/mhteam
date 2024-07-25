import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDS-8SLDYt7LmvF41PCFQMoRaE8BrqwbIo",
  authDomain: "mawla-63e76.firebaseapp.com",
  projectId: "mawla-63e76",
  storageBucket: "mawla-63e76.appspot.com",
  messagingSenderId: "726470547151",
  appId: "1:726470547151:web:4973161da8fa247aab09ba"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
