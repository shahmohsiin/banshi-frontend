import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../theme';

interface ContactOption {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  onPress: () => void;
}

export default function ContactUsScreen() {
  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWhatsApp = (phoneNumber: string) => {
    const message = 'Hello! I need help with Banshi app.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleTelegram = (username: string) => {
    const telegramUrl = `https://t.me/${username}`;
    Linking.openURL(telegramUrl);
  };

  const handleWithdrawProof = () => {
    const whatsappGroupUrl = 'https://chat.whatsapp.com/DAtghHfoAb71QZysbzS37D';
    Linking.openURL(whatsappGroupUrl);
  };

  const contactOptions: ContactOption[] = [
    {
      id: 'call1',
      title: 'Call',
      subtitle: '8442017014',
      icon: 'call',
      iconColor: theme.colors.blue,
      onPress: () => handleCall('8442017014'),
    },
    {
      id: 'call2',
      title: 'Call',
      subtitle: '8442017014',
      icon: 'call',
      iconColor: theme.colors.green,
      onPress: () => handleCall('8442017014'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: '8442017014',
      icon: 'logo-whatsapp',
      iconColor: theme.colors.green,
      onPress: () => handleWhatsApp('8442017014'),
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'banshi@gmail.com',
      icon: 'mail',
      iconColor: theme.colors.red,
      onPress: () => handleEmail('banshi@gmail.com'),
    },
    {
      id: 'telegram',
      title: 'Telegram',
      subtitle: 'https://t.me/banshi',
      icon: 'paper-plane',
      iconColor: theme.colors.blue,
      onPress: () => handleTelegram('banshi'),
    },
    {
      id: 'withdraw-proof',
      title: 'Withdraw Proof',
      subtitle: 'https://chat.whatsapp.com/DAtghHfoAb71QZysbzS37D',
      icon: 'document-text',
      iconColor: theme.colors.blue,
      onPress: handleWithdrawProof,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="trophy" size={40} color={theme.colors.white} />
          </View>
          <Text style={styles.bannerTitle}>BANSHI</Text>
          <Text style={styles.bannerSubtitle}>ONLINE GAMING APP</Text>
        </View>

        {/* Contact Options */}
        <View style={styles.contactSection}>
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.contactCard}
              onPress={option.onPress}
            >
              <View style={[styles.contactIcon, { backgroundColor: option.iconColor }]}>
                <Ionicons name={option.icon} size={24} color={theme.colors.white} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.darkGray} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  banner: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  bannerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  contactSection: {
    paddingHorizontal: theme.spacing.lg,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  contactSubtitle: {
    fontSize: 14,
    color: theme.colors.darkGray,
  },
}); 