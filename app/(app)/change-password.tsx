import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { theme } from '../theme';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Ionicons name="menu" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <View style={styles.logoContainer}>
            
            
          </View>
        </View>
        
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <View style={styles.titleBar}>
              <View style={styles.titleBarLine} />
              <Text style={styles.titleText}>
                CHANGE PASSWORD
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <View style={styles.passwordIcon}>
                  <Text style={styles.asteriskText}>***</Text>
                  <View style={styles.asteriskLine} />
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={theme.colors.darkGray}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <View style={styles.passwordIcon}>
                  <Text style={styles.asteriskText}>***</Text>
                  <View style={styles.asteriskLine} />
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Confirm Password"
                placeholderTextColor={theme.colors.darkGray}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <View style={styles.passwordIcon}>
                  <Text style={styles.asteriskText}>***</Text>
                  <View style={styles.asteriskLine} />
                </View>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter Confirm Password"
                placeholderTextColor={theme.colors.darkGray}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Change Password Button */}
            <TouchableOpacity
              style={[styles.changeButton, isLoading && styles.changeButtonDisabled]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.changeButtonText}>Changing...</Text>
              ) : (
                <Text style={styles.changeButtonText}>
                  CHANGE PASSWORD
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeRoute="change-password"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5', // Light pink background
  },
  header: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    paddingTop: 50, // Add margin top to push below status bar
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  appInfo: {
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  appTagline: {
    fontSize: 10,
    color: theme.colors.white,
    opacity: 0.8,
  },
  notificationButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  titleSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBarLine: {
    width: 4,
    height: 30,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
    borderRadius: 2,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  passwordIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  asteriskText: {
    fontSize: 8,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  asteriskLine: {
    width: 8,
    height: 1,
    backgroundColor: theme.colors.white,
    marginTop: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  changeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  changeButtonDisabled: {
    opacity: 0.6,
  },
  changeButtonText: {
    color: theme.colors.black,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 