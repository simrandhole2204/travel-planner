#!/bin/bash

# AAB to APK Converter Script
# Usage: ./convert-aab-to-apk.sh your-app.aab

if [ -z "$1" ]; then
    echo "❌ Error: Please provide the AAB file path"
    echo "Usage: ./convert-aab-to-apk.sh your-app.aab"
    exit 1
fi

AAB_FILE="$1"

if [ ! -f "$AAB_FILE" ]; then
    echo "❌ Error: File not found: $AAB_FILE"
    exit 1
fi

echo "🔄 Converting AAB to APK..."
echo "Input: $AAB_FILE"

# Get the base name without extension
BASE_NAME=$(basename "$AAB_FILE" .aab)

# Convert AAB to APKs
echo "📦 Building APKs..."
java -jar bundletool.jar build-apks \
    --bundle="$AAB_FILE" \
    --output="${BASE_NAME}.apks" \
    --mode=universal

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to build APKs"
    exit 1
fi

# Extract the universal APK
echo "📂 Extracting universal APK..."
unzip -o "${BASE_NAME}.apks" universal.apk

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to extract APK"
    exit 1
fi

# Rename to a better name
mv universal.apk "${BASE_NAME}.apk"

echo "✅ Success! APK created: ${BASE_NAME}.apk"
echo ""
echo "📱 You can now install this APK on your Android phone!"
echo "   File: ${BASE_NAME}.apk"
echo ""
echo "🗑️  Cleaning up temporary files..."
rm "${BASE_NAME}.apks"

echo "✅ Done!"
