import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { logoutUser } from "../../utils/auth";

export default function CustomDrawerContent(props) {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#181818" }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
        <DrawerItemList {...props} />
        {/* Edit Profile Button */}
        {/* <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
            router.push("/(drawer)/edit-profile");
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            marginTop: 8,
          }}
        >
          <Ionicons name="person-circle-outline" size={22} color="#00adf5" style={{ marginRight: 12 }} />
          <Text style={{ color: "#fff", fontSize: 16 }}>Edit Profile</Text>
        </TouchableOpacity> */}
      </DrawerContentScrollView>
      {/* Logout Button Fixed at Bottom */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
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
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}