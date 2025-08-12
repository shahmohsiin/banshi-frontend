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
    View,TextInput
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';
import { placeBid } from '../config/api';
import SuggestiveInput from '../components/SuggestiveInput';


export default function HalfSangamScreen() {
  const { gameName, gameId } = useLocalSearchParams();
  const { userData, refreshUserData } = useUser();
  
  // State for OPEN mode
  const [openDigit, setOpenDigit] = useState('');
  const [closePanna, setClosePanna] = useState('');
  
  // State for CLOSE mode
  const [openPanna, setOpenPanna] = useState('');
  const [closeDigit, setCloseDigit] = useState('');
  
  // Common state
  const [amount, setAmount] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'OPEN' | 'CLOSE'>('OPEN');
  const [isLoading, setIsLoading] = useState(false);

  const currentBalance = userData?.walletBalance || 0;
  const hasBalance = currentBalance > 0;

  const handleBack = () => {
    router.back();
  };

 

  const handleAddBid = async () => {
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

    if (selectedStatus === 'OPEN') {
      // Validate OPEN mode fields
      if (!openDigit.trim()) {
        Alert.alert('Error', 'Please enter an open digit');
        return;
      }
      if (!closePanna.trim()) {
        Alert.alert('Error', 'Please enter a close panna');
        return;
      }

      const openDigitValue = parseInt(openDigit);
      if (isNaN(openDigitValue) || openDigitValue < 0 || openDigitValue > 9) {
        Alert.alert('Error', 'Please enter a valid open digit (0-9)');
        return;
      }

      // Format: openDigit + "-" + closePanna
      const number = `${openDigit}-${closePanna}`;
      
      await placeBidRequest(number, amountValue);

    } else {
      // Validate CLOSE mode fields
      if (!openPanna.trim()) {
        Alert.alert('Error', 'Please enter an open panna');
        return;
      }
      if (!closeDigit.trim()) {
        Alert.alert('Error', 'Please enter a close digit');
        return;
      }

     

      const closeDigitValue = parseInt(closeDigit);
      if (isNaN(closeDigitValue) || closeDigitValue < 0 || closeDigitValue > 9) {
        Alert.alert('Error', 'Please enter a valid close digit (0-9)');
        return;
      }

      // Format: openPanna + "-" + closeDigit
      const number = `${openPanna}-${closeDigit}`;
      
      await placeBidRequest(number, amountValue);
    }
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
        bidType: 'HALF_SANGAM',
        bidTiming: selectedStatus,
        number: number,
        amount: amountValue,
        
      };

      console.log('Placing bid with data:', requestBody);
      const result = await placeBid(requestBody);
      console.log('API Response:', result);

      if (result.success) {
        Alert.alert('Success', 'Bid placed successfully!');
        // Reset form
        setOpenDigit('');
        setClosePanna('');
        setOpenPanna('');
        setCloseDigit('');
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

  const handleStatusSelect = (status: 'OPEN' | 'CLOSE') => {
    setSelectedStatus(status);
    // Clear fields when switching modes
    setOpenDigit('');
    setClosePanna('');
    setOpenPanna('');
    setCloseDigit('');
    setAmount('');
  };

  const renderInputFields = () => {
    if (selectedStatus === 'OPEN') {
      return (
        <>
          <View style={styles.inputContainer}>
            <SuggestiveInput
              value={openDigit}
              onChangeText={setOpenDigit}
              placeholder="Enter Open Digit (0-9)"
              placeholderTextColor={"black"}
              keyboardType="numeric"
              maxLength={1}
              gameType="SINGLE_DIGIT"
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
        </>
      );
    } else {
      return (
        <>
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
              value={closeDigit}
              onChangeText={setCloseDigit}
              placeholder="Enter Close Digit (0-9)"
              placeholderTextColor={"black"}
              keyboardType="numeric"
              maxLength={1}
              gameType="SINGLE_DIGIT"
              style={styles.input}
            />
          </View>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Half Sangam ({gameName})</Text>
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

      {/* Date and Status Section */}
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>{useTodayString()}</Text>
        <View style={styles.statusButtons}>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              selectedStatus === 'OPEN' && styles.selectedStatusButton
            ]}
            onPress={() => handleStatusSelect('OPEN')}
          >
            <Text style={[
              styles.statusButtonText,
              selectedStatus === 'OPEN' && styles.selectedStatusButtonText
            ]}>OPEN</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.statusButton, 
              selectedStatus === 'CLOSE' && styles.selectedStatusButton
            ]}
            onPress={() => handleStatusSelect('CLOSE')}
          >
            <Text style={[
              styles.statusButtonText,
              selectedStatus === 'CLOSE' && styles.selectedStatusButtonText
            ]}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        {renderInputFields()}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            placeholderTextColor={"black"}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.inputLine} />
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
    backgroundColor: theme.colors.lightGray,
  },
  addBidText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 