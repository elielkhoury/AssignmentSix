// firebaseConfig.ts
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import {getAuth as getFirebaseAuth} from 'firebase/auth';
import auth from '@react-native-firebase/auth';

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

// Export Firebase services using the JS SDK
export const db = getFirestore();
export const storage = getStorage();
export const firebaseAuth = getFirebaseAuth();

// Export the auth instance from @react-native-firebase/auth
// This is already initialized, and you can use it directly in your application.
export default auth;
