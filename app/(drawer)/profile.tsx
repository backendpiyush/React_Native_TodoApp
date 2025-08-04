import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../firebaseConfig";


export default function ProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        const user = auth.currentUser;
        if (user) {
          // Fetch profile info from Firestore
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
          // Fetch image from SecureStore
          const storedImage = await SecureStore.getItemAsync('profileImage');
          setProfileImage(storedImage || null);
        }
        setLoading(false);
      };
      fetchProfile();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#181818" }}>
        <ActivityIndicator size="large" color="#00adf5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#181818", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Image
        source={{ uri: profileImage || 'https://placehold.co/120x120?text=Profile' }}
        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 24, borderWidth: 2, borderColor: "#00adf5" }}
      />
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        {profile?.name ?? "No Name"}
      </Text>
      <Text style={{ color: "#aaa", fontSize: 16, marginBottom: 8 }}>
        Age: {profile?.age ?? "-"}
      </Text>
      <Text style={{ color: "#aaa", fontSize: 16, marginBottom: 8 }}>
        Mobile: {profile?.mobile ?? "-"}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("edit-profile")}
        style={{
          marginTop: 32,
          backgroundColor: "#00adf5",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          width: 180,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
          Edit Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}