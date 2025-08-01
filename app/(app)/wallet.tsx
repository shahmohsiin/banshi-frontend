import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../theme';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  status: 'SUCCESSFUL' | 'PENDING' | 'FAILED';
  date: string;
}

const WalletScreen: React.FC = () => {
  const [currentPoints] = React.useState(5); // This would come from your app state

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Welcome Bonus',
      amount: 5,
      status: 'SUCCESSFUL',
      date: '2025-08-01 16:16:38',
    },
    // Add more transactions as needed
  ];

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'SUCCESSFUL':
        return theme.colors.success;
      case 'PENDING':
        return theme.colors.secondary;
      case 'FAILED':
        return theme.colors.error;
      default:
        return theme.colors.darkGray;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Wallet Points Display */}
        <View style={styles.walletPointsContainer}>
          <View style={styles.pointsSection}>
            <View style={styles.pointsHeader}>
              <View style={styles.pointsIconContainer}>
                <Ionicons name="diamond" size={32} color="#4FC3F7" />
                <Text style={styles.pointsNumber}>{currentPoints}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.pointsLabel}>Wallet Points</Text>
          </View>
          <TouchableOpacity 
            style={styles.addFundButton}
            onPress={() => router.push('/(app)/add-fund')}
          >
            <Ionicons name="add" size={20} color={theme.colors.white} />
            <Text style={styles.addFundText}>Add Fund</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(app)/withdraw')}
          >
            <View style={styles.actionButtonIcon}>
              <Ionicons name="arrow-down" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionButtonText}>Withdraw</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // TODO: Navigate to payment method screen when implemented
              Alert.alert('Payment Method', 'Payment method screen will be implemented next time');
            }}
          >
            <View style={styles.actionButtonIcon}>
              <Ionicons name="card" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionButtonText}>Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Section */}
        <View style={styles.transactionSection}>
          <Text style={styles.transactionTitle}>Transaction</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionName}>{transaction.title}</Text>
                <Text style={styles.transactionAmount}>{transaction.amount}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionStatus}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(transaction.status) }
                ]}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
          
          {transactions.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt" size={48} color={theme.colors.lightGray} />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>Your transaction history will appear here</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.lg,
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  walletPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  pointsSection: {
    flex: 1,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  pointsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginLeft: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.lightGray,
    marginVertical: theme.spacing.sm,
  },
  pointsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
  },
  addFundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginLeft: theme.spacing.md,
  },
  addFundText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: theme.spacing.xs,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  actionButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  transactionSection: {
    marginTop: theme.spacing.xl,
  },
  transactionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  transactionContent: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.darkGray,
  },
  transactionStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.darkGray,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: theme.colors.darkGray,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});

export default WalletScreen; 