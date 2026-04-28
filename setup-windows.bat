@echo off
REM Setup script for Productivity Tracker - Windows
REM This script automates the installation process

echo.
echo ========================================
echo Productivity Tracker Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
npm --version
echo.

REM Check if MongoDB is installed or running
echo Checking MongoDB...
mongod --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MongoDB not found
    echo Please either:
    echo 1. Install MongoDB locally from https://www.mongodb.com/try/download/community
    echo 2. Use MongoDB Atlas cloud version
    echo.
)

echo.
echo Creating .env file for server...
if exist "server\.env" (
    echo .env already exists, skipping...
) else (
    (
        echo MONGODB_URI=mongodb://localhost:27017/productivity-tracker
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
        echo PORT=5000
        echo NODE_ENV=development
        echo CORS_ORIGIN=http://localhost:3000
        echo OPENAI_API_KEY=optional_for_future_features
    ) > server\.env
    echo ✓ Created server\.env
)

echo.
echo Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed

echo.
echo Installing frontend dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running (mongod)
echo 2. Open two terminal windows
echo.
echo Terminal 1 - Start Backend:
echo   cd server
echo   npm start
echo.
echo Terminal 2 - Start Frontend:
echo   cd client
echo   npm start
echo.
echo The app will open at http://localhost:3000
echo.
echo Update server\.env with your MongoDB URI and JWT secret for production
echo.
pause
