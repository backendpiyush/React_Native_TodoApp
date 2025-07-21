import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Todo } from "../types/todo";

type Props = {
  todo: Todo;
  isEditing: boolean;
  editTitle: string;
  editDescription: string;
  onEditTitle: (text: string) => void;
  onEditDescription: (text: string) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  isEditing,
  editTitle,
  editDescription,
  onEditTitle,
  onEditDescription,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) => (
  <View
    style={{
      flexDirection: "column",
      paddingVertical: 12,
      marginBottom: 14,
      backgroundColor: "#232323",
      borderRadius: 12,
      paddingHorizontal: 12,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 2,
    }}
  >
    {isEditing ? (
      <>
        <TextInput
          value={editTitle}
          onChangeText={onEditTitle}
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
          value={editDescription}
          onChangeText={onEditDescription}
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
      </>
    ) : (
      <>
        <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>
          {todo.title}
        </Text>
        <Text style={{ fontSize: 15, color: "#ccc", marginTop: 2 }}>
          {todo.description}
        </Text>
      </>
    )}
    <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
      {isEditing ? (
        <>
          <TouchableOpacity
            onPress={onSaveEdit}
            style={{
              backgroundColor: "#00adf5",
              paddingVertical: 8,
              paddingHorizontal: 22,
              borderRadius: 8,
              marginRight: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Save
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancelEdit}
            style={{
              backgroundColor: "#555",
              paddingVertical: 8,
              paddingHorizontal: 22,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={onStartEdit}
            style={{
              marginRight: 8,
              backgroundColor: "#222",
              borderRadius: 6,
              padding: 6,
            }}
          >
            <MaterialIcons name="edit" size={24} color="#00adf5" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDelete}
            style={{
              backgroundColor: "#222",
              borderRadius: 6,
              padding: 6,
            }}
          >
            <MaterialIcons name="delete" size={24} color="#f55" />
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);