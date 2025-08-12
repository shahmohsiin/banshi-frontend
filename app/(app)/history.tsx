import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getTransactionHistory, 
  getGameBidHistory,
  TransactionHistory,
  GameBidHistory 
} from '../config/api';
import { theme } from '../theme';

export default function HistoryScreen() {
  const router = useRouter();
  const { userData } = useUser();
  const { theme: currentTheme } = useTheme();
  const [activeSegment, setActiveSegment] = useState<'transactions' | 'games'>('transactions');
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [gameBids, setGameBids] = useState<GameBidHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };
function formatDateTime(input: string): string {
  if (!input) return "date not available";

  // Remove microseconds/nanoseconds so Date can parse
  const cleaned = input.split('.')[0];

  const date = new Date(cleaned);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${input}`);
  }

  const days: ReadonlyArray<string> = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  const dayName = days[date.getDay()];

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = String(hours).padStart(2, '0');

  return `${day}-${month}-${year} ${hoursStr}:${minutes}:${seconds} ${ampm}`;
}


  const fetchTransactionHistory = useCallback(async () => {
    if (!userData?.userId) return;
    
    try {
      setError(null);
      const data = await getTransactionHistory(userData.userId);
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions');
      console.error('Error fetching transaction history:', err);
    }
  }, [userData?.userId]);

  const fetchGameBidHistory = useCallback(async () => {
    if (!userData?.userId) return;
    
    try {
      setError(null);
      const data = await getGameBidHistory(userData.userId);
      setGameBids(data);
    } catch (err) {
      setError('Failed to load game bids');
      console.error('Error fetching game bid history:', err);
    }
  }, [userData?.userId]);

  const loadData = useCallback(async () => {
    if (!userData?.userId) return;
    
    setIsLoading(true);
    try {
      if (activeSegment === 'transactions') {
        await fetchTransactionHistory();
      } else {
        await fetchGameBidHistory();
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeSegment, userData?.userId, fetchTransactionHistory, fetchGameBidHistory]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (activeSegment === 'transactions') {
        await fetchTransactionHistory();
      } else {
        await fetchGameBidHistory();
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [activeSegment, fetchTransactionHistory, fetchGameBidHistory]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
  
  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'won':
        return theme.colors.success;
      case 'pending':
      case 'active':
        return theme.colors.pending;
      case 'failed':
      case 'lost':
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'won':
        return 'checkmark-circle';
      case 'pending':
      case 'active':
        return 'time';
      case 'failed':
      case 'lost':
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getBidTypeDisplayName = (bidType: string) => {
    switch (bidType.toLowerCase()) {
      case 'single':
        return 'Single Digit';
      case 'jodi':
        return 'Jodi';
      case 'panna':
        return 'Panna';
      case 'sangam':
        return 'Sangam';
      case 'half_sangam':
        return 'Half Sangam';
      case 'full_sangam':
        return 'Full Sangam';
      case 'double_panna':
        return 'Double Panna';
      case 'triple_panna':
        return 'Triple Panna';
      default:
        return bidType.charAt(0).toUpperCase() + bidType.slice(1);
    }
  };

  const getBidTypeIcon = (bidType: string) => {
    switch (bidType.toLowerCase()) {
      case 'single':
        return 'hash';
      case 'jodi':
        return 'git-branch';
      case 'panna':
        return 'grid';
      case 'sangam':
        return 'layers';
      case 'half_sangam':
        return 'layers-half';
      case 'full_sangam':
        return 'layers';
      case 'double_panna':
        return 'grid-outline';
      case 'triple_panna':
        return 'grid';
      default:
        return ;
    }
  };

const getTransactionColor =(transaction:any)=>{
  switch (transaction.toLowerCase()) {
    case 'credit':
    case 'Winning':
      return theme.colors.success
      break;

    default:
      return theme.colors.error;
  }
}

const getTransactionIcon =(transaction:any)=>{
  switch (transaction.toLowerCase()) {
    case 'winning':
      case 'credit':
        case 'recharge':
      return 'add-circle'
      break;
  
    default:
      return 'remove-circle'
      break;
  }
}
     

  const renderTransactionItem = ({ item }: { item: TransactionHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyItemContent}>
        <View style={styles.historyItemLeft}>
          <View style={styles.historyItemHeader}>
            <Ionicons 
              name={getTransactionIcon(item.type)} 
              size={20} 
              color={getTransactionColor(item.type)} 
            />
            <Text style={styles.historyItemTitle} numberOfLines={1}>
              {item.description}
            </Text>
          </View>
          <Text style={styles.historyItemDate}>
           Date: {formatDateTime(item.transactionTime)}
          </Text>
        </View>
        <View style={styles.historyItemRight}>
          <Text style={[
            styles.historyItemAmount,
            { color: item.type === 'credit' ? theme.colors.success : theme.colors.error }
          ]}>{formatAmount(item.amount)}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '20' }
          ]}>
            <Ionicons 
              name={getStatusIcon("success")} 
              size={12} 
              color={getStatusColor("success")} 
            />
            <Text style={[
              styles.historyItemStatus,
              { color: getStatusColor("success") }
            ]}>
              Success
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderGameBidItem = ({ item }: { item: GameBidHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyItemContent}>
        <View style={styles.historyItemLeft}>
          <View style={styles.historyItemHeader}>
            <Ionicons 
               name="game-controller-outline"
              size={20} 
              color={theme.colors.primary} 
            />
            
            <Text style={styles.historyItemTitle} numberOfLines={1}> {item.gameName ? item.gameName:"BANSHI GAME"}
            </Text>
          </View>
           <Text style={styles.historyItemSubtitle}>
             BID TYPE: {getBidTypeDisplayName(item.bidType)} 
           </Text>

                     <Text style={styles.historyItemSubtitle}>
             NUMBER: {item.bidNumber} | TIMING: {item.bidTiming}
           </Text>
          <Text style={styles.historyItemDate}>
           PLACED AT : {formatDateTime(item.placedAt)}
          </Text>
        </View>
        <View style={styles.historyItemRight}>
          <Text style={styles.historyItemAmount}>
            {formatAmount(item.amount)}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.resultStatus) + '20' }
          ]}>
            <Ionicons 
              name={getStatusIcon(item.resultStatus)} 
              size={12} 
              color={getStatusColor(item.resultStatus)} 
            />
            <Text style={[
              styles.historyItemStatus,
              { color: getStatusColor(item.resultStatus) }
            ]}>
              {item.resultStatus}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons 
        name={activeSegment === 'transactions' ? 'card-outline' : 'game-controller-outline'} 
        size={48} 
        color={theme.colors.textSecondary} 
      />
      <Text style={styles.emptyStateTitle}>
        No {activeSegment === 'transactions' ? 'Transactions' : 'Game Bids'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {activeSegment === 'transactions' 
          ? 'Your transaction history will appear here' 
          : 'Your game bid history will appear here'
        }
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="alert-circle-outline" size={48} color={theme.colors.error} />
      <Text style={styles.emptyStateTitle}>Error Loading Data</Text>
      <Text style={styles.emptyStateSubtitle}>
        {error || 'Something went wrong. Please try again.'}
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={loadData}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          History
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Segment Control */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSegment === 'transactions' && styles.segmentButtonActive
          ]}
          onPress={() => setActiveSegment('transactions')}
        >
          <Text style={[
            styles.segmentButtonText,
            activeSegment === 'transactions' && styles.segmentButtonTextActive
          ]}>
            Transactions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSegment === 'games' && styles.segmentButtonActive
          ]}
          onPress={() => setActiveSegment('games')}
        >
          <Text style={[
            styles.segmentButtonText,
            activeSegment === 'games' && styles.segmentButtonTextActive
          ]}>
            Games
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        renderErrorState()
      ) : activeSegment === 'transactions' ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTransactionItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={gameBids}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGameBidItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
    paddingBottom: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headerSpacer: {
    width: 48,
  },
  segmentContainer: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  historyItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
  },
  historyItemLeft: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  historyItemRight: {
    alignItems: 'flex-end',
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: 6,
    flex: 1,
    textTransform:"uppercase"
  },
  historyItemSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  fontWeight:"600"
  },
  historyItemDate: {
    fontSize: 11,
    color: theme.colors.textTertiary,
    marginBottom: 2,
    fontWeight:"600"
  },
  historyItemAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  historyItemStatus: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
}); 