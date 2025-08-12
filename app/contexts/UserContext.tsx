import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUserByPhone } from '../config/api';

interface UserData {
  name: string;
  phone: string;
  walletBalance: number;
  userId: number;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
  refreshUserData: (phone: string) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      }
    } catch (error) {
      // Silent error handling for production
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserData = useCallback(async (data: UserData | null) => {
    try {
      if (data) {
        await AsyncStorage.setItem('userData', JSON.stringify(data));
      } else {
        await AsyncStorage.removeItem('userData');
      }
    } catch (error) {
      // Silent error handling for production
    }
  }, []);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => {
      const newData = prev ? { ...prev, ...data } : null;
      if (newData) {
        saveUserData(newData);
      }
      return newData;
    });
  }, [saveUserData]);

  const clearUserData = useCallback(async () => {
    setUserData(null);
    await saveUserData(null);
  }, [saveUserData]);

  const setUserDataWithStorage = useCallback(async (data: UserData | null) => {
    setUserData(data);
    await saveUserData(data);
  }, [saveUserData]);

  const refreshUserData = useCallback(async (phone: string) => {
    try {
      // Import here to avoid circular dependency
      const data = await getUserByPhone(phone);
      setUserDataWithStorage(data);
    } catch (error) {
      throw error;
    }
  }, [setUserDataWithStorage]);

  const value = useMemo(() => ({
    userData,
    setUserData: setUserDataWithStorage,
    updateUserData,
    clearUserData,
    refreshUserData,
    isLoading,
  }), [userData, setUserDataWithStorage, updateUserData, clearUserData, refreshUserData, isLoading]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 