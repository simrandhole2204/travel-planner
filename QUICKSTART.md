# Quick Start Guide

## Prerequisites Checklist

Before running the app, make sure you have:

- [x] Node.js installed (v16+)
- [x] npm packages installed
- [ ] Firebase project created
- [ ] `.env` file configured
- [ ] iOS Simulator or Android Emulator installed

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google, Anonymous)
4. Create Firestore database
5. Enable Storage
6. Copy your Firebase config

**Detailed instructions**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

## Step 2: Environment Configuration

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Optional: AI API for itinerary generation
   EXPO_PUBLIC_AI_API_KEY=your_openai_key
   
   # Optional: Google Sign-In
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
   EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id
   ```

## Step 3: Run the App

### Start the development server:

```bash
npm start
```

### Run on iOS Simulator (Mac only):

```bash
npm run ios
```

Or press `i` in the terminal after `npm start`

### Run on Android Emulator:

```bash
npm run android
```

Or press `a` in the terminal after `npm start`

### Run on Physical Device:

1. Install **Expo Go** app from App Store or Play Store
2. Scan the QR code shown in terminal

## Step 4: Test the App

1. **Sign Up**: Create a new account with email/password
2. **Create Trip**: Tap the + button and fill in trip details
3. **View Trip**: Tap on a trip card to see the dashboard
4. **Logout**: Go to Profile tab and logout

## Troubleshooting

### "Firebase not initialized" error
- Check that `.env` file exists and has correct values
- Restart the dev server: `npx expo start -c`

### "Module not found" errors
- Clear cache and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  npx expo start -c
  ```

### Google Sign-In not working
- Make sure OAuth client IDs are configured
- Check that bundle ID matches in Firebase and app.json

### App won't start
- Check Node.js version: `node --version` (should be v16+)
- Check Expo CLI: `npx expo --version`
- Clear watchman cache (Mac): `watchman watch-del-all`

## What's Working Now

✅ **Authentication**
- Email/password signup and login
- Google Sign-In (requires OAuth setup)
- Guest/anonymous mode

✅ **Trip Management**
- Create new trips
- View trip list
- Trip dashboard
- Delete trips
- Pull to refresh
- Pagination

✅ **UI/UX**
- Beautiful, modern design
- Smooth animations
- Loading states
- Error handling

## What's Coming Next

The following features have placeholder screens ready for implementation:

🔨 **Itinerary** - AI-generated day-by-day plans
🔨 **Budget Tracker** - Expense management
🔨 **Map View** - Interactive maps with locations
🔨 **Explore** - Discover nearby places

## Development Tips

### Hot Reload
- Save any file to see changes instantly
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu

### Debugging
- Use React Native Debugger
- Check console logs in terminal
- Use `console.log()` for debugging

### Code Organization
- Components in `src/components/`
- Services in `src/services/`
- Screens in `app/`
- Utilities in `src/utils/`

## Next Steps

1. Set up Firebase (see FIREBASE_SETUP.md)
2. Configure .env file
3. Run the app
4. Create your first trip!
5. Implement remaining features (itinerary, budget, maps)

## Need Help?

- Check [README.md](./README.md) for full documentation
- See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for Firebase setup
- Review [walkthrough.md](../.gemini/antigravity/brain/*/walkthrough.md) for implementation details

---

Happy coding! 🚀
