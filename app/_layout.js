import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TaskProvider } from '../contexts/TaskContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TaskProvider>
          <NotificationProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            <StatusBar style="auto" />
          </NotificationProvider>
        </TaskProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}