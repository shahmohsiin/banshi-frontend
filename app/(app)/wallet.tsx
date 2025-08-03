import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
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
  const [currentPoints] = React.useState(5);

  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Welcome Bonus',
      amount: 5,
      status: 'SUCCESSFUL',
      date: '2025-08-01 16:16:38',
    },
  ];

  const getStatusColor = (status: Transaction['status']) => {
    if (status === 'SUCCESSFUL') return theme.colors.success;
    if (status === 'PENDING') return theme.colors.secondary;
    return theme.colors.error;
  };

  const goToAddFunds = () => router.push('/(app)/add-fund');
  const goToWithdraw = () => router.push('/(app)/withdraw');
  const goToPaymentMethods = () => {
    // TODO: Navigate to payment method screen when implemented
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <View style={styles.balanceIcon}>
                <Ionicons name="diamond" size={32} color="#4FC3F7" />
                <Text style={styles.balanceAmount}>{currentPoints}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.balanceLabel}>Wallet Points</Text>
          </View>
          <TouchableOpacity style={styles.addFundButton} onPress={goToAddFunds}>
            <Ionicons name="add" size={20} color={theme.colors.white} />
            <Text style={styles.addFundText}>Add Fund</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={goToWithdraw}>
            <View style={styles.actionIcon}>
              <Ionicons name="arrow-down" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={goToPaymentMethods}>
            <View style={styles.actionIcon}>
              <Ionicons name="card" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>Payment Methods</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <View style={styles.historyList}>
            {transactions.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Ionicons name="receipt-outline" size={48} color={theme.colors.darkGray} />
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
              </View>
            ) : (
              transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={styles.transactionIcon}>
                      <Ionicons 
                        name={transaction.status === 'SUCCESSFUL' ? 'checkmark-circle' : 'time'} 
                        size={20} 
                        color={getStatusColor(transaction.status)} 
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{transaction.title}</Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      +{transaction.amount}
                    </Text>
                    <Text style={[
                      styles.transactionStatus,
                      { color: getStatusColor(transaction.status) }
                    ]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
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
  balanceSection: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceCard: {
    flex: 1,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  balanceIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginLeft: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.lightGray,
    marginVertical: theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.colors.black,
  },
  addFundButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.md,
  },
  addFundText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: theme.spacing.xs,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.black,
    fontWeight: '500',
  },
  historySection: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
  },
  historyList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.darkGray,
    marginTop: theme.spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  transactionDate: {
    fontSize: 12,
    color: theme.colors.darkGray,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 