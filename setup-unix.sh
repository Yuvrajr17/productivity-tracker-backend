#!/bin/bash

# Setup script for Productivity Tracker - macOS/Linux
# This script automates the installation process

echo ""
echo "========================================"
echo "Productivity Tracker Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please download and install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found:"
node --version
npm --version
echo ""

# Check if MongoDB is running
echo "Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "WARNING: MongoDB not found locally"
    echo "Please either:"
    echo "1. Install MongoDB: brew install mongodb-community (macOS) or apt-get install mongodb (Linux)"
    echo "2. Use MongoDB Atlas cloud version"
    echo ""
fi

# Create .env file
echo "Creating .env file for server..."
if [ -f "server/.env" ]; then
    echo ".env already exists, skipping..."
else
    cat > server/.env << EOF
MONGODB_URI=mongodb://localhost:27017/productivity-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=optional_for_future_features
EOF
    echo "✓ Created server/.env"
fi

echo ""
echo "Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..
echo "✓ Backend dependencies installed"

echo ""
echo "Installing frontend dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo "✓ Frontend dependencies installed"

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Make sure MongoDB is running"
echo "   macOS: brew services start mongodb-community"
echo "   Linux: sudo systemctl start mongod"
echo ""
echo "2. Open two terminal windows"
echo ""
echo "Terminal 1 - Start Backend:"
echo "  cd server"
echo "  npm start"
echo ""
echo "Terminal 2 - Start Frontend:"
echo "  cd client"
echo "  npm start"
echo ""
echo "The app will open at http://localhost:3000"
echo ""
echo "Update server/.env with your MongoDB URI and JWT secret for production"
echo ""
