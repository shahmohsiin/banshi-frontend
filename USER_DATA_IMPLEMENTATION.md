# User Data Implementation

## Overview
This implementation adds user data management to the Banshi app using Context API. When a user logs in, their phone number is used to fetch user details from the API endpoint `/api/user/phone/{phone number}`.

## Features Implemented

### 1. User Context API
- **File**: `app/contexts/UserContext.tsx`
- Manages user data (name, phone, wallet balance, email)
- Provides functions to set, update, clear, and refresh user data
- Available throughout the app via `useUser()` hook

### 2. User API Service
- **File**: `app/services/userApi.ts`
- Handles API calls to fetch user data by phone number
- Endpoint: `/api/user/phone/{phone number}`
- Returns: name, phone, wallet balance, email

### 3. Login Integration
- **File**: `app/auth/login.tsx`
- After successful login, automatically fetches user data
- Stores user data in context for use throughout the app
- Handles errors gracefully with user-friendly alerts

### 4. UI Components Updated
- **Sidebar**: Shows user name and phone from context
- **Wallet**: Displays wallet balance from context
- **Home Screen**: Shows wallet balance in header
- **Withdraw Screen**: Uses current balance from context
- **Add Fund Screen**: Shows current points from context
- **Profile Screen**: Displays user details from context

### 5. Logout Functionality
- Clears user data from context on logout
- Updated in both Sidebar and Profile components

## API Endpoint
```
GET /api/user/phone/{phone number}
```

### Example:
```
GET /api/user/phone/8299665360
```

### Response Format:
```json
{
  "name": "User Name",
  "phone": "8299665360",
  "walletBalance": 100,
  "email": "user@example.com"
}
```

## Usage

### In Components:
```typescript
import { useUser } from '../contexts/UserContext';

const MyComponent = () => {
  const { userData, updateUserData, refreshUserData } = useUser();
  
  // Access user data
  const userName = userData?.name;
  const walletBalance = userData?.walletBalance;
  
  // Refresh user data
  await refreshUserData(userData?.phone);
};
```

### Error Handling:
- Network errors are handled gracefully
- User is notified if user data fetch fails
- App continues to work with fallback values

## Data Flow
1. User enters phone and password
2. Login API call is made
3. On successful login, user data is fetched using phone number
4. User data is stored in Context API
5. All components automatically update with user data
6. On logout, user data is cleared from context

## Benefits
- Centralized user data management
- Real-time updates across all components
- Consistent user experience
- Easy to maintain and extend
- Proper error handling and user feedback 