// API Configuration


export const API_CONFIG = {
 
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL, 
  
  // API Endpoints
  ENDPOINTS: {
    SIGNUP: '/api/user/signUp',
    SIGNIN: '/api/user/signin',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    GAMES: '/api/games/all',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to make API requests
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