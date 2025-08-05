import { Stack } from 'expo-router';
import React from 'react';
import { UserProvider } from './contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(app)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/forgot-password" />
      </Stack>
    </UserProvider>
  );
}
