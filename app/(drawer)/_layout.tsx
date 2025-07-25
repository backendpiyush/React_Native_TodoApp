import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent'; // adjust path as needed

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: '#181818' }, // Black background
        drawerActiveTintColor: '#00adf5',
        drawerInactiveTintColor: '#fff',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="bydate" options={{ drawerLabel: 'Todos by Date' }} />
      {/* Example Drawer.Screen addition */}
      <Drawer.Screen
        name="edit-profile"
        options={{ drawerLabel: 'Edit Profile' }}
      />
    </Drawer>
  );
}
