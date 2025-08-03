# 🎮 BANSHI - Gaming Platform Frontend

[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A modern, cross-platform gaming application built with React Native and Expo, featuring popular number-based games like StarLine and Gali Disawar.

## 🎯 About BANSHI

BANSHI is a comprehensive gaming platform that offers users the opportunity to participate in various number-based prediction games. The app provides a seamless experience for managing funds, playing games, and withdrawing winnings.

### 🎲 Games Available

- **StarLine**: A popular number prediction game
- **Gali Disawar**: Traditional number-based gaming
- **Multiple Game Types**:
  - Single Digit (10x ratio)
  - Jodi Digit (10x ratio)
  - Single Panna (10x ratio)
  - Double Panna (10x ratio)
  - Triple Panna (10x ratio)
  - Half Sangam (10x ratio)
  - Full Sangam (10x ratio)

### ✨ Key Features

- 🎮 **Multiple Games**: Play various number prediction games
- 💰 **Wallet Management**: Add funds and withdraw winnings
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🔔 **Real-time Notifications**: Stay updated with game results
- 💬 **Social Integration**: Connect via WhatsApp and Telegram
- 🎨 **Modern UI**: Beautiful, intuitive interface
- 🔒 **Secure**: Safe fund management and transactions

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/banshi-frontend.git
   cd banshi-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on different platforms**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

### Development Workflow

1. **Start Expo Development Server**
   ```bash
   expo start
   ```

2. **Scan QR Code**: Use the Expo Go app to scan the QR code displayed in your terminal

3. **Make Changes**: Edit files in the `app/` directory

4. **Hot Reload**: Changes will automatically reflect on your device

## 📱 App Structure

```
banshi-frontend/
├── app/
│   ├── (app)/                 # Main app screens
│   │   ├── index.tsx          # Home screen
│   │   ├── add-fund.tsx       # Add funds screen
│   │   ├── withdraw.tsx       # Withdraw screen
│   │   ├── wallet.tsx         # Wallet management
│   │   ├── game-rates.tsx     # Game rates and rules
│   │   ├── profile.tsx        # User profile
│   │   ├── notice.tsx         # Notifications
│   │   └── contact-us.tsx     # Contact information
│   ├── auth/                  # Authentication screens
│   │   ├── login.tsx          # Login screen
│   │   ├── signup.tsx         # Registration screen
│   │   └── forgot-password.tsx # Password recovery
│   ├── components/            # Reusable components
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── StartupModal.tsx   # Welcome modal
│   ├── theme.ts              # Design system
│   └── _layout.tsx           # Root layout
├── assets/                   # Images, fonts, etc.
├── package.json             # Dependencies and scripts
└── app.json                # Expo configuration
```

## 🎨 Design System

The app uses a consistent design system defined in `app/theme.ts`:

- **Primary Color**: `#FF6B35` (Vibrant Orange)
- **Secondary Color**: `#FF4500` (Darker Orange)
- **Supporting Colors**: Green, Blue, Gray variants
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing system
- **Border Radius**: Unified corner radius values

## 🛠️ Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint for code quality
- `npm run reset-project` - Reset project configuration

## 📦 Dependencies

### Core Dependencies
- **Expo**: Cross-platform development framework
- **React Native**: Mobile app development
- **Expo Router**: File-based routing
- **React Navigation**: Navigation between screens
- **Expo Vector Icons**: Icon library

### Development Dependencies
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Babel**: JavaScript compiler

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Device/OS information

### 💡 Suggesting Features

1. Open an issue with the "enhancement" label
2. Describe the feature and its benefits
3. Include mockups or examples if possible

### 🔧 Submitting Code Changes

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types where needed
   - Update documentation if necessary

4. **Test your changes**
   ```bash
   npm run lint
   npm start
   ```

5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Reference related issues

### 📋 Code Style Guidelines

- Use TypeScript for type safety
- Follow React Native best practices
- Use functional components with hooks
- Maintain consistent naming conventions
- Add comments for complex logic
- Keep components small and focused

### 🧪 Testing

- Test on multiple devices/platforms
- Verify all user flows work correctly
- Check for responsive design issues
- Ensure accessibility standards are met

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@banshi.com
- **WhatsApp**: [Contact via WhatsApp]
- **Telegram**: [Join our Telegram group]
- **Issues**: [GitHub Issues](https://github.com/yourusername/banshi-frontend/issues)

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) community
- All contributors and beta testers

---

**Note**: This is a gaming application. Please ensure you comply with local gambling laws and regulations in your jurisdiction. The app is intended for entertainment purposes only.

Made with ❤️ by the BANSHI Team 