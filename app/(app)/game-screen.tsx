import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';

const gameOptions = [
  { label: 'Single Digit', icon: require('../../assets/icons/single.png'), color: '#FF6B35', bgColor: '#FFF3E0' },
  { label: 'Jodi Digit', icon: require('../../assets/icons/jodi.png'), color: '#FF4500', bgColor: '#FFEBEE' },
  { label: 'Single Panna', icon: require('../../assets/icons/single-panna.png'), color: '#25D366', bgColor: '#E8F5E8' },
  { label: 'Double Panna', icon: require('../../assets/icons/double-panna.png'), color: '#0088CC', bgColor: '#E3F2FD' },
  { label: 'Triple Panna', icon: require('../../assets/icons/tripple-panna.png'), color: '#9C27B0', bgColor: '#F3E5F5' },
  { label: 'Half Sangam', icon: require('../../assets/icons/sangam.png'), color: '#FF9800', bgColor: '#FFF8E1' },
  { label: 'Full Sangam', icon: require('../../assets/icons/sangam.png'), color: '#E91E63', bgColor: '#FCE4EC' },
];

const fourGameOptions = [
  { label: 'Single Digit', icon: require('../../assets/icons/single.png'), color: '#FF6B35', bgColor: '#FFF3E0' },
  { label: 'Single Panna', icon: require('../../assets/icons/single-panna.png'), color: '#25D366', bgColor: '#E8F5E8' },
  { label: 'Double Panna', icon: require('../../assets/icons/double-panna.png'), color: '#0088CC', bgColor: '#E3F2FD' },
  { label: 'Triple Panna', icon: require('../../assets/icons/tripple-panna.png'), color: '#9C27B0', bgColor: '#F3E5F5' },
];

export default function GameScreen() {
  const { gameName, openTime, closeTime } = useLocalSearchParams();

  const now = new Date();
  const open = new Date(openTime as string);
  const close = new Date(closeTime as string);
  
  // Generate gameId from gameName for now
  const gameId = gameName?.toString().toLowerCase().replace(/\s+/g, '_') || 'default_game';

  const handleGameTypePress = (gameType: string) => {
    switch (gameType) {
      case 'Single Digit':
        router.push({
          pathname: '/(app)/single-digit',
          params: { gameName, gameId },
        });
        break;
      case 'Jodi Digit':
        router.push({
          pathname: '/(app)/jodi-digit',
          params: { gameName, gameId },
        });
        break;
      case 'Single Panna':
        router.push({
          pathname: '/(app)/single-panna',
          params: { gameName },
        });
        break;
      case 'Double Panna':
        router.push({
          pathname: '/(app)/double-panna',
          params: { gameName },
        });
        break;
      case 'Triple Panna':
        router.push({
          pathname: '/(app)/triple-panna',
          params: { gameName },
        });
        break;
      case 'Half Sangam':
        router.push({
          pathname: '/(app)/half-sangam',
          params: { gameName },
        });
        break;
      case 'Full Sangam':
        router.push({
          pathname: '/(app)/full-sangam',
          params: { gameName },
        });
        break;
      default:
        router.push({
          pathname: '/(app)/game-bid',
          params: { gameType, gameName },
        });
        break;
    }
  };

  const renderGameOption = (option: any) => (
    <TouchableOpacity 
      key={option.label} 
      style={[styles.optionBox, { backgroundColor: option.bgColor }]}
      onPress={() => handleGameTypePress(option.label)}
    >
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.white }]}>
        <Image source={option.icon} style={styles.gameIcon} resizeMode="contain" />
      </View>
      <Text style={styles.optionLabel}>{option.label}</Text>
    </TouchableOpacity>
  );

  // Check if game is closed
  const isGameClosed = now >= close;

  if (isGameClosed) {
    // Show game closed
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{gameName}</Text>
          <View style={[styles.statusBadge, styles.closedBadge]}>
            <Ionicons name="close-circle" size={16} color={theme.colors.red} />
            <Text style={[styles.statusText, styles.closedStatusText]}>CLOSED</Text>
          </View>
        </View>

        <View style={styles.closedContainer}>
          <View style={styles.closedIconContainer}>
            <Ionicons name="lock-closed" size={48} color={theme.colors.red} />
          </View>
          <Text style={styles.closedText}>Game Session Ended</Text>
          <Text style={styles.closedSubtext}>This game is no longer available</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Game is not closed - determine which options to show
  const isGameLive = now >= open && now < close;
  const gameOptionsToShow = isGameLive ? fourGameOptions : gameOptions;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{gameName}</Text>
        <View style={styles.statusBadge}>
          <Ionicons name="play-circle" size={16} color={theme.colors.green} />
          <Text style={styles.statusText}>
            {isGameLive ? 'LIVE' : 'PREPARING'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Game Status Info */}
        <View style={styles.statusInfo}>
          <Text style={styles.statusInfoText}>
            {isGameLive 
              ? 'Game is now live! Only 4 game types available.' 
              : 'Game will start soon. All 7 game types available.'
            }
          </Text>
        </View>
        
        <View style={styles.gridContainer}>
          {gameOptionsToShow.map(renderGameOption)}
        </View>
      </View>
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
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 211, 102, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  closedBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  statusText: {
    color: theme.colors.green,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: theme.spacing.xs,
  },
  closedStatusText: {
    color: theme.colors.red,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  statusInfo: {
    backgroundColor: theme.colors.lightGray,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  statusInfoText: {
    fontSize: 14,
    color: theme.colors.darkGray,
    textAlign: 'center',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.lg,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBox: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  closedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  closedIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  closedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.red,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  closedSubtext: {
    fontSize: 14,
    color: theme.colors.darkGray,
    textAlign: 'center',
  },
  gameIcon: {
    width: 40,
    height: 40,
  },
}); 