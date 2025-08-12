import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { updateUserName } from '../config/api';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';

export default function ProfileScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { userData, clearUserData, updateUserData } = useUser();
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Update name when userData changes
  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    }
  }, [userData]);

 
  const phone = userData?.phone || '';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear user data and navigate to login
            await clearUserData();
            router.replace('/');
            // Navigation will be handled automatically by the layout
            // Logout successful
          },
        },
      ]
    );
  };

  const handleEditProfile = async () => {
    if (!userData?.userId) {
      Alert.alert('Error', 'User ID not found. Please try logging in again.');
      return;
    }

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    setIsUpdating(true);
    
    try {
      await updateUserName(userData.userId, name.trim());
      
      // Update local user data
      updateUserData({ name: name.trim() });
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Form */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputEdit}>
              <Ionicons name="person" size={20} color={theme.colors.black} style={styles.inputIcon} />
              <TextInput
                
                value={name}
                onChangeText={setName}
                placeholder="Enter name"

                placeholderTextColor={theme.colors.darkGray}
              />
            </View>
          </View>

          {/* Email Field */}
         

          {/* Phone Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={theme.colors.black} style={styles.inputIcon} />
              <Text style={styles.displayText}>{phone}</Text>
            </View>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity 
          style={[styles.editButton, isUpdating && styles.editButtonDisabled]} 
          onPress={handleEditProfile}
          disabled={isUpdating}
        >
          <Text style={styles.editButtonText}>
            {isUpdating ? 'UPDATING...' : 'UPDATE'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeRoute="profile"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray,
  },
  header: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50, // Add margin top to push below status bar
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  formSection: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.darkGray,
  },
  inputEdit:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: "green",
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
  },
  displayText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.darkGray,
  },
  editButton: {
    backgroundColor: "#ebae34",
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  editButtonText: {
    color: theme.colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButtonDisabled: {
    opacity: 0.7,
  },
}); 