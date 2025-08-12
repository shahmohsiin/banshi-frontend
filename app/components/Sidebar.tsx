import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isActive?: boolean;
}

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  activeRoute?: string;
}

const THEME_OPTIONS = [
  { mode: 'system', label: 'System', icon: 'contrast' },
  { mode: 'light', label: 'Light', icon: 'sunny' },
  { mode: 'dark', label: 'Dark', icon: 'moon' },
] as const;

type ThemeOption = typeof THEME_OPTIONS[number];

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, activeRoute }) => {
  const { userData, clearUserData } = useUser();
  const { theme, themeMode, setThemeMode } = useTheme();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            await clearUserData();
            router.replace('/');
          }
        },
      ]
    );
  };

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: 'home',
      onPress: () => {
        router.push('/(app)');
        onClose();
      },
      isActive: activeRoute === 'home',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person',
      onPress: () => {
        router.push('/(app)/profile');
        onClose();
      },
      isActive: activeRoute === 'profile',
    },
    {
      id: 'funds',
      title: 'Add Funds',
      icon: 'business',
      onPress: () => {
        router.push('/(app)/add-fund');
        onClose();
      },
      isActive: activeRoute === 'funds',
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: 'download',
      onPress: () => {
        router.push('/(app)/withdraw');
        onClose();
      },
      isActive: activeRoute === 'withdraw',
    },
    {
      id: 'history',
      title: 'My History',
      icon: 'time',
      onPress: () => {
        router.push('/(app)/history');
        onClose();
      },
      isActive: activeRoute === 'history',
    },
    {
      id: 'rates',
      title: 'Game Rates',
      icon: 'logo-bitcoin',
      onPress: () => {
        router.push('/(app)/game-rates' as any);
        onClose();
      },
      isActive: activeRoute === 'rates',
    },
    
    {
      id: 'contact',
      title: 'Contact Us',
      icon: 'people',
      onPress: () => {
        router.push('/(app)/contact-us' as any);
        onClose();
      },
      isActive: activeRoute === 'contact',
    },
   
    
    {
      id: 'change-password',
      title: 'Change Password',
      icon: 'key',
      onPress: () => {
        router.push('/(app)/change-password');
        onClose();
      },
      isActive: activeRoute === 'change-password',
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out',
      onPress: handleLogout,
    },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sidebar, { backgroundColor: theme.colors.surface }]}> 
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}> 
          <View style={styles.userInfo}> 
            <View style={styles.avatar}> 
              <Ionicons name="person" size={30} color={theme.colors.white} /> 
            </View> 
            <View style={styles.userDetails}> 
              <Text style={styles.userName}>{userData?.name || 'User'}</Text> 
              <Text style={styles.userPhone}>{userData?.phone || 'No phone'}</Text> 
            </View> 
          </View> 
          <TouchableOpacity style={styles.closeButton} onPress={onClose}> 
            <Ionicons name="close" size={24} color={theme.colors.white} /> 
          </TouchableOpacity> 
        </View> 

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer}> 
          {menuItems.map((item) => ( 
            <TouchableOpacity 
              key={item.id} 
              style={[ 
                styles.menuItem,  
                { backgroundColor: theme.colors.surface }, 
                item.isActive && [styles.activeMenuItem, {  
                  backgroundColor: theme.colors.card, 
                  borderLeftColor: theme.colors.primary  
                }] 
              ]} 
              onPress={item.onPress} 
            > 
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={item.isActive ? theme.colors.primary : theme.colors.textSecondary} 
              /> 
              <Text 
                style={[ 
                  styles.menuItemText, 
                  { color: theme.colors.text }, 
                  item.isActive && [styles.activeMenuItemText, { color: theme.colors.primary }], 
                ]} 
              > 
                {item.title} 
              </Text> 
            </TouchableOpacity> 
          ))} 
        </ScrollView> 

        {/* Theme Mode Segmented Control at Bottom */}
        <View style={styles.themeSegmentedContainer}>
          <Text style={[styles.themeSegmentedLabel, { color: theme.colors.textSecondary }]}>Theme</Text>
          <View style={styles.themeSegmentedControl}>
            {THEME_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.mode}
                style={[
                  styles.themeSegmentedButton,
                  themeMode === option.mode && {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={() => setThemeMode(option.mode as any)}
              >
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={themeMode === option.mode ? theme.colors.white : theme.colors.textSecondary}
                  style={{ marginBottom: 2 }}
                />
                <Text
                  style={{
                    color: themeMode === option.mode ? theme.colors.white : theme.colors.textSecondary,
                    fontWeight: themeMode === option.mode ? 'bold' : 'normal',
                    fontSize: 13,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View> 
    </View> 
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activeMenuItem: {
    borderLeftWidth: 3,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  activeMenuItemText: {
    fontWeight: 'bold',
  },
  themeSegmentedContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'transparent',
  },
  themeSegmentedLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  themeSegmentedControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    padding: 2,
  },
  themeSegmentedButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
}); 