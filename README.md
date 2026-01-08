# Travel Planner App

A modern, AI-assisted Travel Planner mobile app built with Expo React Native and Firebase. Plan your trips end-to-end in one place with AI-generated itineraries, budget tracking, and more.

## 🌟 Features

- **Authentication**: Email/password, Google sign-in, and guest access
- **Trip Management**: Create, edit, and delete trips with ease
- **AI Itinerary Generation**: Get personalized day-by-day itineraries
- **Budget Planning**: Track expenses and manage your travel budget
- **Explore**: Discover nearby attractions and experiences
- **Maps Integration**: View destinations and routes on interactive maps
- **Offline Support**: Access your trips even without internet
- **Local Notifications**: Get reminders for your itinerary

## 🚀 Tech Stack

- **Frontend**: Expo React Native, Expo Router
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: OpenAI API for itinerary generation
- **Maps**: React Native Maps

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase account
- OpenAI API key (for AI features)

## 🛠️ Installation

1. **Clone or navigate to the project directory**

```bash
cd "travel planner"
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase and AI API credentials. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase setup instructions.

4. **Start the development server**

```bash
npm start
```

5. **Run on your device**

- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 📱 Project Structure

```
travel-planner/
├── app/                      # Expo Router pages
│   ├── (auth)/              # Authentication screens
│   ├── (tabs)/              # Main tab navigation
│   ├── trip/                # Trip-related screens
│   ├── _layout.js           # Root layout
│   └── index.js             # Entry point
├── src/
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components (Button, Input, Card, etc.)
│   │   └── trip/           # Trip-specific components
│   ├── config/             # Configuration files
│   │   └── firebase.js     # Firebase initialization
│   ├── constants/          # App constants
│   │   └── theme.js        # Theme colors, spacing, etc.
│   ├── services/           # API and service layer
│   │   ├── authService.js  # Authentication
│   │   ├── tripService.js  # Trip management
│   │   ├── aiService.js    # AI itinerary generation
│   │   └── itineraryService.js
│   ├── store/              # Zustand state management
│   │   ├── authStore.js
│   │   └── tripStore.js
│   └── utils/              # Utility functions
│       ├── errorHandler.js
│       ├── dateHelpers.js
│       └── cache.js
├── assets/                  # Images, fonts, etc.
├── .env.example            # Environment variables template
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── README.md               # This file
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password, Google)
3. Create a Firestore database
4. Enable Storage
5. Copy your Firebase config to `.env`

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### Google Sign-In

1. Configure OAuth consent screen in Google Cloud Console
2. Create OAuth 2.0 credentials for iOS, Android, and Web
3. Add client IDs to `.env`

### AI API

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add the key to `.env` as `EXPO_PUBLIC_AI_API_KEY`

## 📊 Firestore Data Structure

```
users/{uid}
  - uid
  - email
  - displayName
  - createdAt

trips/{tripId}
  - userId
  - title
  - destination
  - startDate
  - endDate
  - budget
  - travelType
  - createdAt
  - updatedAt

trips/{tripId}/itinerary/{dayId}
  - day
  - date
  - activities[]

trips/{tripId}/expenses/{expenseId}
  - category
  - amount
  - description
  - date
```

## 🎨 Customization

### Theme

Edit `src/constants/theme.js` to customize colors, spacing, and typography.

### Tailwind Config

Modify `tailwind.config.js` for NativeWind customization.

## 🚢 Deployment

### Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Submit to App Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## 📝 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web (limited support)

## 🔒 Firebase FREE Tier Constraints

This app is optimized for Firebase Spark (FREE) plan:

- ✅ No Cloud Functions
- ✅ No Firebase Extensions
- ✅ No Scheduled Jobs
- ✅ Client-side AI generation
- ✅ Optimized Firestore queries
- ✅ Local caching to minimize reads
- ✅ Pagination for large lists

## 🐛 Troubleshooting

### Common Issues

1. **Firebase initialization error**
   - Check that all environment variables are set correctly
   - Ensure Firebase project is properly configured

2. **Google Sign-In not working**
   - Verify OAuth client IDs are correct
   - Check that redirect URIs are configured

3. **AI generation fails**
   - Verify OpenAI API key is valid
   - Check API quota and billing

4. **App won't build**
   - Clear cache: `npx expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Expo and Firebase
