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
import { theme } from '../theme';

export default function GameBidScreen() {
  const { gameType, gameName } = useLocalSearchParams();
  const [digit, setDigit] = useState('');
  const [amount, setAmount] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleAddBid = () => {
    if (!digit.trim()) {
      Alert.alert('Error', 'Please enter a digit');
      return;
    }
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }
    
    Alert.alert('Success', `Bid added: ${digit} for ${amount}`);
  };

  const getGameTypePlaceholder = () => {
    switch (gameType) {
      case 'Single Digit':
        return 'Enter Single Digit';
      case 'Jodi Digit':
        return 'Enter Jodi Digit';
      case 'Single Panna':
        return 'Enter Single Panna';
      case 'Double Panna':
        return 'Enter Double Panna';
      case 'Triple Panna':
        return 'Enter Triple Panna';
      case 'Half Sangam':
        return 'Enter Half Sangam';
      case 'Full Sangam':
        return 'Enter Full Sangam';
      default:
        return 'Enter Digit';
    }
  };

  const getGameTitle = () => {
    return `${gameType} (${gameName})`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getGameTitle()}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Balance Section */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceContent}>
          <Ionicons name="diamond" size={24} color="#4FC3F7" />
          <Text style={styles.balanceAmount}>5</Text>
        </View>
        <View style={styles.balanceDivider} />
        <Text style={styles.balanceLabel}>Balance</Text>
      </View>

      {/* Date and Status Section */}
      <View style={styles.dateCard}>
        <Text style={styles.dateText}>Mon-04-August-2025</Text>
        <View style={styles.statusButtons}>
          <View style={styles.openButton}>
            <Text style={styles.openButtonText}>OPEN</Text>
          </View>
          <View style={styles.closeButton}>
            <Text style={styles.closeButtonText}>CLOSE</Text>
          </View>
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={getGameTypePlaceholder()}
            value={digit}
            onChangeText={setDigit}
            keyboardType="numeric"
            maxLength={gameType === 'Jodi Digit' ? 2 : 1}
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
  openButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  openButtonText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.black,
  },
  closeButtonText: {
    color: theme.colors.black,
    fontSize: 12,
    fontWeight: 'bold',
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