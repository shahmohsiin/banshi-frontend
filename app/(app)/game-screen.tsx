import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const gameOptions = [
  { label: 'Single Digit', icon: require('../../assets/icons/single.png'), color: '#FF6B35', bgColor: '#FFF3E0' },
  { label: 'Jodi Digit', icon: require('../../assets/icons/jodi.png'), color: '#FF4500', bgColor: '#FFEBEE' },
  { label: 'Single Panna', icon: require('../../assets/icons/single-panna.png'), color: '#25D366', bgColor: '#E8F5E8' },
  { label: 'Double Panna', icon: require('../../assets/icons/double-panna.png'), color: '#0088CC', bgColor: '#E3F2FD' },
  { label: 'Triple Panna', icon: require('../../assets/icons/tripple-panna.png'), color: '#9C27B0', bgColor: '#F3E5F5' },
  { label: 'Half Sangam', icon: require('../../assets/icons/sangam.png'), color: '#FF9800', bgColor: '#FFF8E1' },
  { label: 'Full Sangam', icon: require('../../assets/icons/sangam.png'), color: '#E91E63', bgColor: '#FCE4EC' },
];

const GameOptions4=[
   { label: 'Single Digit', icon: require('../../assets/icons/single.png'), color: '#FF6B35', bgColor: '#FFF3E0' },
  { label: 'Single Panna', icon: require('../../assets/icons/single-panna.png'), color: '#25D366', bgColor: '#E8F5E8' },
  { label: 'Double Panna', icon: require('../../assets/icons/double-panna.png'), color: '#0088CC', bgColor: '#E3F2FD' },
  { label: 'Triple Panna', icon: require('../../assets/icons/tripple-panna.png'), color: '#9C27B0', bgColor: '#F3E5F5' },
]

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_COLUMNS = 2;
const GRID_GAP = 16;
const ITEM_WIDTH = (SCREEN_WIDTH - 16 * 2 - GRID_GAP) / GRID_COLUMNS; // 16px horizontal padding on each side

export default function GameScreen() {
  const { gameName, gameId, openTime, closeTime } = useLocalSearchParams();
  const { theme } = useTheme();

  const now = new Date();
  const open = new Date(openTime as string);
  const close = new Date(closeTime as string);

  // Use actual gameId from paramsa
  const actualGameId = gameId as string;

  const handleGameTypePress = (gameType: string) => {
    switch (gameType) {
      case 'Single Digit':
        router.push({
          pathname: '/(app)/single-digit',
          params: { gameName, gameId: actualGameId },
        });
        break;
      case 'Jodi Digit':
        router.push({
          pathname: '/(app)/jodi-digit',
          params: { gameName, gameId: actualGameId },
        });
        break;
      case 'Single Panna':
        router.push({
          pathname: '/(app)/single-panna',
          params: { gameName, gameId: actualGameId },
        });
        break;
      case 'Double Panna':
        router.push({
          pathname: '/(app)/double-panna',
          params: { gameName, gameId: actualGameId },
        });
        break;
      case 'Triple Panna':
        router.push({
          pathname: '/(app)/triple-panna',
          params: { gameName, gameId: actualGameId },
        });
        break;
      case 'Half Sangam':
        router.push({
          pathname: '/(app)/half-sangam',
          params: { gameName, gameId: actualGameId },
        });
        break;
      case 'Full Sangam':
        router.push({
          pathname: '/(app)/full-sangam',
          params: { gameName, gameId: actualGameId },
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

  const renderGameOptionsGrid = () => {
    // Time-based filtering logic
    const isGameRunning = now >= open && now < close;
    const isBeforeGame = now < open;
    
    // Filter games based on time
    let filteredGameOptions = gameOptions;
    
    if (isGameRunning) {
      // Show only 4 games when game is running
      filteredGameOptions = GameOptions4;
    } else if (isBeforeGame) {
      // Show all 7 games when before opening
      filteredGameOptions = gameOptions;
    } else {
      // Game is closed - show all 7 games
      filteredGameOptions = gameOptions;
    }
    
    const rows = [];
    for (let i = 0; i < filteredGameOptions.length; i += GRID_COLUMNS) {
      const rowItems = filteredGameOptions.slice(i, i + GRID_COLUMNS);
      rows.push(
        <View key={i} style={{ flexDirection: 'row', marginBottom: i + GRID_COLUMNS < filteredGameOptions.length ? GRID_GAP : 0 }}>
          {rowItems.map((option, colIdx) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.gameOption,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  shadowColor: theme.colors.text,
                  width: ITEM_WIDTH,
                  marginRight: colIdx === GRID_COLUMNS - 1 ? 0 : GRID_GAP,
                },
              ]}
              onPress={() => handleGameTypePress(option.label)}
            >
              <View style={[styles.iconContainer, { backgroundColor: option.bgColor }]}>
                <Image source={option.icon} style={styles.icon} />
              </View>
              <Text style={[styles.gameLabel, { color: theme.colors.text }]}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return rows;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      {/* Header */}
      
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}> 
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} /> 
        </TouchableOpacity> 
        <Text style={styles.headerTitle}>{gameName}</Text> 
        <View style={styles.placeholder} /> 
      </View> 

      {/* Game Options */}
      <View style={styles.content}> 
        
        <ScrollView style={styles.gameOptionsGrid}>{renderGameOptionsGrid()}</ScrollView> 
      </View>
       
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  gameOptionsGrid: {
    // No gap here, handled in renderGameOptionsGrid
  },
  gameOption: {
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  gameLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 