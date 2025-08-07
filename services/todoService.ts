import * as ImagePicker from 'expo-image-picker';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { auth, db } from "../firebaseConfig";
import { Todo } from "../types/todo";

export const fetchTodosByDate = async (date: string): Promise<Todo[]> => {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(
    collection(db, 'todos'),
    where('date', '==', date),
    where('uid', '==', user.uid) // <-- Only fetch user's todos
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchAllTodos = async (): Promise<Todo[]> => {
  const user = auth.currentUser;
  if (!user) return [];
  const q = query(
    collection(db, "todos"),
    where("uid", "==", user.uid) // Only fetch current user's todos
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Todo));
};

export const addTodo = async ({
  title,
  description,
  date,
  time,
  completed = false,
}: {
  title: string;
  description: string;
  date: string;
  time: string;
  completed?: boolean;
}): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const docRef = await addDoc(collection(db, "todos"), {
    title,
    description,
    date,
    time,
    completed,
    uid: user.uid,
  });

  return docRef.id; // ✅ correct way to return the ID
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  await updateDoc(doc(db, "todos", id), data);
};

export const deleteTodo = async (id: string) => {
  await deleteDoc(doc(db, "todos", id));
};

export async function uploadProfileImage(uri: string, uid: string) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storage = getStorage();
  const storageRef = ref(storage, `profileImages/${uid}.jpg`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}

export async function pickProfileImage() {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission to access gallery is required!');
    return null;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (!result.canceled && result.assets?.length) {
    return result.assets[0].uri;
  }
  return null;
}

