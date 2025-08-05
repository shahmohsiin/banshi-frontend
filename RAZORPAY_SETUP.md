# Razorpay Integration Setup Guide

## Overview
This guide will help you set up Razorpay payment integration in your BANSHI React Native app.

## Prerequisites
1. Razorpay account (https://razorpay.com)
2. React Native development environment
3. Expo development environment

## Step 1: Install Dependencies
```bash
npm install react-native-razorpay
```

## Step 2: Configure Razorpay Keys

### 2.1 Get Your Razorpay Keys
1. Log in to your Razorpay Dashboard
2. Go to Settings > API Keys
3. Generate API keys for both test and live environments

### 2.2 Update Configuration
Edit `app/config/razorpay.ts`:

```typescript
export const RAZORPAY_CONFIG = {
  TEST: {
    key: 'rzp_test_YOUR_ACTUAL_TEST_KEY',
    secret: 'YOUR_ACTUAL_TEST_SECRET',
  },
  PRODUCTION: {
    key: 'rzp_live_YOUR_ACTUAL_LIVE_KEY',
    secret: 'YOUR_ACTUAL_LIVE_SECRET',
  },
  // ... rest of config
};
```

## Step 3: Backend Integration (Required for Production)

### 3.1 Create Order API
Your backend should have an endpoint to create Razorpay orders:

```javascript
// Example Node.js/Express endpoint
app.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  
  const options = {
    amount: amount, // amount in paise
    currency: currency,
    receipt: `order_${Date.now()}`,
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json({ order_id: order.id });
  } catch (error) {
    res.status(500).json({ error: 'Order creation failed' });
  }
});
```

### 3.2 Verify Payment API
Your backend should verify payments using Razorpay's signature:

```javascript
app.post('/verify-payment', async (req, res) => {
  const { payment_id, order_id, signature } = req.body;
  
  const text = order_id + '|' + payment_id;
  const signature = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(text)
    .digest('hex');
  
  if (signature === req.body.signature) {
    // Payment is verified
    // Update user's wallet balance
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});
```

### 3.3 Update Wallet API
Your backend should update the user's wallet balance:

```javascript
app.post('/update-wallet', async (req, res) => {
  const { user_id, amount } = req.body;
  
  try {
    // Update user's wallet balance in your database
    await updateUserWallet(user_id, amount);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
```

## Step 4: Update API Endpoints

Edit `app/config/razorpay.ts` and update the API endpoints:

```typescript
API: {
  CREATE_ORDER: 'https://your-backend.com/api/create-order',
  VERIFY_PAYMENT: 'https://your-backend.com/api/verify-payment',
  UPDATE_WALLET: 'https://your-backend.com/api/update-wallet',
},
```

## Step 5: Testing

### 5.1 Test Mode
- Use test keys for development
- Test payments will not charge real money
- Use Razorpay's test card numbers

### 5.2 Test Card Numbers
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Step 6: Production Deployment

### 6.1 Switch to Live Keys
1. Update `RAZORPAY_CONFIG.PRODUCTION` with your live keys
2. Ensure your backend is using live Razorpay keys
3. Test thoroughly in production environment

### 6.2 Security Considerations
- Never expose your Razorpay secret key in frontend code
- Always verify payments on your backend
- Use HTTPS for all API calls
- Implement proper error handling

## Step 7: Features Implemented

### ✅ Payment Integration
- Razorpay checkout integration
- Payment verification
- Wallet balance updates
- Error handling

### ✅ UI Features
- Loading states during payment
- Error messages
- Success confirmations
- Disabled states during processing

### ✅ Configuration
- Environment-based key selection
- Centralized configuration
- Easy key management

## Step 8: Usage

### 8.1 In Add Fund Screen
The payment integration is already implemented in the Add Fund screen:

1. User enters amount
2. Clicks "SUBMIT"
3. Confirms payment
4. Razorpay checkout opens
5. User completes payment
6. Wallet balance updates automatically

### 8.2 Custom Implementation
To use payment in other screens:

```typescript
import { usePayment } from '../hooks/usePayment';

const { processPayment, isLoading, error } = usePayment();

const handlePayment = async (amount: number) => {
  try {
    await processPayment(amount);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Troubleshooting

### Common Issues

1. **Payment Cancelled**: User cancelled the payment
2. **Network Error**: Check internet connection
3. **Invalid Key**: Verify your Razorpay keys
4. **Backend Error**: Check your backend API endpoints

### Debug Mode
In development, payment verification returns `true` to allow testing. In production, ensure proper verification.

## Support

- Razorpay Documentation: https://razorpay.com/docs/
- React Native SDK: https://razorpay.com/docs/payments/payment-gateway/react-native-integration/standard/
- For app-specific issues, check the console logs and network requests

## Security Notes

⚠️ **Important**: 
- Never commit your actual Razorpay keys to version control
- Use environment variables for sensitive data
- Always verify payments on your backend
- Implement proper error handling and logging 