#!/bin/bash

# BDC Bridge UI Deployment Script
# This script automates the UI build process

set -e  # Exit on any error

echo "===== BDC Bridge UI Deployment ====="
echo "Starting deployment process at $(date)"

# 1. Navigate to UI directory
cd "$(dirname "$0")/ui"
echo "✅ Navigated to UI directory: $(pwd)"

# 2. Install dependencies if needed
if [ "$1" == "--install" ]; then
  echo "Installing dependencies..."
  npm install
  echo "✅ Dependencies installed"
fi

# 3. Build the UI with production settings
echo "Building UI for production..."
NODE_ENV=production npm run build
echo "✅ UI built successfully"

# 4. Start the production server
echo "Starting production server..."
npm start
echo "✅ Production server started"

echo "===== Deployment Complete! ====="
echo "UI has been built and started. You can access it at http://localhost:3000"
echo "Completed at $(date)" 