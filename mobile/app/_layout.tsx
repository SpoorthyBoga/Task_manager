import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The Stack automatically manages all screens in the app/ folder */}
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="create-user" options={{ presentation: 'modal', headerTitle: 'Add User' }} />
      </Stack>
    </AuthProvider>
  );
}