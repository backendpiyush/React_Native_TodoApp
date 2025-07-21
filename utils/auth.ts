import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import bcrypt from 'react-native-bcrypt';

// Sign up a new user
export const signUpUser = async (email: string, password: string) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken();
  const uid = userCred.user.uid;

  // Hash the password before saving (optional, not needed for Firebase Auth)
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Store user in Firestore
  await setDoc(doc(db, 'users', uid), {
    email,
    hashedPassword,
    token,
    uid,
  });

  await AsyncStorage.setItem('firebase_token', token);
};

// Sign in an existing user
export const signInUser = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

  // Fetch token from Firestore (optional, you can also use userCred.user.getIdToken())
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) throw new Error('User not found in Firestore');

  const userData = userDoc.data();
  const token = userData?.token;

  await AsyncStorage.setItem('firebase_token', token);

  return userCred;
};

// Log out the user
export const logoutUser = async () => {
  await signOut(auth);
  await AsyncStorage.removeItem('firebase_token');
};

// Check if a user is logged in
export const isUserLoggedIn = async (): Promise<boolean> => {
  const token = await AsyncStorage.getItem('firebase_token');
  return !!token;
};
