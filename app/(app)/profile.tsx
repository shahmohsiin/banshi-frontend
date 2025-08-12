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
  const { userData, updateUserData } = useUser();
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Update name when userData changes
  useEffect(() => {
    if (userData?.name) {
      setName(userData.name);
    }
  }, [userData]);

  
  const phone = userData?.phone || '';

 


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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Form */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={theme.colors.black} style={styles.inputIcon} />
              <Text style={styles.displayText}>{name}</Text>
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
          onPress={() => router.push('/(app)/update-profile')}
          disabled={isUpdating}
        >
          <Text style={styles.editButtonText}>
            {'EDIT PROFILE'}
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
    borderColor: theme.colors.lightGray,
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
    backgroundColor: theme.colors.primary,
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