import {initializeApp} from 'firebase/app';
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
initializeApp(firebaseConfig);

// Export Firebase services
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
