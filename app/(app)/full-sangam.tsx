import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import useTodayString from '../hooks/date';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';
import { placeBid } from '../config/api';
import SuggestiveInput from '../components/SuggestiveInput';


export default function FullSangamScreen() {
  const { gameName, gameId } = useLocalSearchParams();
  const { userData, refreshUserData } = useUser();
  const [openPanna, setOpenPanna] = useState('');
  const [closePanna, setClosePanna] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentBalance = userData?.walletBalance || 0;
  const hasBalance = currentBalance > 0;

  const handleBack = () => {
    router.back();
  };



  const handleAddBid = async () => {
    // Validate open panna
    if (!openPanna.trim()) {
      Alert.alert('Error', 'Please enter an open panna');
      return;
    }


    // Validate close panna
    if (!closePanna.trim()) {
      Alert.alert('Error', 'Please enter a close panna');
      return;
    }

    

    // Validate amount
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const amountValue = parseInt(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Check balance
    if (amountValue > currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    // Format: openPanna + "-" + closePanna
    const number = `${openPanna}-${closePanna}`;
    
    await placeBidRequest(number, amountValue);
  };

  const placeBidRequest = async (number: string, amountValue: number) => {
    if (!userData?.userId) {
      Alert.alert('Error', 'User data not found');
      return;
    }

    setIsLoading(true);
    try {
      const requestBody = {
        userId: userData.userId,
        gameId: parseInt(gameId as string) || 1,
        bidType: 'FULL_SANGAM',
        bidTiming:null,
        number: number,
        amount: amountValue
      };

      console.log('Placing bid with data:', requestBody);
      const result = await placeBid(requestBody);
      console.log('API Response:', result);

      if (result.success) {
        Alert.alert('Success', 'Bid placed successfully!');
        // Reset form
        setOpenPanna('');
        setClosePanna('');
        setAmount('');
        // Refresh user data to update balance
        if (userData?.phone) {
          await refreshUserData(userData.phone);
        }
      } else {
        console.log('API Error:', result);
        Alert.alert('Error', result.message || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Bid placement error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Full Sangam ({gameName})</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Balance Section */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceContent}>
          <Ionicons name="diamond" size={24} color="#4FC3F7" />
          <Text style={styles.balanceAmount}>{userData?.walletBalance || 0}</Text>
        </View>
        <View style={styles.balanceDivider} />
        <Text style={styles.balanceLabel}>Balance</Text>
      </View>

      {/* Date Section */}
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>{useTodayString()}</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <SuggestiveInput
            value={openPanna}
            onChangeText={setOpenPanna}
            placeholder="Enter Open Panna"
            placeholderTextColor={"black"}
            keyboardType="numeric"
            maxLength={3}
            gameType="SINGLE_PANNA"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <SuggestiveInput
            value={closePanna}
            onChangeText={setClosePanna}
            placeholder="Enter Close Panna"
            placeholderTextColor={"black"}
            keyboardType="numeric"
            maxLength={3}
            gameType="SINGLE_PANNA"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <SuggestiveInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter Amount"
            placeholderTextColor={"black"}
            keyboardType="numeric"
            gameType="AMOUNT"
            style={styles.input}
          />
        </View>
      </View>

      {/* Add Bid Button */}
      <TouchableOpacity 
        style={[styles.addBidButton, !hasBalance && styles.disabledButton]} 
        onPress={handleAddBid}
        disabled={isLoading || !hasBalance}
      >
        <Text style={styles.addBidText}>
          {isLoading ? 'PLACING BID...' : 'ADD BID'}
        </Text>
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
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
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
    backgroundColor: theme.colors.lightGray,
  },
  addBidText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 