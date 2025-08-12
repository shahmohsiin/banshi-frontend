import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface StartupModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export const StartupModal: React.FC<StartupModalProps> = ({ isVisible, onClose }) => {
  const { theme } = useTheme();
  
  const features = [
    { icon: 'shield-checkmark' as keyof typeof Ionicons.glyphMap, text: 'Secure & Trusted Platform', color: theme.colors.success },
    { icon: 'flash' as keyof typeof Ionicons.glyphMap, text: 'Instant Withdrawals', color: theme.colors.primary },
    { icon: 'people' as keyof typeof Ionicons.glyphMap, text: '24/7 Customer Support', color: theme.colors.blue },
  ];

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* App Icon */}
            <View style={[styles.appIcon, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="trophy" size={60} color={theme.colors.white} />
            </View>

            {/* App Name */}
            <Text style={[styles.appName, { color: theme.colors.primary }]}>BANSHI</Text>
            <Text style={[styles.appSubtitle, { color: theme.colors.textSecondary }]}>ONLINE GAMING APP</Text>

            {/* Welcome Message */}
            <View style={styles.welcomeSection}>
              <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Welcome to Banshi!</Text>
              <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
                Experience the thrill of online gaming with the most trusted platform.
                Play your favorite games and win big!
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresSection}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name={feature.icon} size={20} color={feature.color} />
                  <Text style={[styles.featureText, { color: theme.colors.text }]}>{feature.text}</Text>
                </View>
              ))}
            </View>

            {/* Game Rules */}
            <View style={styles.rulesSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>GENERAL RULES</Text>
              <View style={styles.rulesList}>
                <View style={styles.ruleItem}>
                  <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.ruleLabel, { color: theme.colors.text }]}>MINIMUM DEPOSIT:</Text> 300
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.ruleLabel, { color: theme.colors.text }]}>MINIMUM WITHDRAW:</Text> 1000
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.ruleLabel, { color: theme.colors.text }]}>MINIMUM BID POINT:</Text> 10
                  </Text>
                </View>
                <View style={styles.ruleItem}>
                  <Text style={[styles.ruleText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.ruleLabel, { color: theme.colors.text }]}>WITHDRAWAL TIME:</Text> NIGHT 12 AM TO MORNING 7AM
                  </Text>
                </View>
              </View>
            </View>

            {/* Game Rates */}
            <View style={styles.ratesSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>GAME RATES</Text>
              <View style={styles.ratesList}>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Single (ANK):</Text> 10 ka 100
                  </Text>
                </View>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Jodi:</Text> 10 ka 1000
                  </Text>
                </View>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Single Panna:</Text> 10 ka 1600
                  </Text>
                </View>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Double Panna:</Text> 10 ka 3200
                  </Text>
                </View>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Triple Panna:</Text> 10 ka 7000
                  </Text>
                </View>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Half Sangam:</Text> 10 ka 10000
                  </Text>
                </View>
                <View style={styles.rateItem}>
                  <Text style={[styles.rateText, { color: theme.colors.textSecondary }]}>
                    <Text style={[styles.rateLabel, { color: theme.colors.text }]}>Full Sangam:</Text> 10 ka 100000
                  </Text>
                </View>
              </View>
            </View>

            {/* Get Started Button */}
            <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: theme.colors.primary }]} onPress={onClose}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </ScrollView>
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
  modal: {
    width: width * 0.9,
    maxWidth: 400,
    maxHeight: '100%',
    height: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 12,
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 4,
  },
      content: {
      flex: 1,
    },
    contentContainer: {
      padding: 32,
      alignItems: 'center',
    },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 32,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  rulesSection: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  rulesList: {
    width: '100%',
  },
  ruleItem: {
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ruleLabel: {
    fontWeight: 'bold',
  },
  ratesSection: {
    width: '100%',
    marginBottom: 24,
  },
  ratesList: {
    width: '100%',
  },
  rateItem: {
    marginBottom: 6,
  },
  rateText: {
    fontSize: 14,
    lineHeight: 18,
  },
  rateLabel: {
    fontWeight: 'bold',
  },
  getStartedButton: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 