# APK Troubleshooting Guide

## Issue: App installs but won't open on Android

### Most Likely Causes:

1. **Missing Environment Variables** ⚠️
   - The AAB was built from GitHub without your `.env` file
   - Firebase credentials are missing
   - Gemini API key is missing
   - **This is the most likely cause**

2. **Debug Keystore**
   - APK was signed with debug keystore (not critical)

3. **Build Configuration**
   - Missing dependencies or plugins

---

## Solution: Build APK with Environment Variables

### Option 1: Add Environment Variables to EAS (Recommended)

1. **Go to Expo Dashboard:**
   https://expo.dev/accounts/simran_dhole/projects/travel-planner/secrets

2. **Add these secrets:**
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your_value
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_value
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
   EXPO_PUBLIC_FIREBASE_APP_ID=your_value
   EXPO_PUBLIC_GEMINI_API_KEY=your_value
   ```

3. **Rebuild from GitHub:**
   - Go to builds page
   - Click "Build with GitHub"
   - Select preview profile
   - Build will include your secrets

4. **Download new AAB and convert to APK**

---

### Option 2: Push .env to Private GitHub Repo

**WARNING: Only do this if your repo is PRIVATE**

1. **Remove .env from .gitignore temporarily:**
   ```bash
   # Comment out .env in .gitignore
   git add .env
   git commit -m "Add env for build"
   git push
   ```

2. **Build from GitHub**

3. **Remove .env from GitHub after build:**
   ```bash
   git rm --cached .env
   git commit -m "Remove env"
   git push
   ```

---

### Option 3: Use Expo Development Build

Build a development version that connects to your local dev server:

```bash
npx eas build --platform android --profile development
```

This creates an APK that can connect to your local Expo server where env vars are available.

---

## Quick Check: View App Logs

To see why the app is crashing:

1. **Connect phone via USB**
2. **Enable USB Debugging** on phone
3. **Run:**
   ```bash
   adb logcat | grep -i "travel"
   ```

This will show the crash logs and error messages.

---

## Recommended Next Steps:

1. ✅ Add environment variables to EAS (Option 1)
2. ✅ Rebuild from GitHub
3. ✅ Convert new AAB to APK
4. ✅ Install and test

The app should work once it has access to Firebase credentials!
