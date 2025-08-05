// API Configuration and Consolidated API Management

// ==================== BASE CONFIGURATION ====================
export const API_CONFIG = {
  BASE_URL: "https://71761c8318d5.ngrok-free.app",
  TIMEOUT: 10000,
};

// ==================== INTERFACES ====================
export interface UserData {
  name: string;
  phone: string;
  walletBalance: number;
  email: string;
  userId: number;
}

export interface SignUpData {
  name: string;
  phone: string;
  email: string;
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
  status: 'running' | 'closed' | 'upcoming';
}

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
  },
  
  // Game Bids
  BIDS: {
    CREATE: '/api/bids/create',
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
          email: responseData.response.email,
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
          email: responseData.response.email,
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
        email: data.response.email,
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
      throw new Error('Failed to fetch games');
    }
    
    return data.response.map((game: any) => {
      const now = new Date();
      const openingTime = new Date(game.openingTime);
      const closingTime = new Date(game.closingTime);
      
      // Determine status based on actual time
      let status: 'running' | 'closed' | 'upcoming';
      if (now < openingTime) {
        status = 'upcoming';
      } else if (now >= openingTime && now <= closingTime) {
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
    console.error('Error fetching games:', error);
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
    return '********';
  }
  
  // If opening time passed but closing time hasn't
  if (now >= openingTime && now < closingTime) {
    if (game.openResult) {
      const openSum = game.openResult.split('').reduce((sum: number, digit: string) => sum + parseInt(digit), 0);
      const lastDigit = openSum % 10;
      return `${game.openResult}-${lastDigit}*-****`;
    }
    return '********';
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
    return '********';
  }
  
  return '********';
};

// ==================== PAYMENT API FUNCTIONS ====================
export const createOrder = async (amount: number): Promise<string> => {
  try {
    const response = await apiRequest(ENDPOINTS.PAYMENT.CREATE_ORDER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
      }),
    });

    const result = await response.json();
    return result.order_id;
  } catch (error) {
    console.error('Order creation failed:', error);
    // For development, return a mock order ID
    if (__DEV__) {
      return `order_${Date.now()}`;
    }
    throw new Error('Failed to create order');
  }
};

export const verifyPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  try {
    const response = await apiRequest(ENDPOINTS.PAYMENT.VERIFY_PAYMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        order_id: orderId,
        signature: signature,
      }),
    });

    const result = await response.json();
    return result.verified;
  } catch (error) {
    console.error('Payment verification failed:', error);
    // For development, return true to allow testing
    return __DEV__ ? true : false;
  }
};

export const updateWalletBalance = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const response = await apiRequest(ENDPOINTS.PAYMENT.UPDATE_WALLET, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
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