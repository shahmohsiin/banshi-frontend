import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';

export default function HalfSangamScreen() {
  const { gameName } = useLocalSearchParams();
  const { userData } = useUser();
  const [openDigit, setOpenDigit] = useState('');
  const [closePanna, setClosePanna] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'OPEN' | 'CLOSE'>('OPEN');

  const handleBack = () => {
    router.back();
  };

  const handleAddBid = () => {
    if (!openDigit.trim()) {
      Alert.alert('Error', 'Please enter an open digit');
      return;
    }
    if (!closePanna.trim()) {
      Alert.alert('Error', 'Please enter a close panna');
      return;
    }
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    if (openDigit.length !== 1) {
      Alert.alert('Error', 'Please enter exactly 1 digit for open digit');
      return;
    }
    if (closePanna.length !== 3) {
      Alert.alert('Error', 'Please enter exactly 3 digits for close panna');
      return;
    }
    if (parseInt(openDigit) < 0 || parseInt(openDigit) > 9) {
      Alert.alert('Error', 'Please enter a valid open digit (0-9)');
      return;
    }
    if (parseInt(closePanna) < 0 || parseInt(closePanna) > 999) {
      Alert.alert('Error', 'Please enter a valid close panna (000-999)');
      return;
    }
    
    Alert.alert('Success', `Half Sangam bid added: Open ${openDigit}, Close ${closePanna} for ${amount}`);
  };

  const handleStatusSelect = (status: 'OPEN' | 'CLOSE') => {
    setSelectedStatus(status);
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
        <Text style={styles.dateText}>Mon-04-August-2025</Text>
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Open Digit"
            value={openDigit}
            onChangeText={setOpenDigit}
            keyboardType="numeric"
            maxLength={1}
          />
          <View style={styles.inputLine} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Close Panna"
            value={closePanna}
            onChangeText={setClosePanna}
            keyboardType="numeric"
            maxLength={3}
          />
          <View style={styles.inputLine} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.inputLine} />
        </View>
      </View>

      {/* Add Bid Button */}
      <TouchableOpacity style={styles.addBidButton} onPress={handleAddBid}>
        <Text style={styles.addBidText}>ADD BID</Text>
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
  addBidText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 