import {getApp, getApps, initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBiumTd_8AOtlIkvrBfePMFQEV3ZrxTHwo',
  authDomain: 'assignmentsix-453e2.firebaseapp.com',
  projectId: 'assignmentsix-453e2',
  storageBucket: 'assignmentsix-453e2.appspot.com',
  messagingSenderId: '352114509774',
  appId: '1:352114509774:web:cc48dca2df98c0d1168d9f',
  measurementId: 'G-XBTY2Y62FF',
};

// Initialize Firebase
console.log('Initializing Firebase');
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
