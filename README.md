# 🎮 BANSHI - Number Prediction Gaming App

## 📖 What is BANSHI?

**BANSHI** is a mobile gaming app where users can bet on numbers and win money. Think of it like a digital lottery or number prediction game. Users pick numbers, place bets, and if they guess correctly, they win money (usually 10x their bet amount).

### 🎯 What the App Does:
- Users can bet on different types of number games
- Manage their money (add funds, withdraw winnings)
- See game results and charts
- Get notifications about games
- Contact support via WhatsApp/Telegram

### 🎲 Types of Games:
1. **Single Digit** - Bet on one number (0-9)
2. **Jodi Digit** - Bet on two numbers together
3. **Single Panna** - Bet on three-digit combinations
4. **Double Panna** - Bet on six-digit combinations  
5. **Triple Panna** - Bet on nine-digit combinations
6. **Half Sangam** - Bet on partial combinations
7. **Full Sangam** - Bet on full combinations

---

## 🏗️ How the App is Built

### Technology Stack:
- **React Native** - For making the mobile app
- **Expo** - Makes development easier (no need for Android Studio/Xcode)
- **TypeScript** - Makes code safer and easier to understand
- **Expo Router** - Handles navigation between screens
- **Razorpay** - Handles payments

### 📱 Platforms:
- Android phones
- iPhones  
- Web browsers

---

## 📁 File Structure Explained

```
banshi/
├── app/                          # Main app folder
│   ├── (app)/                   # All the main screens users see
│   │   ├── index.tsx            # Home screen (shows games list)
│   │   ├── game-screen.tsx      # Screen to choose game type
│   │   ├── single-digit.tsx     # Bet on single numbers
│   │   ├── jodi-digit.tsx       # Bet on two numbers
│   │   ├── single-panna.tsx     # Bet on three digits
│   │   ├── double-panna.tsx     # Bet on six digits
│   │   ├── triple-panna.tsx     # Bet on nine digits
│   │   ├── half-sangam.tsx      # Bet on half combinations
│   │   ├── full-sangam.tsx      # Bet on full combinations
│   │   ├── wallet.tsx           # See balance and transactions
│   │   ├── add-fund.tsx         # Add money to wallet
│   │   ├── withdraw.tsx         # Take money out
│   │   ├── profile.tsx          # User profile settings
│   │   ├── notice.tsx           # Notifications
│   │   ├── contact-us.tsx       # Contact support
│   │   ├── game-rates.tsx       # See winning rates
│   │   └── change-password.tsx  # Change password
│   ├── auth/                    # Login/Register screens
│   │   ├── login.tsx            # Login screen
│   │   ├── signup.tsx           # Register screen
│   │   └── forgot-password.tsx  # Reset password
│   ├── components/              # Reusable parts
│   │   ├── Sidebar.tsx          # Menu that slides out
│   │   └── StartupModal.tsx     # Welcome popup
│   ├── contexts/                # Global data storage
│   │   └── UserContext.tsx      # Stores user info (balance, etc.)
│   ├── hooks/                   # Custom functions
│   │   ├── useGame.ts           # Handles game data
│   │   └── usePayment.ts        # Handles payments
│   ├── config/                  # Settings and API
│   │   ├── api.ts               # Backend connection
│   │   └── razorpay.ts          # Payment settings
│   ├── services/                # Business logic
│   ├── types/                   # TypeScript definitions
│   │   └── razorpay.d.ts        # Payment types
│   ├── utils/                   # Helper functions
│   │   └── pannaValidation.ts   # Validates number inputs
│   ├── theme.ts                 # Colors, fonts, spacing
│   └── _layout.tsx              # Main app layout
├── assets/                      # Images and fonts
│   ├── icons/                   # App icons
│   └── fonts/                   # Custom fonts
├── package.json                 # Dependencies list
├── app.json                     # App settings
└── tsconfig.json                # TypeScript settings
```

---

## 🔄 How Everything Works (Workflow)

### 1. **User Journey:**
```
User opens app → Login/Register → See games → Choose game → Place bet → Wait for result → Win/Lose → Add/Withdraw money
```

### 2. **Screen Flow:**
```
Home Screen → Game Screen → Betting Screen → Confirmation → Back to Home
```

### 3. **Data Flow:**
```
User Input → Validation → API Call → Backend → Response → Update UI → Show Result
```

---

## 🛠️ How Each Part is Implemented

### **1. Home Screen (`app/(app)/index.tsx`)**
**What it does:** Shows all available games and user's wallet balance
**How it works:**
- Fetches games from backend using `useGame` hook
- Shows games in cards with open/close times
- Displays user's wallet balance
- Has quick buttons for adding/withdrawing money

**Key features:**
- Pull to refresh games list
- Shows game status (running/closed)
- Social media contact buttons

### **2. Game Screen (`app/(app)/game-screen.tsx`)**
**What it does:** Lets user choose what type of bet to place
**How it works:**
- Shows different game types as cards
- Each card has an icon and color
- When tapped, goes to specific betting screen

### **3. Betting Screens (single-digit.tsx, etc.)**
**What it does:** Let user place their bet
**How it works:**
- User enters numbers and bet amount
- Validates input (correct format, enough balance)
- Sends bet to backend via API
- Shows success/error message

**Example for Single Digit:**
```typescript
// User enters a number (0-9) and amount
// App checks if user has enough money
// Sends to backend: { userId, gameId, number, amount }
// Backend confirms bet is placed
```

### **4. Wallet Management**
**What it does:** Handle user's money
**How it works:**
- **Add Funds:** User enters amount → Razorpay payment → Money added to wallet
- **Withdraw:** User requests withdrawal → Admin approves → Money sent to user
- **Balance:** Shows current wallet balance

### **5. User Context (`app/contexts/UserContext.tsx`)**
**What it does:** Stores user information globally
**What it stores:**
- User ID, phone number
- Wallet balance
- Login status

**Why it's important:** All screens can access user data without passing it around

### **6. API Configuration (`app/config/api.ts`)**
**What it does:** Connects app to backend server
**How it works:**
- Defines base URL for backend
- Creates functions for API calls
- Handles errors and responses

**Example API calls:**
```typescript
// Get games list
fetchGames()

// Place a bet
placeBid({ userId, gameId, number, amount })

// Get user data
getUserData(phoneNumber)
```

### **7. Theme System (`app/theme.ts`)**
**What it does:** Defines colors, fonts, spacing used throughout app
**Why it's important:** Ensures consistent look and feel

**Example:**
```typescript
colors: {
  primary: '#FF6B35',    // Orange - main color
  green: '#25D366',      // Green - success
  red: '#FF0000',        // Red - errors
  // ... more colors
}
```

---

## 🚀 How to Run the App

### **Prerequisites:**
- Node.js (version 18 or higher)
- npm or yarn
- Expo Go app on your phone (for testing)

### **Setup Steps:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the app:**
   ```bash
   npm start
   ```

3. **Run on different platforms:**
   ```bash
   # On Android
   npm run android
   
   # On iOS  
   npm run ios
   
   # On Web
   npm run web
   ```

4. **Test on phone:**
   - Install Expo Go app
   - Scan QR code from terminal
   - App will load on your phone

---

## 🔧 Development Guidelines

### **Adding New Features:**

1. **New Screen:**
   - Create file in `app/(app)/` folder
   - Add navigation in `game-screen.tsx`
   - Follow existing naming pattern

2. **New API Call:**
   - Add function in `app/config/api.ts`
   - Use in your component
   - Handle loading and error states

3. **New Component:**
   - Create in `app/components/` folder
   - Export and import where needed
   - Use theme colors and spacing

### **Code Style:**
- Use TypeScript for all files
- Follow existing naming conventions
- Use theme colors and spacing
- Add comments for complex logic
- Handle errors properly

### **Testing:**
- Test on both Android and iOS
- Check all user flows work
- Verify error handling
- Test with different screen sizes

---

## 📱 Key Features Explained

### **1. Real-time Games:**
- Games have specific open/close times
- Users can only bet when game is "running"
- Results are shown after game closes

### **2. Wallet System:**
- Users must have money to bet
- All transactions are tracked
- Secure payment processing

### **3. Validation:**
- Checks if numbers are valid format
- Ensures user has enough balance
- Prevents invalid bets

### **4. Notifications:**
- Shows game results
- Alerts for low balance
- Important announcements

---

## 🐛 Common Issues & Solutions

### **1. App won't start:**
- Check if all dependencies installed: `npm install`
- Clear cache: `npm start --clear`
- Check Node.js version

### **2. API calls failing:**
- Check internet connection
- Verify backend server is running
- Check API base URL in `config/api.ts`

### **3. Styling issues:**
- Use theme colors from `theme.ts`
- Check if using correct spacing values
- Verify component imports

### **4. Navigation problems:**
- Check file paths in router.push()
- Verify screen names match file names
- Check parameter passing

---

## 📞 Getting Help

### **For New Developers:**
1. Read this README completely
2. Look at existing code for examples
3. Check the theme file for styling
4. Use TypeScript for better code quality

### **When Stuck:**
1. Check console logs for errors
2. Look at similar existing features
3. Test on different devices
4. Ask team members for help

### **Useful Commands:**
```bash
# Start development
npm start

# Check for errors
npm run lint

# Reset project
npm run reset-project

# Install new package
npm install package-name
```

---

## 🎯 Summary

**BANSHI** is a number prediction gaming app where users bet on numbers to win money. The app is built with React Native and Expo, making it easy to develop and maintain. It has a clear structure with separate screens for different features, a global user context for data management, and a consistent theme system.

The main workflow is: User logs in → Sees games → Chooses game type → Places bet → Waits for result → Manages money. All the code is organized in a logical way, making it easy for new developers to understand and contribute to the project.

**Remember:** This is a gaming app, so always test thoroughly and ensure all betting logic works correctly! 