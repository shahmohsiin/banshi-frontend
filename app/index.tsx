import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useUser } from './contexts/UserContext';
import { theme } from './theme';

export default function Index() {
  const { userData, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      console.log('Index: Navigation check - userData:', userData);
      
      // Add a small delay to ensure user data is properly set
      const timer = setTimeout(() => {
        if (userData) {
          console.log('Index: User is logged in, navigating to app');
          try {
            router.replace('/(app)');
            console.log('Index: Navigation command sent successfully');
          } catch (error) {
            console.error('Navigation error:', error);
          }
        } else {
          console.log('Index: User is not logged in, navigating to login');
          try {
            router.replace('/auth/login');
            console.log('Index: Navigation command sent successfully');
          } catch (error) {
            console.error('Navigation error:', error);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, userData]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.colors.white 
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ 
          marginTop: 16, 
          color: theme.colors.darkGray,
          fontSize: 16
        }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: theme.colors.white 
    }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ 
        marginTop: 16, 
        color: theme.colors.darkGray,
        fontSize: 16
      }}>Redirecting...</Text>
    </View>
  );
}
