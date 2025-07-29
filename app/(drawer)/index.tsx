import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TodoCard } from "../../components/TodoCard";
import { auth, db } from "../../firebaseConfig"; // adjust path if needed
import {
  addTodo,
  deleteTodo,
  fetchTodosByDate,
  updateTodo,
} from "../../services/todoService";
import { Todo } from "../../types/todo";
import { logoutUser } from "../../utils/auth";

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [userName, setUserName] = useState("");
  const [showHello, setShowHello] = useState(true);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const todosArr = await fetchTodosByDate(selectedDate);
    setTodos(todosArr);
    setLoading(false);
  }, [selectedDate]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Refetch user name when screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchName = async () => {
        const user = auth.currentUser;
        if (user) {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setUserName(docSnap.data().name || "");
          }
        }
      };
      fetchName();
    }, [])
  );

  useEffect(() => {
    if (userName) {
      setShowHello(true);
      const timer = setTimeout(() => setShowHello(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [userName]);

  const handleDateChange = (_: any, date?: Date) => {
    setShowDatePicker(false);
    if (!date) return;
    const selected = date.toISOString().split("T")[0];
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      alert("You can't select a past date");
    } else {
      setSelectedDate(selected);
    }
  };

  const handleAddTodo = async () => {
    if (!inputTitle.trim()) return;
    await addTodo({
      title: inputTitle,
      description: inputDescription,
      date: selectedDate,
    });
    setInputTitle("");
    setInputDescription("");
    fetchTodos();
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleStartEdit = (id: string, title: string, description: string) => {
    setEditId(id);
    setEditTitle(title);
    setEditDescription(description);
  };

  const handleSaveEdit = async (id: string) => {
    await updateTodo(id, {
      title: editTitle,
      description: editDescription,
    });
    setEditId(null);
    setEditTitle("");
    setEditDescription("");
    fetchTodos();
  };

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#181818" }}
      >
        <ActivityIndicator size="large" color="#00adf5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#181818" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 56, marginBottom: 28, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{
                marginRight: 16,
                backgroundColor: "#232323",
                borderRadius: 8,
                padding: 8,
              }}
            >
              <Ionicons name="menu" size={28} color="#00adf5" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                color: "#fff",
                letterSpacing: 1,
              }}
            >
              Todo App
            </Text>
          </View>
          {userName ? (
            <View>
              <Text style={{ color: "#00adf5", fontWeight: "bold", fontSize: 18 }}>
                {`Hello ${userName}`}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Add Todo Card */}
        <View
          style={{
            flexDirection: "column",
            marginBottom: 20,
            backgroundColor: "#232323",
            borderRadius: 16,
            padding: 16,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <TextInput
            value={inputTitle}
            onChangeText={setInputTitle}
            placeholder="Title"
            placeholderTextColor="#aaa"
            style={{
              borderWidth: 0,
              padding: 12,
              borderRadius: 8,
              color: "#fff",
              backgroundColor: "#333",
              fontSize: 17,
              marginBottom: 10,
            }}
          />
          <TextInput
            value={inputDescription}
            onChangeText={setInputDescription}
            placeholder="Description"
            placeholderTextColor="#aaa"
            style={{
              borderWidth: 0,
              padding: 12,
              borderRadius: 8,
              color: "#fff",
              backgroundColor: "#333",
              fontSize: 16,
              marginBottom: 10,
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                backgroundColor: "#181818",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginRight: 10,
              }}
            >
              <Text style={{ color: "#00adf5", fontWeight: "bold" }}>Pick Date</Text>
            </TouchableOpacity>
            <Text style={{ color: "#fff", fontSize: 15 }}>
              {new Date(selectedDate).toDateString()}
            </Text>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(selectedDate)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
          <TouchableOpacity
            onPress={handleAddTodo}
            style={{
              backgroundColor: "#00adf5",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 14,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>Add Todo</Text>
          </TouchableOpacity>
        </View>

        {/* Todo List */}
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text style={{ color: "#999", textAlign: "center", marginTop: 20 }}>
              No tasks for this date.
            </Text>
          }
          renderItem={({ item }) => (
            <TodoCard
              todo={item}
              isEditing={editId === item.id}
              editTitle={editTitle}
              editDescription={editDescription}
              onEditTitle={setEditTitle}
              onEditDescription={setEditDescription}
              onStartEdit={() =>
                handleStartEdit(item.id, item.title, item.description)
              }
              onSaveEdit={() => handleSaveEdit(item.id)}
              onCancelEdit={() => setEditId(null)}
              onDelete={() => handleDeleteTodo(item.id)}
            />
          )}
        />

        {/* Logout Button */}
        {/* <TouchableOpacity
          onPress={async () => {
            try {
              await logoutUser();
              router.replace("../(auth)/sign-in");
            } catch (error) {
              alert("Logout failed: " + (error as Error).message);
            }
          }}
          style={{
            backgroundColor: "#ff5252",
            padding: 12,
            borderRadius: 8,
            alignSelf: "center",
            position: "absolute",
            bottom: 24,
            left: 24,
            right: 24,
            elevation: 2,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
            Logout
          </Text>
        </TouchableOpacity> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
