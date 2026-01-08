# Building APK for Travel Planner App

## 📱 **Build Options**

### **Option 1: EAS Build (Recommended - Easiest)**
Build in the cloud using Expo's build service.

### **Option 2: Local Build**
Build on your own machine (requires Android Studio).

---

## 🚀 **Option 1: EAS Build (Cloud Build)**

### **Step 1: Install EAS CLI**
```bash
npm install -g eas-cli
```

### **Step 2: Login to Expo**
```bash
eas login
```
- Create a free Expo account if you don't have one
- Enter your credentials

### **Step 3: Configure EAS**
```bash
cd "/Users/gauravpawar/Desktop/travel planner "
eas build:configure
```
- Select "Android" when prompted
- This creates `eas.json` configuration

### **Step 4: Build APK**

**For Development Build (Testing):**
```bash
eas build --platform android --profile preview
```

**For Production Build (Release):**
```bash
eas build --platform android --profile production
```

### **Step 5: Download APK**
- Build will take 10-20 minutes
- You'll get a link to download the APK
- Or check: https://expo.dev/accounts/[your-account]/projects/travel-planner/builds

### **Step 6: Install on Phone**
- Download APK to your phone
- Enable "Install from Unknown Sources" in Settings
- Tap the APK file to install

---

## 🏗️ **Option 2: Local Build**

### **Prerequisites:**
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK)

### **Step 1: Install Expo Prebuild**
```bash
npx expo prebuild --platform android
```

### **Step 2: Build APK**
```bash
cd android
./gradlew assembleRelease
```

### **Step 3: Find APK**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## ⚙️ **EAS Configuration (eas.json)**

Your `eas.json` should look like this:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

---

## 📋 **Pre-Build Checklist**

### **1. Update app.json**
Make sure these are set:
```json
{
  "expo": {
    "name": "Travel Planner",
    "slug": "travel-planner",
    "version": "1.0.0",
    "android": {
      "package": "com.yourname.travelplanner",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### **2. Environment Variables**
EAS Build needs environment variables. Create `.env.production`:

```bash
# Copy your .env file
cp .env .env.production
```

Then configure in EAS:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_FIREBASE_API_KEY --value "your_key"
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value "your_key"
```

Or add to `eas.json`:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_FIREBASE_API_KEY": "your_key_here"
      }
    }
  }
}
```

### **3. Assets**
Make sure you have:
- `assets/icon.png` (1024x1024)
- `assets/splash.png` (1284x2778)
- `assets/adaptive-icon.png` (1024x1024)

---

## 🎯 **Quick Start (Recommended)**

**For first-time build:**

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure
eas build:configure

# 4. Build APK
eas build --platform android --profile preview

# 5. Wait for build to complete (10-20 min)
# 6. Download and install APK on your phone
```

---

## 🔧 **Troubleshooting**

### **Build Fails - Missing Dependencies**
```bash
npm install
```

### **Build Fails - Environment Variables**
Add secrets to EAS:
```bash
eas secret:list
eas secret:create --scope project --name VAR_NAME --value "value"
```

### **APK Too Large**
Enable Hermes in `app.json`:
```json
{
  "expo": {
    "android": {
      "enableHermes": true
    }
  }
}
```

### **Can't Install APK**
- Enable "Install Unknown Apps" in Android Settings
- Check if you have enough storage
- Try uninstalling old version first

---

## 📊 **Build Types**

| Type | Command | Use Case | Size |
|------|---------|----------|------|
| **Development** | `eas build --profile development` | Testing with Expo Go | ~30MB |
| **Preview (APK)** | `eas build --profile preview` | Internal testing | ~50MB |
| **Production (AAB)** | `eas build --profile production` | Google Play Store | ~30MB |

---

## 🎉 **After Building**

### **Test Your APK:**
1. Install on multiple Android devices
2. Test all features:
   - Login/Signup
   - Create trips
   - Generate itinerary with Gemini
   - Add expenses
   - Explore places
3. Check Firebase connection
4. Test offline behavior

### **Distribute:**
- **Internal Testing:** Share APK file directly
- **Beta Testing:** Use Firebase App Distribution
- **Production:** Upload to Google Play Store

---

## 📱 **Google Play Store (Optional)**

To publish on Play Store:

1. **Create Developer Account** ($25 one-time fee)
2. **Build AAB** (not APK):
   ```bash
   eas build --platform android --profile production
   ```
3. **Upload to Play Console**
4. **Fill out store listing**
5. **Submit for review**

---

## 🚀 **Ready to Build?**

Run this command to start:
```bash
eas build --platform android --profile preview
```

The build will happen in the cloud, and you'll get a download link when it's done!

**Need help?** Check the logs or ask me! 🎯
