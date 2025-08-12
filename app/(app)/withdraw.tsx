import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { requestWithdrawal } from '../config/api';
import { useUser } from '../contexts/UserContext';
import { theme } from '../theme';

const WithdrawScreen: React.FC = () => {
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData, refreshUserData } = useUser();
  const currentBalance = userData?.walletBalance || 0;

  const handleSubmit = () => {
    const parsedAmount = parseInt(amount, 10);
    const upiRegex = /^[a-zA-Z0-9._\-]{2,}@[a-zA-Z]{2,}$/;

    if (!upiId || !upiRegex.test(upiId)) {
      Alert.alert('Error', 'Please enter a valid UPI ID');
      return;
    }

    if (!parsedAmount || parsedAmount <= 0 && parsedAmount<=300) {
      Alert.alert('Error', 'Please enter a valid amount to withdraw ');
      return;
    }

    if (parsedAmount > currentBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert('Confirm Withdrawal', `Withdraw ₹${parsedAmount} to UPI ${upiId}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Proceed',
        onPress: async () => {
          if (!userData?.userId) {
            Alert.alert('Error', 'User not found. Please login again.');
            return;
          }
          try {
            setIsSubmitting(true);
            const result = await requestWithdrawal(userData.userId, parsedAmount, upiId);
            if (result.success) {
              if (userData.phone) {
                try { await refreshUserData(userData.phone); } catch {}
              }
              Alert.alert('Success', ` Your Withdrawal request for ₹${amount} is  submitted `, [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } else {
              Alert.alert('Failed', result.message || 'Withdrawal request failed.');
            }
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'Something went wrong.');
          } finally {
            setIsSubmitting(false);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw Points</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Withdrawal Timings */}
        <View style={styles.timingsContainer}>
          <Text style={styles.timingsText}>Withdraw Open Time: 12:00 AM</Text>
          <Text style={styles.timingsText}>Withdraw Close Time: 07:00 AM</Text>
        </View>

        {/* Current Balance Display */}
        <View style={styles.balanceContainer}>
          <View style={styles.balanceIcon}>
            <Ionicons name="wallet" size={32} color={theme.colors.primary} />
          </View>
          <View style={styles.balanceTextContainer}>
            <Text style={styles.balanceNumber}>{currentBalance}</Text>
            <Text style={styles.balanceLabel}>Current Balance</Text>
          </View>
        </View>

        {/* Withdraw Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Withdraw Notice</Text>
          <Text style={styles.noticeText}>
            कृपया विथड्रॉ लगाने के बाद सुबह 11 बजे से पहले कॉल या मैसेज न करें। आपका पैसा सुबह 11 बजे तक आपके अकाउंट में आ जाएगा। कोई भी कस्टमर जो सुबह 11 बजे से पहले विथड्रॉ के लिए कॉल या मैसेज करेगा, उसका विथड्रॉ रिजेक्ट कर दिया जाएगा और ID ब्लॉक कर दी जाएगी।
          </Text>
        </View>

        {/* UPI ID Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="at"
              size={20}
              color={theme.colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID (e.g., username@bank)"
              placeholderTextColor={theme.colors.darkGray}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="arrow-down-circle"
              size={20}
              color={theme.colors.primary}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Amount"
              placeholderTextColor={theme.colors.darkGray}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>SUBMIT</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
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
  timingsContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  timingsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.black,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  balanceIcon: {
    marginRight: theme.spacing.md,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.colors.black,
  },
  noticeContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: theme.colors.black,
    lineHeight: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: theme.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: theme.spacing.sm,
  },
  paymentMethodsContainer: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  selectedPaymentMethod: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  radioContainer: {
    marginRight: theme.spacing.md,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: theme.colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  paymentMethodContent: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  paymentMethodPlaceholder: {
    fontSize: 14,
    color: theme.colors.darkGray,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
});

export default WithdrawScreen; 