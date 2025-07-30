import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || "");
          setAge(data.age ? String(data.age) : "");
          setMobile(data.mobile || "");
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          name,
          age,
          mobile,
        });
        navigation.goBack();
      }
    } catch (e) {
      setError("Failed to update profile.");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#181818" }}>
        <ActivityIndicator size="large" color="#00adf5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#181818" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 24,
          paddingBottom: 120, // space for buttons
          justifyContent: "center",
          alignItems: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 32, textAlign: "center" }}>
          Edit Profile
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor="#aaa"
          style={{
            backgroundColor: "#232323",
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            width: 280,
            textAlign: "center",
          }}
        />
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="Age"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          style={{
            backgroundColor: "#232323",
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            width: 280,
            textAlign: "center",
          }}
        />
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="Mobile Number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          style={{
            backgroundColor: "#232323",
            color: "#fff",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            width: 280,
            textAlign: "center",
          }}
        />
        {error ? (
          <Text style={{ color: "#ff5252", marginBottom: 12, textAlign: "center" }}>{error}</Text>
        ) : null}
      </ScrollView>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#181818",
          padding: 24,
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <TouchableOpacity
          onPress={handleCancel}
          disabled={saving}
          style={{
            flex: 1,
            backgroundColor: "#232323",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginRight: 8,
            borderWidth: 1,
            borderColor: "#00adf5",
          }}
        >
          <Text style={{ color: "#00adf5", fontWeight: "bold", fontSize: 17 }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            backgroundColor: "#00adf5",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
            marginLeft: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}