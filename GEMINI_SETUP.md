# Google Gemini AI Setup Guide

## Overview

The Travel Planner app uses **Google Gemini AI** to generate intelligent, personalized trip itineraries. Gemini is Google's most capable AI model, offering:

- ✅ **Free tier**: 60 requests per minute
- ✅ **Better quality**: More accurate and contextual responses
- ✅ **Cost-effective**: Free for most use cases
- ✅ **Fast**: Quick response times

---

## Step 1: Get Your Gemini API Key

### Option A: Google AI Studio (Recommended)

1. **Visit Google AI Studio**:
   - Go to https://makersuite.google.com/app/apikey
   - Or https://aistudio.google.com/app/apikey

2. **Sign in** with your Google account

3. **Create API Key**:
   - Click "**Get API Key**" or "**Create API Key**"
   - Click "**Create API key in new project**" (or select existing project)
   - Copy the generated API key

4. **Save your key** - You'll need it for the next step

### Option B: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the "Generative Language API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key

---

## Step 2: Add API Key to Your App

1. **Open your `.env` file** in the project root

2. **Add your Gemini API key**:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```

3. **Save the file**

4. **Restart the Expo server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npx expo start --clear
   ```

---

## Step 3: Test the Integration

1. **Open your app** on your device/simulator

2. **Create a trip** or open an existing one

3. **Go to Itinerary** tab

4. **Tap "Generate with AI"**

5. **Wait 5-10 seconds** for Gemini to generate your itinerary

6. **Success!** You should see a detailed day-by-day plan

---

## How It Works

### Itinerary Generation Flow

```
User taps "Generate" 
    ↓
App sends trip details to Gemini
    ↓
Gemini analyzes:
  - Destination
  - Trip duration
  - Travel type (solo/couple/family)
  - Budget (if provided)
    ↓
Gemini generates:
  - Day-by-day activities
  - Specific times and locations
  - Mix of sightseeing, food, activities
  - Local experiences
    ↓
App displays itinerary
```

### What Gemini Considers

- **Popular attractions** in the destination
- **Local experiences** and hidden gems
- **Realistic timing** for activities
- **Travel type** preferences
- **Budget constraints**
- **Seasonal considerations**

---

## Features

### AI-Generated Itinerary Includes:

✅ **Day-by-day breakdown**
- Morning, afternoon, evening activities
- Specific times (e.g., "09:00 AM")

✅ **Activity details**
- Title and description
- Specific locations
- Activity type (sightseeing, food, activity, rest)

✅ **Smart recommendations**
- Popular attractions
- Local restaurants
- Cultural experiences
- Rest periods

✅ **Customizable**
- Edit any activity
- Add new activities
- Delete unwanted items
- Reorder activities

---

## Fallback Behavior

If Gemini AI is unavailable or the API key is missing, the app automatically generates a **basic itinerary** with:
- Generic morning/afternoon/evening activities
- Placeholder descriptions
- Still fully editable

This ensures the app always works, even without AI!

---

## API Limits (Free Tier)

**Google Gemini Free Tier:**
- **60 requests per minute**
- **1,500 requests per day**
- **1 million tokens per month**

For a travel app:
- Each itinerary generation = 1 request
- Typical response = ~500-1000 tokens
- **You can generate 1,500 itineraries per day for FREE!**

---

## Troubleshooting

### "Failed to generate itinerary"

**Check:**
1. API key is correct in `.env` file
2. No extra spaces or quotes around the key
3. Expo server was restarted after adding key
4. Internet connection is working

**Solution:**
```bash
# Verify .env file
cat .env | grep GEMINI

# Restart with cache clear
npx expo start --clear
```

### "API key not found"

**Check:**
1. `.env` file exists in project root
2. Variable name is exactly: `EXPO_PUBLIC_GEMINI_API_KEY`
3. File is saved

### Itinerary is generic/basic

This means the fallback is being used. Check:
1. Gemini API key is set
2. API key is valid (test at https://aistudio.google.com/)
3. Check console logs for errors

---

## Best Practices

### 1. **Secure Your API Key**
- Never commit `.env` to git
- Don't share your API key publicly
- Regenerate if exposed

### 2. **Monitor Usage**
- Check usage at https://aistudio.google.com/
- Set up billing alerts if needed
- Free tier is usually sufficient

### 3. **Optimize Requests**
- Cache generated itineraries
- Don't regenerate unnecessarily
- Edit existing itineraries instead

---

## Example Generated Itinerary

**Trip**: 3 days in Paris, Couple, $2000 budget

**Day 1:**
- 09:00 AM - Breakfast at Café de Flore
- 10:30 AM - Visit Eiffel Tower
- 01:00 PM - Lunch at Le Jules Verne
- 03:00 PM - Seine River Cruise
- 07:00 PM - Dinner in Le Marais

**Day 2:**
- 09:00 AM - Louvre Museum
- 12:30 PM - Lunch at L'As du Fallafel
- 03:00 PM - Explore Montmartre
- 06:00 PM - Sacré-Cœur Sunset
- 08:00 PM - Dinner at Chez Janou

**Day 3:**
- 10:00 AM - Versailles Palace
- 02:00 PM - Lunch at Versailles
- 04:00 PM - Return to Paris
- 06:00 PM - Shopping on Champs-Élysées
- 08:00 PM - Farewell dinner

---

## Resources

- **Get API Key**: https://makersuite.google.com/app/apikey
- **Gemini Docs**: https://ai.google.dev/docs
- **Pricing**: https://ai.google.dev/pricing
- **API Limits**: https://ai.google.dev/gemini-api/docs/models/gemini#model-variations

---

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify your API key at Google AI Studio
3. Check console logs for error messages
4. The app will work with fallback itineraries if AI fails

**Happy trip planning!** ✈️🗺️
