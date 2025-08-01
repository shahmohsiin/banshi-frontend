import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../theme';

interface StartupModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const StartupModal: React.FC<StartupModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header with close button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          {/* Main content */}
          <View style={styles.content}>
            {/* App icon */}
            <View style={styles.appIcon}>
              <Ionicons name="trophy" size={60} color={theme.colors.white} />
            </View>

            {/* App name */}
            <Text style={styles.appName}>BANSHI</Text>
            <Text style={styles.appSubtitle}>ONLINE GAMING APP</Text>

            {/* Welcome message */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome to Banshi!</Text>
              <Text style={styles.welcomeText}>
                Experience the thrill of online gaming with the most trusted platform.
                Play your favorite games and win big!
              </Text>
            </View>

            {/* Features list */}
            <View style={styles.featuresSection}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={20} color={theme.colors.green} />
                <Text style={styles.featureText}>Secure & Trusted Platform</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="flash" size={20} color={theme.colors.primary} />
                <Text style={styles.featureText}>Instant Withdrawals</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="people" size={20} color={theme.colors.blue} />
                <Text style={styles.featureText}>24/7 Customer Support</Text>
              </View>
            </View>

            {/* Get started button */}
            <TouchableOpacity style={styles.getStartedButton} onPress={onClose}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  appSubtitle: {
    fontSize: 14,
    color: theme.colors.darkGray,
    fontWeight: '500',
    marginBottom: theme.spacing.xl,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  featureText: {
    fontSize: 16,
    color: theme.colors.black,
    marginLeft: theme.spacing.md,
    fontWeight: '500',
  },
  getStartedButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
}); 