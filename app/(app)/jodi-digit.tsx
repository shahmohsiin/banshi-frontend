import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';

export default function JodiDigitScreen() {
  const { gameName, gameId } = useLocalSearchParams();
  const { userData } = useUser();
  const [digit, setDigit] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentBalance = userData?.walletBalance || 0;
  const hasBalance = currentBalance > 0;

  // Debug logging
  console.log('JodiDigitScreen - userData:', userData);
  console.log('JodiDigitScreen - gameId:', gameId);

  const handleBack = () => {
    router.back();
  };

  const handleAddBid = async () => {
    if (!hasBalance) {
      Alert.alert('Error', 'Insufficient balance. Please add funds to your wallet.');
      return;
    }
    
    if (!userData?.userId) {
      Alert.alert('Error', 'User ID not found. Please login again.');
      return;
    }
    
    if (!digit.trim()) {
      Alert.alert('Error', 'Please enter a jodi digit');
      return;
    }
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    if (digit.length !== 2) {
      Alert.alert('Error', 'Please enter exactly 2 digits for jodi digit');
      return;
    }
    if (parseInt(digit) < 0 || parseInt(digit) > 99) {
      Alert.alert('Error', 'Please enter a valid jodi digit (00-99)');
      return;
    }
    
    const bidAmount = parseInt(amount);
    
    if (bidAmount > currentBalance) {
      Alert.alert('Error', 'Insufficient wallet balance');
      return;
    }

    setIsLoading(true);

    const requestBody = {
      userId: userData.userId,
      gameId: parseInt(gameId as string) || 1,
      bidType: 'JODI_DIGIT',
      bidTiming: 'OPEN', // No OPEN/CLOSE selection for Jodi
      number: digit,
      amount: bidAmount,
    };

    console.log('Sending bid request:', requestBody);

    try {
      const response = await fetch('https://71761c8318d5.ngrok-free.app/api/bids/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if ( result.success) {
        Alert.alert('Success', 'Bid placed successfully!');
        // Reset form
        setDigit('');
        setAmount('');
      } else {
        console.log('API Error:', result);
        Alert.alert( result.message || 'Failed to place bid');
        setDigit('');
        setAmount('');
      }
    } catch (error) {
      console.error('Bid placement error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (text: string) => {
    if (!hasBalance) return;
    // Only allow two digits 0-9
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 2) {
      setDigit(numericValue);
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
        <Text style={styles.headerTitle}>Jodi Digit ({gameName})</Text>
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

      {/* Date Section (No OPEN/CLOSE buttons) */}
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>Mon-04-August-2025</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, !hasBalance && styles.disabledInput]}
            placeholder={hasBalance ? "Enter Jodi Digit (00-99)" : "Add funds to place bid"}
            value={digit}
            onChangeText={handleDigitChange}
            keyboardType="numeric"
            maxLength={2}
            editable={!isLoading && hasBalance}
          />
          <View style={styles.inputLine} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, !hasBalance && styles.disabledInput]}
            placeholder={hasBalance ? "Enter Amount" : "Add funds to place bid"}
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
          (isLoading || !hasBalance) && styles.disabledButton
        ]} 
        onPress={handleAddBid}
        disabled={isLoading || !hasBalance}
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
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  warningText: {
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: '#856404',
  },
  disabledInput: {
    color: theme.colors.lightGray,
    backgroundColor: theme.colors.lightGray,
  },
}); 