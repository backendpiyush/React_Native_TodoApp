import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TodoCard } from "../components/TodoCard";
import { addTodo, deleteTodo, fetchTodosByDate, updateTodo } from "../services/todoService";
import { Todo } from "../types/todo";

export default function HomeScreen() {
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

  const fetchTodos = useCallback(async () => {
    const todosArr = await fetchTodosByDate(selectedDate);
    setTodos(todosArr);
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [fetchTodos])
  );

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

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#181818" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#fff",
          marginBottom: 20,
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        Todo App
      </Text>

      <View
        style={{
          flexDirection: "column",
          marginBottom: 16,
          backgroundColor: "#232323",
          borderRadius: 12,
          padding: 10,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <TextInput
          value={inputTitle}
          onChangeText={setInputTitle}
          placeholder="Title"
          placeholderTextColor="#aaa"
          style={{
            borderWidth: 0,
            padding: 10,
            borderRadius: 8,
            color: "#fff",
            backgroundColor: "#333",
            fontSize: 16,
            marginBottom: 8,
          }}
        />
        <TextInput
          value={inputDescription}
          onChangeText={setInputDescription}
          placeholder="Description"
          placeholderTextColor="#aaa"
          style={{
            borderWidth: 0,
            padding: 10,
            borderRadius: 8,
            color: "#fff",
            backgroundColor: "#333",
            fontSize: 16,
            marginBottom: 8,
          }}
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          style={{
            backgroundColor: "#00adf5",
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 8,
            alignSelf: "flex-end",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 12, alignItems: "center" }}>
        <Text style={{ color: "#fff", marginBottom: 4, fontSize: 16 }}>
          Selected Date: {new Date(selectedDate).toDateString()}
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            backgroundColor: "#232323",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#00adf5", fontWeight: "bold" }}>Pick Date</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date(selectedDate)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
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
            onStartEdit={() => handleStartEdit(item.id, item.title, item.description)}
            onSaveEdit={() => handleSaveEdit(item.id)}
            onCancelEdit={() => setEditId(null)}
            onDelete={() => handleDeleteTodo(item.id)}
          />
        )}
      />
    </View>
  );
}