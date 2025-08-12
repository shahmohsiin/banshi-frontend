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
  View,Image,
  Linking
} from 'react-native';
import { Sidebar } from '../components/Sidebar';
import { StartupModal } from '../components/StartupModal';

import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { useGame } from '../hooks/useGame';
import MarqueeView from 'react-native-marquee-view';

export default function HomeScreen() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { state, fetchGames, clearError } = useGame();
  const { userData, refreshUserData } = useUser();
  const { isLoading } = useUser();
  const { theme } = useTheme();

  useEffect(() => {
    loadGames();
 
    
    // Refresh user data when component mounts
    if (userData?.phone) {
      refreshUserData(userData.phone).catch(error => {
 
      });
    }
  }, []);

  const loadGames = async () => {
    try {
      await fetchGames();
    } catch (error) {
     
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadGames();
      // Also refresh user data
      if (userData?.phone) {
        await refreshUserData(userData.phone);
      }
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

  const goToAddFunds = () => router.push('/(app)/add-fund');
  const goToWithdraw = () => router.push('/(app)/withdraw');
  const goToHistory = () => router.push('/(app)/history');

  const handlePlayGame = (game: any) => {
  
    
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
        gameId: game.id.toString(),
        openTime: game.openDate.toISOString(),
        closeTime: game.closeDate.toISOString(),
      },
    });
  };

  const handleViewChart = (game: any) => {
    Alert.alert('View Chart', `Opening chart for: ${game.name}`);
  };



  
  // Debug function to test user data refresh
  const testRefreshUserData = async () => {
    if (userData?.phone) {
      try {
        await refreshUserData(userData.phone);
        
      } catch (error) {
       
      }
    }
  };

  const renderGameItem = (game: any) => (
    <View key={game.id} style={[styles.gameCard, { 
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      shadowColor: theme.colors.text 
    }]}>
      {/* Chart Button */}
      <View style={styles.gameLeft}>
        <TouchableOpacity style={styles.chartButton} onPress={() => handleViewChart(game)}>
          <View style={[styles.chartIcon, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="bar-chart" size={20} color={theme.colors.white} />
          </View>
          <Text style={[styles.chartText, { color: theme.colors.textSecondary }]}>CHART</Text>
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={styles.gameCenter}>
        <Text style={[styles.gameName, { color: theme.colors.text }]}>{game.name.toUpperCase()}</Text>
        <Text style={[styles.gameNumbers, { color: theme.colors.primary }]}>{game.currentNumbers}</Text>
        <View style={styles.gameTiming}>
          <Text style={[styles.timingText, { color: theme.colors.textSecondary }]}>OPEN: {game.openTime}</Text>
          <Text style={[styles.timingText, { color: theme.colors.textSecondary }]}>CLOSE: {game.closeTime}</Text>
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
            { backgroundColor: game.status === 'running' ? theme.colors.running : theme.colors.textTertiary }
          ]}
          onPress={() => game.status === 'running' ? handlePlayGame(game) : null}
          disabled={game.status !== 'running'}
        >
          <Ionicons name="play" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={[styles.playText, { color: theme.colors.textSecondary }]}>PLAY GAME</Text>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    if (status === 'running') return theme.colors.running;
    if (status === 'closed') return theme.colors.closed;
    return theme.colors.closed; // Default to red for any other status
  };

  const getStatusText = (status: string) => {
    if (status === 'running') return 'PLAY';
    if (status === 'closed') return 'CLOSED';
    return 'CLOSED'; // Default to CLOSED for any other status
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <Ionicons name="menu" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton} onPress={goToNotifications}>
            <Ionicons name="notifications" size={24} color={theme.colors.white} />
          </TouchableOpacity>
          {/* Wallet Button */}
          <TouchableOpacity style={styles.walletButton} >
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
        <View style={[styles.appTitleSection, { backgroundColor: theme.colors.primary }]}>
           
         <Image
      source={require('../../assets/icons/header.png')}
      style={{
        width:"60%",
        height: 100,
        borderRadius:20,
        margin:5,
       
        
      }}
     
    />
          <Text style={styles.appTitle}>BANSHI GROUP OFFICIAL</Text>
        </View>

        {/* Quick Actions */}
        <View style={[styles.quickActions, { backgroundColor: theme.colors.primary }]}>
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
            <TouchableOpacity style={styles.actionButton} onPress={goToHistory}>
              <View style={styles.actionIcon}>
                <Ionicons name="time" size={24} color={theme.colors.white} />
              </View>
              <Text style={styles.actionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Marquee Text */}
        <View style={[styles.marqueeSection, { backgroundColor: theme.colors.surface }]}>
        <MarqueeView
  style={{
   
  }}>
  <View>
    <Text style={{color: theme.colors.text,fontSize: 16, fontWeight:900}}>WELCOME TO INDIA'S NO 1 TRUSTED BANSHI ONLINE MATKA APP</Text>
  </View>
</MarqueeView>
        </View>

        {/* Social Links */}
        <View style={styles.socialSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Connect With Us</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, styles.whatsappButton]} onPress={()=>Linking.openURL('whatsapp://send?phone=8299665369')}>
              <Ionicons name="logo-whatsapp" size={24} color={theme.colors.white} />
              <Text style={styles.socialButtonText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.telegramButton]} onPress={()=>Linking.openURL('https://t.me/Banshi_royal_group')}>
              <Ionicons name="chatbubble" size={24} color={theme.colors.white} />
              <Text style={styles.socialButtonText}>Telegram</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Games List */}
        <View style={styles.gamesSection}>
          {/* Error Message */}
          {state.error && (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{state.error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={clearError}>
                <Ionicons name="refresh" size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.gamesList}>
            {state.loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading games...</Text>
              </View>
            ) : state.games.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="game-controller-outline" size={64} color={theme.colors.textTertiary} />
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No games available</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadGames}>
                  <Text style={[styles.retryButtonText, { color: theme.colors.primary }]}>Try Again</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  menuButton: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    padding: 4,
    marginRight: 8,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  appTitleSection: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  appTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft:10
  },
  quickActions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  marqueeSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  marqueeText: {
    height: 40,
  },
  socialSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  telegramButton: {
    backgroundColor: '#0088CC',
  },
  contactButton: {
    backgroundColor: '#FF6B35',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gamesSection: {
    padding: 16,
    marginHorizontal: -16,
    marginTop: 16,
  },
  gamesList: {
    gap: 12,
    paddingHorizontal: 16,
  },
  gameCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
  },
  gameLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  chartButton: {
    alignItems: 'center',
  },
  chartIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  chartText: {
    fontSize: 12,
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
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  gameNumbers: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  gameTiming: {
    marginTop: 8,
  },
  timingText: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  gameRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  playText: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  retryButton: {
    padding: 4,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 