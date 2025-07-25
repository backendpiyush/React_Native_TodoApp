import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
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
          setAge(data.age || "");
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
    <View style={{ flex: 1, backgroundColor: "#181818", padding: 24 }}>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>
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
        }}
      />
      {error ? (
        <Text style={{ color: "#ff5252", marginBottom: 12 }}>{error}</Text>
      ) : null}
      <TouchableOpacity
        onPress={handleSave}
        disabled={saving}
        style={{
          backgroundColor: "#00adf5",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
          {saving ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCancel}
        disabled={saving}
        style={{
          backgroundColor: "#00adf5",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
}