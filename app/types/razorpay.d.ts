declare module 'react-native-razorpay' {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
      email?: string;
      contact?: string;
      name?: string;
    };
    theme?: {
      color?: string;
    };
    notes?: {
      [key: string]: string;
    };
    handler?: (response: any) => void;
    modal?: {
      ondismiss?: () => void;
    };
  }

  interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayError {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: any;
  }

  const RazorpayCheckout: {
    open: (options: RazorpayOptions) => Promise<RazorpayResponse>;
  };

  export default RazorpayCheckout;
} 