import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import useTodayString from '../hooks/date';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';
import { placeBid } from '../config/api';
import SuggestiveInput from '../components/SuggestiveInput';

export default function SinglePannaScreen() {
  const { gameName, gameId } = useLocalSearchParams();
  const { userData, refreshUserData } = useUser();
  const [panna, setPanna] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'OPEN' | 'CLOSE'>('OPEN');
  const [isLoading, setIsLoading] = useState(false);

  const currentBalance = userData?.walletBalance || 0;
  const hasBalance = currentBalance > 0;

  const handleBack = () => {
    router.back();
  };

  const handleAddBid = async () => {
    if (!hasBalance) {
      Alert.alert('Error', 'Insufficient balance. Please add funds to your wallet.');
      return;
    }
    
    if (!panna.trim()) {
      Alert.alert('Error', 'Please enter a single panna');
      return;
    }
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    if (panna.length !== 3) {
      Alert.alert('Error', 'Please enter exactly 3 digits for single panna');
      return;
    }
    
    // Validate panna using the valid array
 
    const bidAmount = parseInt(amount);
    
    if (bidAmount > currentBalance) {
      Alert.alert('Error', 'Insufficient wallet balance');
      return;
    }

    if (bidAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const result = await placeBid({
        userId: userData?.userId,
        gameId: parseInt(gameId as string) || 1,
        bidType: 'SINGLE_PANNA',
        bidTiming: selectedStatus,
        number: panna,
        amount: bidAmount,
      });
      if (result.success) {
        Alert.alert('Success', 'Bid placed successfully!');
        
        // Refresh wallet balance after successful bid
        if (userData?.phone) {
          try {
            await refreshUserData(userData.phone);
          } catch (error) {
            // Silent error handling for production
          }
        }
        
        // Reset form
        setPanna('');
        setAmount('');
      } else {
        Alert.alert('Error', result.message || 'Failed to place bid');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusSelect = (status: 'OPEN' | 'CLOSE') => {
    if (!hasBalance) return;
    setSelectedStatus(status);
  };

  const handlePannaChange = (text: string) => {
    if (!hasBalance) return;
    // Only allow three digits 0-9
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 3) {
      setPanna(numericValue);
    }
  };

  const handleAmountChange = (text: string) => {
    if (!hasBalance) return;
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setAmount(numericValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Single Panna ({gameName})</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Balance Section */}
      <View style={[styles.balanceCard, !hasBalance && styles.insufficientBalanceCard]}>
        <View style={styles.balanceContent}>
          <Ionicons name="diamond" size={24} color={hasBalance ? "#4FC3F7" : "#FF6B6B"} />
          <Text style={[styles.balanceAmount, !hasBalance && styles.insufficientBalanceText]}>{currentBalance}</Text>
        </View>
        <View style={styles.balanceDivider} />
        <Text style={[styles.balanceLabel, !hasBalance && styles.insufficientBalanceText]}>
          {hasBalance ? 'Balance' : 'Insufficient Balance'}
        </Text>
      </View>

      {/* Warning for 0 balance */}
      {!hasBalance && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={20} color="#FF6B6B" />
          <Text style={styles.warningText}>Please add funds to your wallet to place bids</Text>
        </View>
      )}

      {/* Date and Status Section */}
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>{useTodayString()}</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              selectedStatus === 'OPEN' && styles.selectedStatusButton,
              !hasBalance && styles.disabledStatusButton
            ]}
            onPress={() => handleStatusSelect('OPEN')}
            disabled={isLoading || !hasBalance}
          >
            <Text style={[
              styles.statusButtonText,
              selectedStatus === 'OPEN' && styles.selectedStatusButtonText,
              !hasBalance && styles.disabledStatusButtonText
            ]}>OPEN</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              selectedStatus === 'CLOSE' && styles.selectedStatusButton,
              !hasBalance && styles.disabledStatusButton
            ]}
            onPress={() => handleStatusSelect('CLOSE')}
            disabled={isLoading || !hasBalance}
          >
            <Text style={[
              styles.statusButtonText,
              selectedStatus === 'CLOSE' && styles.selectedStatusButtonText,
              !hasBalance && styles.disabledStatusButtonText
            ]}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <SuggestiveInput
            value={panna}
            onChangeText={handlePannaChange}
            placeholder={hasBalance ? "Enter Single Panna (000-999)" : "Add funds to place bid"}
            placeholderTextColor={"black"}
            keyboardType="numeric"
            maxLength={3}
            editable={!isLoading && hasBalance}
            gameType="SINGLE_PANNA"
            style={[styles.input, !hasBalance && styles.disabledInput]}
          />
        </View>

        <View style={styles.inputContainer}>
        <TextInput
            style={[styles.input, !hasBalance && styles.disabledInput]}
            placeholder={hasBalance ? "Enter Amount" : "Add funds to place bid"}
            placeholderTextColor={"black"}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            editable={!isLoading && hasBalance}
          />
          <View style={styles.inputLine} />
        </View>
      </View>

      {/* Add Bid Button */}
      <TouchableOpacity 
        style={[
          styles.addBidButton, 
          (isLoading || !hasBalance || (panna.length !== 3 )) && styles.disabledButton
        ]} 
        onPress={handleAddBid}
        disabled={isLoading || !hasBalance || (panna.length !== 3)}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.colors.white} />
            <Text style={styles.addBidText}>Processing...</Text>
          </View>
        ) : (
          <Text style={styles.addBidText}>
            {hasBalance ? 'ADD BID' : 'INSUFFICIENT BALANCE'}
          </Text>
        )}
      </TouchableOpacity>
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 50,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headerSpacer: {
    width: 48,
  },
  balanceCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
  },
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginLeft: theme.spacing.sm,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: theme.colors.lightGray,
    marginVertical: theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: 14,
    color: theme.colors.darkGray,
    textAlign: 'center',
  },
  dateCard: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  statusButton: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.black,
  },
  selectedStatusButton: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  statusButtonText: {
    color: theme.colors.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedStatusButtonText: {
    color: theme.colors.white,
  },
  inputSection: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  inputLine: {
    height: 1,
    backgroundColor: theme.colors.lightGray,
    marginTop: theme.spacing.xs,
  },
  addBidButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.darkGray,
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBidText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  insufficientBalanceCard: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
  },
  insufficientBalanceText: {
    color: "#FF6B6B",
  },
  warningContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: "#FFF3CD",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#FFEEBA",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
    marginLeft: theme.spacing.sm,
  },
  disabledInput: {
    color: theme.colors.gray,
    opacity: 0.7,
  },
  disabledStatusButton: {
    backgroundColor: theme.colors.lightGray,
    borderColor: theme.colors.gray,
    opacity: 0.7,
  },
  disabledStatusButtonText: {
    color: theme.colors.gray,
  },
  errorText: {
    color: theme.colors.red,
    fontSize: 12,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
}); 