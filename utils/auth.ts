import * as SecureStore from 'expo-secure-store';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import bcrypt from 'react-native-bcrypt';
import { auth, db } from '../firebaseConfig';

export const signUpUser = async (
  email: string,
  password: string,
  name: string,
  age: string,
  mobile: string
) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCred.user.getIdToken();
  const uid = userCred.user.uid;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    hashedPassword,
    token,
    name,
    age: parseInt(age), 
    mobile,
  });

  await SecureStore.setItemAsync('userToken', token);
};


export const signInUser = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

 
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) throw new Error('User not found in Firestore');

  const userData = userDoc.data();
  const token = userData?.token;

  await SecureStore.setItemAsync('userToken', token);

  return userCred;
};


export const logoutUser = async () => {
  await signOut(auth);
  await SecureStore.deleteItemAsync('userToken');
};

export const isUserLoggedIn = async (): Promise<boolean> => {
  const token = await SecureStore.getItemAsync('userToken');
  return !!token;
};
