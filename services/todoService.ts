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
import { db } from "../firebaseConfig";
import { Todo } from "../types/todo";

export const fetchTodosByDate = async (date: string): Promise<Todo[]> => {
  const q = query(collection(db, "todos"), where("date", "==", date));
  const querySnapshot = await getDocs(q);
  const todosArr: Todo[] = [];
  querySnapshot.forEach((docSnap) => {
    todosArr.push({ id: docSnap.id, ...docSnap.data() } as Todo);
  });
  return todosArr;
};

export const fetchAllTodos = async (): Promise<Todo[]> => {
  const querySnapshot = await getDocs(collection(db, "todos"));
  const todosArr: Todo[] = [];
  querySnapshot.forEach((docSnap) => {
    todosArr.push({ id: docSnap.id, ...docSnap.data() } as Todo);
  });
  return todosArr;
};

export const addTodo = async (todo: Omit<Todo, "id">) => {
  await addDoc(collection(db, "todos"), todo);
};

export const updateTodo = async (id: string, data: Partial<Todo>) => {
  await updateDoc(doc(db, "todos", id), data);
};

export const deleteTodo = async (id: string) => {
  await deleteDoc(doc(db, "todos", id));
};