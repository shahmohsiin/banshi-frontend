import RazorpayCheckout from 'react-native-razorpay';

// ==================== RAZORPAY CONFIGURATION ====================
export const RAZORPAY_CONFIG = {
  APP: {
    name: 'Banshi',
    description: 'Add funds to your wallet',
    currency: 'INR',
    theme: {
      color: '#3399cc',
    },
  },
  API: {
    CREATE_ORDER: 'https://71761c8318d5.ngrok-free.app/api/payment/create-order',
    VERIFY_PAYMENT: 'https://71761c8318d5.ngrok-free.app/api/payment/verify',
    UPDATE_WALLET: 'https://71761c8318d5.ngrok-free.app/api/payment/update-wallet',
  },
};

// ==================== RAZORPAY INTERFACES ====================
export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    email: string;
    contact: string;
    name: string;
  };
  theme: {
    color: string;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentError {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: any;
}

// ==================== RAZORPAY FUNCTIONS ====================
export const getRazorpayKey = (): string => {
  // Replace with your actual Razorpay key
  return 'rzp_test_YOUR_KEY_HERE';
};

export const initiatePayment = async (
  amount: number,
  userEmail: string,
  userPhone: string,
  userName: string
): Promise<PaymentResponse> => {
  try {
    const options: PaymentOptions = {
      key: getRazorpayKey(),
      amount: amount * 100, // Razorpay expects amount in paise
      currency: RAZORPAY_CONFIG.APP.currency,
      name: RAZORPAY_CONFIG.APP.name,
      description: RAZORPAY_CONFIG.APP.description,
      order_id: `order_${Date.now()}`, // You should generate this from your backend
      prefill: {
        email: userEmail,
        contact: userPhone,
        name: userName,
      },
      theme: RAZORPAY_CONFIG.APP.theme,
    };

    const paymentData = await RazorpayCheckout.open(options);
    return paymentData as PaymentResponse;
  } catch (error: any) {
    if (error.code === 'PAYMENT_CANCELLED') {
      throw new Error('Payment was cancelled by user');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error occurred. Please try again.');
    } else {
      throw new Error(error.description || 'Payment failed. Please try again.');
    }
  }
}; 