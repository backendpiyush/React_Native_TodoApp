import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#181818' }, // Black background
        drawerActiveTintColor: '#00adf5',
        drawerInactiveTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="bydate" options={{ drawerLabel: 'Todos by Date' }} />
    </Drawer>
  );
}
