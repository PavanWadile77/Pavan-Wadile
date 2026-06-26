import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app = undefined as unknown as FirebaseApp;
let auth = undefined as unknown as Auth;
let db = undefined as unknown as Firestore;
let storage = undefined as unknown as FirebaseStorage;
let analytics = null as unknown as Analytics;

const isValidConfig = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

if (isValidConfig()) {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  
  // Ensure Firebase Auth is never initialized during server-side prerendering
  if (typeof window !== 'undefined') {
    auth = getAuth(app);
  }
  
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics only in the browser
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    });
  }
} else {
  console.warn("Firebase configuration is missing or incomplete. Firebase will not be initialized to prevent build crashes.");
}

export { app, auth, db, storage, analytics };
