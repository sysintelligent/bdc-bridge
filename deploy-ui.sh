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
NODE_ENV=production npm run build
echo "✅ UI built successfully"

# 4. Ensure server/static directory exists and is empty
echo "Preparing server/static directory..."
rm -rf ../server/static
mkdir -p ../server/static
echo "✅ Server/static directory prepared"

# 5. Copy build files to server/static
echo "Copying build files to server/static..."

# Copy the entire .next directory to maintain all build artifacts
cp -R .next ../server/static/
# Copy package.json and package-lock.json for dependencies
cp package.json ../server/static/
cp package-lock.json ../server/static/
# Copy public directory if it exists
if [ -d "public" ]; then
  cp -R public ../server/static/
fi

# Create a custom server.js that serves static files correctly
cat > ../server/static/server.js << 'EOL'
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const path = require('path')

// Configure Next.js to use the current directory
const dir = __dirname
process.chdir(dir)

const dev = false
const hostname = 'localhost'
const port = 8080

// Initialize Next.js with the correct directory
const app = next({ dev, dir })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal Server Error')
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
EOL

echo "✅ UI files copied to server/static"

# 6. Install production dependencies in the static directory
cd ../server/static
echo "Installing production dependencies..."
npm install --production
echo "✅ Dependencies installed"

# 7. Restart the server if running
if pgrep -f "node.*server.js" > /dev/null; then
  echo "Restarting server..."
  pkill -f "node.*server.js"
fi

# Start the Node.js server
nohup node server.js > server.log 2>&1 &
echo "✅ Server started with new UI files"

echo "===== Deployment Complete! ====="
echo "UI has been updated. You can access it at http://localhost:8080"
echo "Completed at $(date)" 