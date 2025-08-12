// API Configuration and Consolidated API Management

// ==================== BASE CONFIGURATION ====================
export const API_CONFIG = {
  BASE_URL: "",
  TIMEOUT: 10000,
};

// ==================== INTERFACES ====================
export interface UserData {
  name: string;
  phone: string;
  walletBalance: number;
  
  userId: number;
}

export interface SignUpData {
  name: string;
  phone: string;
  
  password: string;
}

export interface SignInData {
  phone: string;
  password: string;
}

export interface GameItem {
  id: number;
  name: string;
  currentNumbers: string;
  openTime: string;
  closeTime: string;
  openDate: Date;
  closeDate: Date;
  status: 'running' | 'closed';
}

export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
   
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

// ==================== ENDPOINTS ====================
export const ENDPOINTS = {
  // User Management
  USER: {
    SIGNUP: '/api/user/signUp',
    SIGNIN: '/api/user/signIn',
    GET_BY_PHONE: (phone: string) => `/api/user/phone/${phone}`,
    UPDATE: (userId: number) => `/api/user/${userId}/update`,
    FORGOT_PASSWORD: '/api/user/forgot-password',
    RESET_PASSWORD: '/api/user/reset-password',
  },
  
  // Games
  GAMES: {
    ALL: '/api/games/all',
    BY_ID: (id: number) => `/api/games/${id}`,
  },
  
  // Payments & Wallet
  PAYMENT: {
    CREATE_ORDER: '/api/payment/create-order',
    VERIFY_PAYMENT: '/api/payment/verify',
    UPDATE_WALLET: '/api/payment/update-wallet',
    WITHDRAW: '/api/payment/withdraw',
    FUND_HISTORY: (userId: number) => `/api/fund-history/user/${userId}`,
  },
  
  // Withdrawals
  WITHDRAWALS: {
    WITHDRAW: '/api/withdrawals/withdraw',
  },
  
  // Game Bids
  BIDS: {
    HISTORY: (userId: number) => `/api/bids/history/user/${userId}`,
    CREATE: '/api/bids/create',
    PLACE: '/api/bids/place',
    GET_USER_BIDS: (userId: number) => `/api/bids/user/${userId}`,
    GET_GAME_BIDS: (gameId: number) => `/api/bids/game/${gameId}`,
  },
};

// ==================== HELPER FUNCTIONS ====================
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};

// ==================== USER API FUNCTIONS ====================
export const signUp = async (data: SignUpData): Promise<{ success: boolean; message: string; userData?: UserData }> => {
  try {
    console.log('Attempting signup with data:', { ...data, password: '[HIDDEN]' });
    const response = await apiRequest(ENDPOINTS.USER.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Signup API response:', responseData);

    if (response.ok && responseData.status === 'SUCCESS') {
      if (responseData.response) {
        const userData: UserData = {
          name: responseData.response.name,
          phone: responseData.response.phone,
          walletBalance: responseData.response.balance || 0,
        
          userId: responseData.response.userId
        };
        console.log('Signup successful, user data:', userData);
        return { success: true, message: responseData.message || 'Account created successfully!', userData };
      } else {
        console.log('Signup successful but no user data returned');
        return { success: true, message: responseData.message || 'Account created successfully!' };
      }
    } else {
      console.error('Signup failed:', responseData);
      return { 
        success: false, 
        message: responseData.message || `Signup failed: ${response.status}` 
      };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: 'Network error. Please check your connection and try again.' 
    };
  }
};

export const signIn = async (data: SignInData): Promise<{ success: boolean; message: string; userData?: UserData }> => {
  try {
    console.log('Attempting signin with phone:', data.phone);
    const response = await apiRequest(ENDPOINTS.USER.SIGNIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('Signin API response:', responseData);

    if (response.ok && responseData.status === 'SUCCESS') {
      if (responseData.response) {
        const userData: UserData = {
          name: responseData.response.name,
          phone: responseData.response.phone,
          walletBalance: responseData.response.balance || 0,
        
          userId: responseData.response.userId
        };
        console.log('Signin successful, user data:', userData);
        return { success: true, message: responseData.message || 'Login successful!', userData };
      } else {
        console.log('Signin successful but no user data returned');
        return { success: true, message: responseData.message || 'Login successful!' };
      }
    } else {
      console.error('Signin failed:', responseData);
      return { 
        success: false, 
        message: responseData.message || `Login failed: ${response.status}` 
      };
    }
  } catch (error) {
    console.error('Signin error:', error);
    return { 
      success: false, 
      message: 'Network error. Please check your connection and try again.' 
    };
  }
};

export const getUserByPhone = async (phone: string): Promise<UserData> => {
  try {
    console.log('Fetching user data for phone:', phone);
    const response = await apiRequest(ENDPOINTS.USER.GET_BY_PHONE(phone), {
      method: 'GET',
    });

    const data = await response.json();
    console.log('Get user by phone API response:', data);

    if (response.ok && data.status === 'SUCCESS' && data.response) {
      const userData: UserData = {
        name: data.response.name,
        phone: data.response.phone,
        walletBalance: data.response.balance || 0,

        userId: data.response.userId
      };
      console.log('User data fetched successfully:', userData.name);
      return userData;
    } else {
      throw new Error(data.message || 'User not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserName = async (userId: number, name: string): Promise<void> => {
  try {
    console.log('Updating user name:', { userId, name });
    const response = await apiRequest(ENDPOINTS.USER.UPDATE(userId), {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });

    console.log('Update API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Update API error response:', errorText);
      throw new Error(`Failed to update user name: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Update API response data:', data);
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
};

export const refreshUserData = async (phone: string): Promise<UserData> => {
  return getUserByPhone(phone);
};

// ==================== GAMES API FUNCTIONS ====================
export const fetchGamesFromApi = async (): Promise<GameItem[]> => {
  try {
    const response = await apiRequest(ENDPOINTS.GAMES.ALL);
    const data = await response.json();
    
    if (data.status !== 'SUCCESS') {
     
    }
    
    return data.response.map((game: any) => {
      const now = new Date();
      const openingTime = new Date(game.openingTime);
      const closingTime = new Date(game.closingTime);
      
      // Debug logging for all games to see gameIds
      console.log(`Game Debug - ${game.name}:`, {
        gameName: game.name,
        gameId: game.gameId,
        openingTime: game.openingTime,
        closingTime: game.closingTime,
        parsedOpeningTime: openingTime.toISOString(),
        parsedClosingTime: closingTime.toISOString(),
        now: now.toISOString(),
        isOpeningValid: !isNaN(openingTime.getTime()),
        isClosingValid: !isNaN(closingTime.getTime()),
        isNowBeforeOpening: now < openingTime,
        isNowAfterClosing: now > closingTime,
        isNowBetween: now >= openingTime && now <= closingTime
      });
      
      // Determine status based on actual time - only running or closed
      let status: 'running' | 'closed';
      if (now <= closingTime) {
        status = 'running';
      } else {
        status = 'closed';
      }
      
      // Calculate game numbers
      const currentNumbers = getGameNumbers(game, now, openingTime, closingTime);
      
      return {
        id: game.gameId,
        name: game.name,
        currentNumbers,
        openTime: formatTime(openingTime),
        closeTime: formatTime(closingTime),
        openDate: openingTime,
        closeDate: closingTime,
        status,
      };
    });
  } catch (error) {
    
    throw error;
  }
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const getGameNumbers = (game: any, now: Date, openingTime: Date, closingTime: Date): string => {
  // If opening time hasn't passed, show *****
  if (now < openingTime) {
    return '***-**-***';
  }
  
  // If opening time passed but closing time hasn't
  if (now >= openingTime && now < closingTime) {
    if (game.openResult) {
      const openSum = game.openResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const lastDigit = openSum % 10;
      return `${game.openResult}-${lastDigit}*-***`;
    }
    return '***-**-***';
  }
  
  // If closing time has passed
  if (now >= closingTime) {
    if (game.openResult && game.closeResult) {
      const openSum = game.openResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const closeSum = game.closeResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const openLastDigit = openSum % 10;
      const closeLastDigit = closeSum % 10;
      return `${game.openResult}-${openLastDigit}${closeLastDigit}-${game.closeResult}`;
    }
    return '***-**-***';
  }
  
  return '***-**-***';
};

// ==================== PAYMENT API FUNCTIONS ====================
export const createOrder = async (userId: number, amount: number): Promise<any> => {
  try {
    console.log('Creating order for userId:', userId, 'amount:', amount);
    const endpoint = `/api/payments/create-order`;
    const response = await apiRequest(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        amount: amount,
      }),
    });

    console.log('Order creation response status:', response.status);
    
    if (!response.ok) {
      console.error('Order creation failed with status:', response.status);
      const errorText = await response.text();
      console.error('Order creation error response:', errorText);
      throw new Error(`Order creation failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Order creation result:', result);
    return result; // Should include order_id, amount, etc.
  } catch (error) {
    console.error('Order creation failed:', error);
    throw new Error('Failed to create order');
  }
};

export const verifyPayment = async (
  userId: number,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  amount: number
): Promise<boolean> => {
  try {
    console.log("Verifying payment with data:", {
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      amount
    });
    
    const response = await apiRequest('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount
      }),
    });
    
    console.log('Payment verification response status:', response.status);
    
    if (!response.ok) {
      console.error('Payment verification failed with status:', response.status);
      const errorText = await response.text();
      console.error('Payment verification error response:', errorText);
      return false;
    }
    
    const result = await response.json();
    console.log('Payment verification result:', result);
    
    const isVerified = result.response
    console.log('Payment verification final result:', isVerified);
    
    return Boolean(isVerified);
  } catch (error) {
    console.error('Payment verification failed with exception:', error);
    return false;
  }
};

export const updateWalletBalance = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const response = await apiRequest('/api/payments/update-wallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        amount: amount,
      }),
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Wallet update failed:', error);
    return false;
  }
};

export const withdrawFunds = async (userId: string, amount: number, bankDetails: any): Promise<boolean> => {
  try {
    const response = await apiRequest(ENDPOINTS.PAYMENT.WITHDRAW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        amount: amount,
        bank_details: bankDetails,
      }),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Withdrawal failed:', error);
    return false;
  }
};

// New withdrawal API for UPI-based withdrawals
export const requestWithdrawal = async (
  userId: number,
  amount: number,
  upiId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiRequest(ENDPOINTS.WITHDRAWALS.WITHDRAW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        amount,
        upiId,
      }),
    });

    const data = await response.json();
    const success = data.status === 'success' || data.success === true;
    const message = data.message || (success ? ` Your Withdrawal request for ${amount} is  submitted `: 'Failed to request withdrawal');
    return { success, message };
  } catch (error) {
    console.error('Request withdrawal failed:', error);
    return { success: false, message: 'Network error. Please try again.' };
  }
};

// ==================== BIDS API FUNCTIONS ====================
export const createBid = async (bidData: any): Promise<boolean> => {
  try {
    const response = await apiRequest(ENDPOINTS.BIDS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bidData),
    });

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Bid creation failed:', error);
    return false;
  }
};

export const placeBid = async (bidData: any): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Placing bid with data:', bidData);
    const response = await apiRequest(ENDPOINTS.BIDS.PLACE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bidData),
    });

    const result = await response.json();
    console.log('Bid placement API response:', result);
    
    return {
      success: response.ok && result.status === 'SUCCESS',
      message: result.message || 'Bid placed successfully'
    };
  } catch (error) {
    console.error('Bid placement failed:', error);
    return { 
      success: false, 
      message: 'Network error. Please try again.' 
    };
  }
};

export const getUserBids = async (userId: number): Promise<any[]> => {
  try {
    const response = await apiRequest(ENDPOINTS.BIDS.GET_USER_BIDS(userId), {
      method: 'GET',
    });

    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching user bids:', error);
    return [];
  }
};

export const getGameBids = async (gameId: number): Promise<any[]> => {
  try {
    const response = await apiRequest(ENDPOINTS.BIDS.GET_GAME_BIDS(gameId), {
      method: 'GET',
    });

    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error('Error fetching game bids:', error);
    return [];
  }
}; 

// ==================== HISTORY API FUNCTIONS ====================

export interface TransactionHistory {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: string
  transactionTime:string
}

export interface GameBidHistory {
  id: number;
  bidType: string;
  bidNumber: string;
  bidTiming: string;
  resultStatus: 'active' | 'won' | 'lost' | 'cancelled';
  amount: number;
  placedAt: string;
  gameName:string
}

export const getTransactionHistory = async (userId: number): Promise<TransactionHistory[]> => {
  try {
    console.log('Fetching transaction history for userId:', userId);
    const response = await apiRequest(ENDPOINTS.PAYMENT.FUND_HISTORY(userId));

    
    if (response.ok) {
      const data = await response.json();
      console.log('Transaction history API response:', data);
      // Transform the API response to match our interface
      const transactions = data.response?.map((item: any) => ({
        id: item.historyId,
        type: item.transactionType === 'RECHARGE' ? 'credit' : 'debit',
        amount: item.amount,
        description: item.transactionType ,

        status: "SUCCESS",
        transactionTime:item.transactionTime
      })) || [];
      
      console.log('Transformed transactions:', transactions);
      return transactions;
    } else {
      console.error('Failed to fetch transaction history:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
};




export const getGameBidHistory = async (userId: number): Promise<GameBidHistory[]> => {
  try {
    console.log('Fetching game bid history for userId:', userId);
    const response = await apiRequest(ENDPOINTS.BIDS.HISTORY(userId));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Game bid history API response:', data);
      // Transform the API response to match our interface
      const bids = data.response?.map((item: any) => ({
        id: item.bidId,
        bidType: item.bidType,
        bidNumber: item.bidNumber || item.number || item.bidValue || 'N/A',
        bidTiming: item.bidTiming || item.timing || 'N/A',
        resultStatus: item.resultStatus?.toLowerCase() || 'active',
        amount: item.amount,
        placedAt:item.placedAt,
        gameName:item.gameName
      })) || [];
      console.log('Transformed bids:', bids);
      return bids;
    } else {
      console.error('Failed to fetch game bid history:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Error fetching game bid history:', error);
    return [];
  }
}; 