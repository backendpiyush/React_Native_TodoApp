import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import { auth } from '../../firebaseConfig';

export default function RootLayout() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  if (loggedIn === null) {
    return (
      <View style={{ flex: 1, backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {loggedIn ? (
        <Stack.Screen name="(drawer)" />
      ) : (
        <>
          <Stack.Screen name="sign-up" />
          <Stack.Screen name="sign-in" />
        </>
      )}
    </Stack>
  );
}
