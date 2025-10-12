@echo off
REM Intellicode Hybrid Architecture Startup Script for Windows (No Docker)
REM This script helps you start both the frontend and AI microservice locally

echo 🚀 Starting Intellicode Hybrid Architecture (Local Development)...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Start AI microservice locally
echo 🤖 Starting AI Explanation Microservice (Local)...
cd ai-explanation-service

if not exist package.json (
    echo ❌ AI microservice directory not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist node_modules (
    echo 📦 Installing AI service dependencies...
    npm install
)

REM Check if .env exists
if not exist .env (
    echo ⚠️ .env file not found. Creating from .env.example...
    copy .env.example .env
)

echo 🚀 Starting AI service locally...
echo ✅ AI service will be available at http://localhost:3001

REM Start AI service in background
start "AI Service" cmd /k "npm run dev"

REM Wait for service to be ready
echo ⏳ Waiting for AI service to be ready...
timeout /t 3 /nobreak >nul

REM Check if service is responding
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ AI Explanation Service is running on http://localhost:3001
) else (
    echo ❌ AI service failed to start. Check the AI Service window for errors.
    pause
    exit /b 1
)

cd ..

REM Start frontend
echo ⚛️ Starting React Frontend...
cd project

if not exist package.json (
    echo ❌ Frontend directory not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Check if .env exists
if not exist .env (
    echo ⚠️ .env file not found. Creating from .env.example...
    copy .env.example .env
    echo 📝 Please configure your .env file with Supabase credentials
)

echo 🚀 Starting frontend development server...
echo ✅ Frontend will be available at http://localhost:5173
echo ✅ AI service is available at http://localhost:3001
echo 📚 AI service API docs: http://localhost:3001/api-docs
echo.
echo 💡 Tips:
echo    • Configure your .env file with Supabase credentials
echo    • Both services are running locally (no Docker required)
echo    • Close both terminal windows to stop the services
echo.

REM Start frontend (this will block)
npm run dev
