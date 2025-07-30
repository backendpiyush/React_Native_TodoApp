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

export const addTodo = async ({ title, description, date }: { title: string, description: string, date: string }) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  await addDoc(collection(db, 'todos'), {
    title,
    description,
    date,
    uid: user.uid, // <-- Save the user's UID
  });
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  await updateDoc(doc(db, "todos", id), data);
};

export const deleteTodo = async (id: string) => {
  await deleteDoc(doc(db, "todos", id));
};

