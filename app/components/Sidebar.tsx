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
import { theme } from '../theme';

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

export const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, activeRoute }) => {
  const { userData, clearUserData } = useUser();

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
            // Navigation will be handled automatically by the layout
           
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
        Alert.alert('My History', 'Transaction history');
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
      id: 'how-to-play',
      title: 'How to Play',
      icon: 'play-circle',
      onPress: () => {
        Alert.alert('How to Play', 'Game instructions');
        onClose();
      },
      isActive: activeRoute === 'how-to-play',
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
      id: 'share',
      title: 'Share With Friends',
      icon: 'share-social',
      onPress: () => {
        Alert.alert('Share', 'Share app with friends');
        onClose();
      },
      isActive: activeRoute === 'share',
    },
    {
      id: 'rate-app',
      title: 'Rate App',
      icon: 'star',
      onPress: () => {
        Alert.alert('Rate App', 'Rate us on app store');
        onClose();
      },
      isActive: activeRoute === 'rate-app',
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
      <View style={styles.sidebar}>
        {/* Header */}
        <View style={styles.header}>
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
              style={[styles.menuItem, item.isActive && styles.activeMenuItem]}
              onPress={item.onPress}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={item.isActive ? theme.colors.primary : theme.colors.darkGray}
              />
              <Text
                style={[
                  styles.menuItemText,
                  item.isActive && styles.activeMenuItemText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        
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
    backgroundColor: theme.colors.gray,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
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
    marginRight: theme.spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  userPhone: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  menuContainer: {
    flex: 1,
    paddingTop: theme.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.colors.black,
    marginLeft: theme.spacing.md,
  },
  activeMenuItemText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },

}); 