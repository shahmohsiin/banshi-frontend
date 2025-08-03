import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGame } from '../hooks/useGame';
import { GameItem } from '../services/gameApi';
import { theme } from '../theme';

export default function GamesScreen() {
  const { state, fetchGames, clearError } = useGame();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      await fetchGames();
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadGames();
    } finally {
      setRefreshing(false);
    }
  };

  const handlePlayGame = (game: GameItem) => {
    if (game.status === 'running') {
      Alert.alert('Play Game', `Starting game: ${game.name}`);
    } else {
      Alert.alert('Game Not Available', 'This game is not currently running.');
    }
  };

  const handleViewChart = (game: GameItem) => {
    Alert.alert('View Chart', `Opening chart for: ${game.name}`);
  };

  const handleContactWhatsApp = () => {
    Alert.alert('Contact', 'WhatsApp contact: 8442017014');
  };

  const handleContactTelegram = () => {
    Alert.alert('Contact', 'Telegram contact available');
  };

  const getStatusColor = (status: string) => {
    if (status === 'running') return theme.colors.green;
    if (status === 'closed') return theme.colors.red;
    return theme.colors.blue;
  };

  const renderGameItem = (game: GameItem) => (
    <View key={game.id} style={styles.gameCard}>
      {/* Chart Button */}
      <View style={styles.gameLeft}>
        <TouchableOpacity style={styles.chartButton} onPress={() => handleViewChart(game)}>
          <View style={styles.chartIcon}>
            <Ionicons name="bar-chart" size={20} color={theme.colors.white} />
          </View>
          <Text style={styles.chartText}>CHART</Text>
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={styles.gameCenter}>
        <Text style={styles.gameName}>{game.name.toUpperCase()}</Text>
        <Text style={styles.gameNumbers}>{game.currentNumbers}</Text>
        <View style={styles.gameTiming}>
          <Text style={styles.timingText}>OPEN: {game.openTime}</Text>
          <Text style={styles.timingText}>CLOSE: {game.closeTime}</Text>
        </View>
      </View>

      {/* Play Button */}
      <View style={styles.gameRight}>
        <Text style={[styles.statusText, { color: getStatusColor(game.status) }]}>
          {game.status.charAt(0).toUpperCase() + game.status.slice(1).toUpperCase()}
        </Text>
        <TouchableOpacity 
          style={[
            styles.playButton,
            { backgroundColor: game.status === 'running' ? theme.colors.green : theme.colors.darkGray }
          ]}
          onPress={() => handlePlayGame(game)}
          disabled={game.status !== 'running'}
        >
          <Ionicons name="play" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.playText}>PLAY GAME</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Games</Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactWhatsApp}>
            <Ionicons name="logo-whatsapp" size={16} color={theme.colors.green} />
            <Text style={styles.contactText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleContactTelegram}>
            <Ionicons name="chatbubble" size={16} color={theme.colors.blue} />
            <Text style={styles.contactText}>Telegram</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Error Message */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={clearError}>
            <Ionicons name="refresh" size={16} color={theme.colors.red} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {state.loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading games...</Text>
          </View>
        ) : state.games.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="game-controller-outline" size={64} color={theme.colors.darkGray} />
            <Text style={styles.emptyText}>No games available</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadGames}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.gamesList}>
            {state.games.map(renderGameItem)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  contactButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  contactText: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginLeft: theme.spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 14,
    flex: 1,
  },
  retryButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.darkGray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.md,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },
  gamesList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  gameLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  chartButton: {
    alignItems: 'center',
  },
  chartIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chartText: {
    fontSize: 12,
    color: theme.colors.darkGray,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gameCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  gameNumbers: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    letterSpacing: 1,
  },
  gameTiming: {
    marginTop: theme.spacing.sm,
  },
  timingText: {
    fontSize: 12,
    color: theme.colors.darkGray,
    marginBottom: 2,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  gameRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playText: {
    fontSize: 12,
    color: theme.colors.darkGray,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
}); 