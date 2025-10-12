@echo off
REM Intellicode Hybrid Architecture Startup Script for Windows
REM This script helps you start both the frontend and AI microservice

echo 🚀 Starting Intellicode Hybrid Architecture...

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Start AI microservice
echo 🤖 Starting AI Explanation Microservice...
cd ai-explanation-service

if not exist package.json (
    echo ❌ AI microservice directory not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 🐳 Starting AI service with Docker...
docker-compose up --build -d

REM Wait for service to be ready
echo ⏳ Waiting for AI service to be ready...
timeout /t 5 /nobreak >nul

REM Check if service is responding
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ AI Explanation Service is running on http://localhost:3001
) else (
    echo ❌ AI service failed to start. Check Docker logs:
    echo docker-compose logs ai-explanation-service
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
echo    • Check AI service logs: docker-compose logs -f ai-explanation-service
echo    • Stop AI service: docker-compose down
echo.

REM Start frontend (this will block)
npm run dev
