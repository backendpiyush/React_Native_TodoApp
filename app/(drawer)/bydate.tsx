import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CalendarList } from "react-native-calendars";
import { fetchAllTodos, fetchTodosByDate, updateTodo } from "../../services/todoService";
import { Todo } from "../../types/todo";
import { auth } from "../../firebaseConfig"; // Import auth
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Import db

export default function TodosByDateScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    const todosArr = await fetchAllTodos();
    setTodos(todosArr);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
    }, [fetchTodos])
  );

  useEffect(() => {
    if (selectedDate) {
      fetchTodosByDate(selectedDate).then(setTodos);
    }
  }, [selectedDate]);

  // Build markedDates object (dot only if not all completed)
  const markedDates: Record<string, any> = {};
  const todosByDate: Record<string, Todo[]> = {};
  todos.forEach(todo => {
    if (!todosByDate[todo.date]) todosByDate[todo.date] = [];
    todosByDate[todo.date].push(todo);
  });
  Object.entries(todosByDate).forEach(([date, todosArr]) => {
    const allCompleted = todosArr.every(t => t.completed);
    if (!allCompleted) {
      markedDates[date] = {
        marked: true,
        dotColor: "#00adf5",
        ...(date === selectedDate && {
          selected: true,
          selectedColor: "#00adf5",
          selectedTextColor: "#fff",
        }),
      };
    } else if (date === selectedDate) {
      markedDates[date] = {
        selected: true,
        selectedColor: "#00adf5",
        selectedTextColor: "#fff",
      };
    }
  });
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: "#00adf5",
      selectedTextColor: "#fff",
    };
  }

  const todosForDate = selectedDate
    ? todos.filter((todo) => todo.date === selectedDate)
    : [];

  const pendingTodos = todosForDate.filter((todo) => !todo.completed);
  const completedTodos = todosForDate.filter((todo) => todo.completed);

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed: !completed });
    fetchTodos();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#222" }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 16,
        letterSpacing: 1,
        textAlign: "center",
      }}>
        Todos by Date
      </Text>
      <CalendarList
        horizontal
        pastScrollRange={3}
        futureScrollRange={3}
        scrollEnabled
        showScrollIndicator
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#222",
          dayTextColor: "#fff",
          monthTextColor: "#fff",
          selectedDayTextColor: "#fff",
          todayTextColor: "#00adf5",
          dotColor: "#00adf5",
          selectedDotColor: "#fff",
        }}
        style={{ marginBottom: 18, borderRadius: 12 }}
      />
      {selectedDate && (
        <Text style={{
          color: "#00adf5",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 18,
          textAlign: "center",
          letterSpacing: 0.5,
        }}>
          {new Date(selectedDate).toDateString()}
        </Text>
      )}

      <View style={{ marginBottom: 18 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
          Pending Tasks
        </Text>
        {pendingTodos.length === 0 ? (
          <Text style={{ color: "#999", textAlign: "center", marginBottom: 12 }}>
            No pending tasks for this date.
          </Text>
        ) : (
          pendingTodos.map(item => (
            <View key={item.id} style={{
              backgroundColor: "#292929",
              borderRadius: 10,
              padding: 14,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => toggleComplete(item.id, !!item.completed)}>
                  <MaterialIcons
                    name="check-circle-outline"
                    size={24}
                    color="#00adf5"
                    style={{ marginRight: 12 }}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: "bold",
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{
                    color: "#ccc",
                    fontSize: 15,
                    marginTop: 2,
                  }}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ marginBottom: 18 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
          Completed Tasks
        </Text>
        {completedTodos.length === 0 ? (
          <Text style={{ color: "#999", textAlign: "center", marginBottom: 12 }}>
            No completed tasks for this date.
          </Text>
        ) : (
          completedTodos.map(item => (
            <View key={item.id} style={{
              backgroundColor: "#292929",
              borderRadius: 10,
              padding: 14,
              marginBottom: 12,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => toggleComplete(item.id, !!item.completed)}>
                  <MaterialIcons
                    name="check-circle"
                    size={24}
                    color="#0f0"
                    style={{ marginRight: 12 }}
                  />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: "#aaa",
                    fontSize: 17,
                    fontWeight: "bold",
                    textDecorationLine: "line-through",
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{
                    color: "#888",
                    fontSize: 15,
                    marginTop: 2,
                    textDecorationLine: "line-through",
                  }}>
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}