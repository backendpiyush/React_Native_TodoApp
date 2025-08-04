import * as SecureStore from 'expo-secure-store';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc , updateDoc } from 'firebase/firestore';
import bcrypt from 'react-native-bcrypt';
import { auth, db, storage } from '../firebaseConfig';

import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';



export const pickAndUploadProfileImage = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.7,
  });

  if (result.canceled) return null;

  const imageUri = result.assets[0].uri;
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const imageRef = ref(storage, `profileImages/${user.uid}`);
  await uploadBytes(imageRef, blob);

  const imageUrl = await getDownloadURL(imageRef);

  // Update Firestore
  await updateDoc(doc(db, 'users', user.uid), {
    imageUrl,
  });

  return imageUrl;
};



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
