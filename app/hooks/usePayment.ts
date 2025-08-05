import { useState } from 'react';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { initiatePayment, PaymentResponse } from '../config/razorpay';
import { verifyPayment, updateWalletBalance } from '../config/api';

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userData, refreshUserData } = useUser();

  const processPayment = async (amount: number) => {
    if (!userData) {
      Alert.alert('Error', 'Please login to make payments');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Initiate payment with Razorpay
      const paymentResponse: PaymentResponse = await initiatePayment(
        amount,
        userData.email || '',
        userData.phone || '',
        userData.name || ''
      );

      // Verify payment (this should be done on your backend)
      const isVerified = await verifyPayment(
        paymentResponse.razorpay_payment_id,
        paymentResponse.razorpay_order_id,
        paymentResponse.razorpay_signature
      );

      if (isVerified) {
        // Update user wallet balance
        await updateWalletBalance(userData.userId.toString(), amount);
        Alert.alert(
          'Success',
          `Payment successful! ₹${amount} added to your wallet.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Payment verification failed. Please contact support.');
      }
    } catch (error: any) {
      setError(error.message);
      Alert.alert('Payment Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateWalletBalance = async (amount: number) => {
    try {
      // This should be an API call to your backend
      // For now, we'll just refresh user data
      if (userData?.phone) {
        await refreshUserData(userData.phone);
      }
    } catch (error) {
      console.error('Failed to update wallet balance:', error);
    }
  };

  return {
    processPayment,
    isLoading,
    error,
  };
}; 