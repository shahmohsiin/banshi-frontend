import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { StartupModal } from '../components/StartupModal';
import { theme } from '../theme';

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showStartupModal, setShowStartupModal] = useState(true);

  useEffect(() => {
    // Show startup modal when component mounts
    // You can add logic here to check if it's the first time opening the app
    // For now, we'll show it every time
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <Ionicons name="menu" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        
     
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/(app)/notice')}
          >
            <Ionicons name="notifications" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.walletButton}
            onPress={() => router.push('/(app)/wallet')}
          >
            <Ionicons name="diamond" size={24} color="#4FC3F7" />
            <Text style={styles.walletAmount}>5</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Welcome Banner */}
      

        {/* App Name */}
        <View style={styles.appNameSection}>
          <Text style={styles.appName}>BANSHI</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.buttonIcon}>
                <Ionicons name="star" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.buttonText}>Play StarLine</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.buttonIcon}>
                <Ionicons name="snow" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.buttonText}>Gali Disawar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(app)/add-fund')}
            >
              <View style={styles.buttonIcon}>
                <Ionicons name="add-circle" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.buttonText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(app)/withdraw')}
            >
              <View style={styles.buttonIcon}>
                <Ionicons name="download" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.buttonText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Media Buttons */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, styles.whatsappButton]}>
              <Ionicons name="logo-whatsapp" size={24} color={theme.colors.white} />
              <Text style={styles.socialButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.telegramButton]}>
              <Ionicons name="chatbubble" size={24} color={theme.colors.white} />
              <Text style={styles.socialButtonText}>Telegram</Text>
            </TouchableOpacity>
          </View>
        </View>


        
      
      </ScrollView>

      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        activeRoute="home"
      />

      {/* Startup Modal */}
      <StartupModal
        isVisible={showStartupModal}
        onClose={() => setShowStartupModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  welcomeBanner: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
  },
  welcomeText: {
    color: theme.colors.red,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appNameSection: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  appName: {
    color: theme.colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButtons: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  whatsappButton: {
    backgroundColor: theme.colors.green,
  },
  telegramButton: {
    backgroundColor: theme.colors.blue,
  },
  socialButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  statsSection: {
    padding: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    width: '48%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.darkGray,
  },
  activitySection: {
    padding: theme.spacing.lg,
  },
  activityList: {
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.darkGray,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.green,
  },
}); 