import { useState } from 'react';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { initiatePayment, PaymentResponse } from '../config/razorpay';
import { createOrder, verifyPayment, updateWalletBalance } from '../config/api';

export const usePayment = (testMode: boolean = false) => {
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
      
      // 1. Create order via backend
      const orderResult = await createOrder(userData.userId, amount);
      
      // Fix: Extract orderId from orderResult.response.orderId
      const orderId = orderResult.response?.orderId;
      if (!orderId) {
        throw new Error('Order creation failed - no order ID received');
      }

      // 2. Initiate payment with Razorpay using backend order_id
      const paymentOptions = {
        key: 'rzp_test_WdmJCh0RexsqsG',
        amount: amount * 100,
        currency: 'INR',
        name: "Banshi",
        description: 'Add funds to your wallet',
        order_id: orderId,
        prefill: {
          email: userData.email || '',
          contact: userData.phone || '',
          name: userData.name || '',
        },
        theme: { color: '#3399cc' },
      };
      
      const paymentData = await (window as any).RazorpayCheckout
        ? (window as any).RazorpayCheckout.open(paymentOptions)
        : await import('react-native-razorpay').then((mod) => mod.default.open(paymentOptions));

      // 3. Verify payment via backend
      const isVerified = await verifyPayment(
        userData.userId,
        orderId,
        paymentData.razorpay_payment_id,
        paymentData.razorpay_signature,
        amount
      );

      if (isVerified) {
        // 4. Update wallet via backend
        await updateWalletBalance(userData.userId.toString(), amount);
        if (userData?.phone) await refreshUserData(userData.phone);
        Alert.alert('Success', `Payment successful! ₹${amount} added to your wallet.`, [{ text: 'OK' }]);
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

  return {
    processPayment,
    isLoading,
    error,
  };
}; 