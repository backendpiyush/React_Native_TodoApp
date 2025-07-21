import { Drawer } from 'expo-router/drawer';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AppLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer>
        <Drawer.Screen name="index" options={{ drawerLabel: 'Home' }} />
        <Drawer.Screen name="bydate" options={{ drawerLabel: 'Todos by Date' }} />
        {/* Add more Drawer Screens here */}
      </Drawer>
    </ThemeProvider>
  );
}
