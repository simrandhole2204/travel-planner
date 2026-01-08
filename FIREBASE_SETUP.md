# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Travel Planner app.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `travel-planner` (or your preferred name)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

## Step 2: Register Your App

### For iOS

1. In Firebase Console, click the iOS icon
2. Enter iOS bundle ID: `com.travelplanner.app`
3. Download `GoogleService-Info.plist`
4. You don't need to add this file to the project (Expo handles it differently)

### For Android

1. Click the Android icon
2. Enter Android package name: `com.travelplanner.app`
3. Download `google-services.json`
4. You don't need to add this file to the project (Expo handles it differently)

### For Web

1. Click the Web icon (</>) 
2. Register app with nickname: `Travel Planner Web`
3. Copy the Firebase configuration object

## Step 3: Get Firebase Configuration

From the web app configuration, copy these values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Add these to your `.env` file:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 4: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"

3. Enable **Google Sign-In**
   - Click on "Google"
   - Toggle "Enable"
   - Enter support email
   - Click "Save"

4. Enable **Anonymous**
   - Click on "Anonymous"
   - Toggle "Enable"
   - Click "Save"

## Step 5: Set Up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in production mode**
3. Select a location (choose closest to your users)
4. Click "Enable"

### Set Up Security Rules

Go to **Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Trips collection
    match /trips/{tripId} {
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                      request.auth.uid == request.resource.data.userId;
      
      // Itinerary subcollection
      match /itinerary/{dayId} {
        allow read, write: if request.auth != null;
      }
      
      // Expenses subcollection
      match /expenses/{expenseId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

Click **Publish**

## Step 6: Set Up Storage

1. Go to **Storage** → **Get started**
2. Start in **production mode**
3. Choose same location as Firestore
4. Click "Done"

### Set Up Storage Rules

Go to **Rules** tab and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **Publish**

## Step 7: Configure Google Sign-In

### Get OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **Credentials**

### Create OAuth 2.0 Client IDs

#### For Web

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Travel Planner Web`
4. Authorized redirect URIs: Add your Expo redirect URI
5. Click **Create**
6. Copy the **Client ID** to `.env` as `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

#### For iOS

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **iOS**
3. Name: `Travel Planner iOS`
4. Bundle ID: `com.travelplanner.app`
5. Click **Create**
6. Copy the **Client ID** to `.env` as `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

#### For Android

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **Android**
3. Name: `Travel Planner Android`
4. Package name: `com.travelplanner.app`
5. Get SHA-1 certificate fingerprint:
   ```bash
   # For development
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
   # Password: android
   ```
6. Paste the SHA-1 fingerprint
7. Click **Create**
8. Copy the **Client ID** to `.env` as `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

## Step 8: Verify Configuration

Your `.env` file should now look like:

```
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# AI API Configuration
EXPO_PUBLIC_AI_API_KEY=sk-...
EXPO_PUBLIC_AI_API_URL=https://api.openai.com/v1/chat/completions

# Google Sign-In
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123-abc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=123-ios.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=123-android.apps.googleusercontent.com
```

## Step 9: Test the Setup

1. Start your app: `npm start`
2. Try signing up with email/password
3. Check Firebase Console → Authentication to see the new user
4. Try creating a trip
5. Check Firestore to see the new document

## Monitoring Usage (FREE Tier Limits)

### Firestore

- **Reads**: 50,000/day
- **Writes**: 20,000/day
- **Deletes**: 20,000/day

Monitor at: Firebase Console → Firestore → Usage

### Authentication

- **Free tier**: Unlimited

### Storage

- **Storage**: 5 GB
- **Downloads**: 1 GB/day

Monitor at: Firebase Console → Storage → Usage

## Troubleshooting

### "Permission denied" errors

- Check Firestore security rules
- Ensure user is authenticated
- Verify userId matches in requests

### Google Sign-In not working

- Verify all OAuth client IDs are correct
- Check bundle ID / package name matches
- Ensure SHA-1 fingerprint is correct for Android

### "Firebase app not initialized"

- Check all environment variables are set
- Restart Expo dev server
- Clear cache: `npx expo start -c`

## Best Practices for FREE Tier

1. **Cache data locally** - Use AsyncStorage to minimize reads
2. **Implement pagination** - Don't load all trips at once
3. **Batch operations** - Group multiple writes together
4. **Use indexes** - Create composite indexes for complex queries
5. **Monitor usage** - Check Firebase Console regularly

---

For more information, visit [Firebase Documentation](https://firebase.google.com/docs)
