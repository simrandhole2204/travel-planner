#!/bin/bash

# Build script for Travel Planner APK
# This script fixes the git PATH issue and builds the APK

echo "🚀 Building Travel Planner APK..."

# Set PATH to include git
export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:$PATH

# Verify git is accessible
if ! command -v git &> /dev/null; then
    echo "❌ Error: git not found in PATH"
    exit 1
fi

echo "✅ Git found at: $(which git)"

# Run EAS build
echo "📦 Starting EAS build..."
npx eas-cli build --platform android --profile preview

echo "✅ Build command completed!"
