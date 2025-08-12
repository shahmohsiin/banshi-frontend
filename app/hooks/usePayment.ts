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
      console.log('Order creation result:', orderResult);
      
      // Fix: Extract orderId from orderResult.response.orderId
      const orderId = orderResult.response?.orderId;
      if (!orderId) {
        console.error('Order creation failed - no orderId returned:', orderResult);
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
      
      console.log('Initiating Razorpay payment with options:', paymentOptions);
      const paymentData = await (window as any).RazorpayCheckout
        ? (window as any).RazorpayCheckout.open(paymentOptions)
        : await import('react-native-razorpay').then((mod) => mod.default.open(paymentOptions));

      console.log('Payment data received:', paymentData);

      // 3. Verify payment via backend
      console.log('Verifying payment with backend...');
      const isVerified = await verifyPayment(
        userData.userId,
        orderId,
        paymentData.razorpay_payment_id,
        paymentData.razorpay_signature,
        amount
      );

      console.log('Payment verification result:', isVerified);

      if (isVerified) {
        // 4. Update wallet via backend
        console.log('Updating wallet balance...');
        await updateWalletBalance(userData.userId.toString(), amount);
        if (userData?.phone) await refreshUserData(userData.phone);
        Alert.alert('Success', `Payment successful! ₹${amount} added to your wallet.`, [{ text: 'OK' }]);
      } else {
        console.error('Payment verification failed - isVerified returned false');
        Alert.alert('Error', 'Payment verification failed. Please contact support.');
        console.log(userData.userId,orderId,paymentData.razorpay_payment_id,paymentData.razorpay_signature,amount)
      }
    } catch (error: any) {
      console.error('Payment process error:', error);
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