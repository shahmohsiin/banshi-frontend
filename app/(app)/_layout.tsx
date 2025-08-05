import { Stack } from 'expo-router';
import React from 'react';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="contact-us" />
      <Stack.Screen name="game-rates" />
      <Stack.Screen name="add-fund" />
      <Stack.Screen name="withdraw" />
      <Stack.Screen name="notice" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="game-screen" />
    </Stack>
  );
} 