#!/bin/bash

# BDC Bridge UI Deployment Script
# This script automates the UI build and deployment process

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
npm run build
echo "✅ UI built successfully"

# 4. Ensure server/static directory exists
mkdir -p ../server/static
echo "✅ Ensured server/static directory exists"

# 5. Copy build files to server/static
echo "Copying build files to server/static..."
cp -R build/* ../server/static/
echo "✅ UI files copied to server/static"

# 6. Restart the server if running
if pgrep -f "go run.*server/main.go" > /dev/null; then
  echo "Restarting server..."
  pkill -f "go run.*server/main.go"
  cd ../server
  nohup go run main.go > server.log 2>&1 &
  echo "✅ Server restarted with new UI files"
else
  echo "Server not running, no need to restart"
fi

echo "===== Deployment Complete! ====="
echo "UI has been updated. You can access it at http://localhost:8080"
echo "Completed at $(date)" 