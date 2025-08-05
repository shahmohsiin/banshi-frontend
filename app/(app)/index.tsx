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
  View
} from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { StartupModal } from '../components/StartupModal';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../hooks/useGame';
import { GameItem } from '../services/gameApi';
import { theme } from '../theme';

export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { state, fetchGames, clearError } = useGame();
  const { userData, refreshUserData } = useUser();
  const { isLoading } = useUser();

  useEffect(() => {
    loadGames();
    console.log('userData', userData);
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

  useEffect(() => {
    if (!isLoading && !userData) {
      router.replace('/auth/login');
    }
  }, [isLoading, userData]);

  if (isLoading || !userData) {
    // Optionally show a loading spinner or nothing while redirecting
    return null;
  }

  const handleMenuPress = () => setIsSidebarOpen(true);
  const handleCloseSidebar = () => setIsSidebarOpen(false);
  const handleCloseModal = () => setShowWelcomeModal(false);

  const goToNotifications = () => router.push('/(app)/notice');
  const goToWallet = () => router.push('/(app)/wallet');
  const goToAddFunds = () => router.push('/(app)/add-fund');
  const goToWithdraw = () => router.push('/(app)/withdraw');

  const handlePlayGame = (game: GameItem) => {
    console.log('handlePlayGame called with game:', game);
    console.log('Game status:', game.status);
    console.log('Game closeTime:', game.closeTime);
    
    // Only allow navigation if game is running
    if (game.status !== 'running') {
      Alert.alert('Game Closed', 'This game is currently closed and cannot be played.');
      return;
    }
    
    // Navigate to the new GameScreen, passing game name, openDate, closeDate
    router.push({
      pathname: '/(app)/game-screen',
      params: {
        gameName: game.name,
        openTime: game.openDate.toISOString(),
        closeTime: game.closeDate.toISOString(),
      },
    });
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

  // Debug function to test user data refresh
  const testRefreshUserData = async () => {
    if (userData?.phone) {
      try {
        await refreshUserData(userData.phone);
        
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    }
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
        <Text style={[
          styles.statusText, 
          { color: getStatusColor(game.status) }
        ]}>
          {getStatusText(game.status).toUpperCase()}
        </Text>
        <TouchableOpacity 
          style={[
            styles.playButton,
            { backgroundColor: game.status === 'running' ? theme.colors.green : theme.colors.darkGray }
          ]}
          onPress={() => game.status === 'running' ? handlePlayGame(game) : null}
          disabled={game.status !== 'running'}
        >
          <Ionicons name="play" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.playText}>PLAY GAME</Text>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    if (status === 'running') return theme.colors.green;
    if (status === 'closed') return theme.colors.red;
    return theme.colors.blue;
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={goToNotifications}>
            <Ionicons name="notifications" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          {/* Wallet Button */}
          <TouchableOpacity style={styles.walletButton} onPress={goToWallet}>
            <Ionicons name="diamond" size={24} color="#4FC3F7" />
            <Text style={styles.walletAmount}>{userData?.walletBalance || 0}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* App Title */}
        <View style={styles.appTitleSection}>
          <Text style={styles.appTitle}>BANSHI</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton} onPress={goToAddFunds}>
              <View style={styles.actionIcon}>
                <Ionicons name="add-circle" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.actionText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={goToWithdraw}>
              <View style={styles.actionIcon}>
                <Ionicons name="download" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, styles.whatsappButton]} onPress={handleContactWhatsApp}>
              <Ionicons name="logo-whatsapp" size={24} color={theme.colors.white} />
              <Text style={styles.socialButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.telegramButton]} onPress={handleContactTelegram}>
              <Ionicons name="chatbubble" size={24} color={theme.colors.white} />
              <Text style={styles.socialButtonText}>Telegram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Games List */}
        <View style={styles.gamesSection}>
          {/* Error Message */}
          {state.error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{state.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={clearError}>
                <Ionicons name="refresh" size={16} color={theme.colors.red} />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.gamesList}>
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
              state.games.map(renderGameItem)
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sidebar */}
      <Sidebar
        isVisible={isSidebarOpen}
        onClose={handleCloseSidebar}
        activeRoute="home"
      />

      {/* Welcome Modal */}
      <StartupModal
        isVisible={showWelcomeModal}
        onClose={handleCloseModal}
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
    paddingTop: 50,
  },
  menuButton: {
    padding: theme.spacing.xs,
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
  appTitleSection: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  appTitle: {
    color: theme.colors.white,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quickActions: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
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
  gamesSection: {
    padding: theme.spacing.lg,
   
    marginHorizontal: -theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  gamesHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  gamesTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gamesSubtitle: {
    fontSize: 16,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  gamesList: {
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
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
  loadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.darkGray,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.darkGray,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  retryButton: {
    padding: theme.spacing.xs,
  },
  retryButtonText: {
    color: theme.colors.red,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 