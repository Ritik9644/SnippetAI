#!/bin/bash

# Intellicode Hybrid Architecture Startup Script
# This script helps you start both the frontend and AI microservice

echo "🚀 Starting Intellicode Hybrid Architecture..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command_exists docker; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites are installed${NC}"

# Check if ports are available
echo -e "${BLUE}🔍 Checking port availability...${NC}"

if port_in_use 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 is already in use. AI service might already be running.${NC}"
else
    echo -e "${GREEN}✅ Port 3001 is available for AI service${NC}"
fi

if port_in_use 5173; then
    echo -e "${YELLOW}⚠️  Port 5173 is already in use. Frontend might already be running.${NC}"
else
    echo -e "${GREEN}✅ Port 5173 is available for frontend${NC}"
fi

# Start AI microservice
echo -e "${BLUE}🤖 Starting AI Explanation Microservice...${NC}"
cd ai-explanation-service

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ AI microservice directory not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Start microservice with Docker Compose
echo -e "${BLUE}🐳 Starting AI service with Docker...${NC}"
docker-compose up --build -d

# Wait for service to be ready
echo -e "${BLUE}⏳ Waiting for AI service to be ready...${NC}"
sleep 5

# Check if service is responding
if curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${GREEN}✅ AI Explanation Service is running on http://localhost:3001${NC}"
else
    echo -e "${RED}❌ AI service failed to start. Check Docker logs:${NC}"
    echo -e "${YELLOW}docker-compose logs ai-explanation-service${NC}"
    exit 1
fi

cd ..

# Start frontend
echo -e "${BLUE}⚛️  Starting React Frontend...${NC}"
cd project

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Frontend directory not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}📝 Please configure your .env file with Supabase credentials${NC}"
fi

echo -e "${BLUE}🚀 Starting frontend development server...${NC}"
echo -e "${GREEN}✅ Frontend will be available at http://localhost:5173${NC}"
echo -e "${GREEN}✅ AI service is available at http://localhost:3001${NC}"
echo -e "${BLUE}📚 AI service API docs: http://localhost:3001/api-docs${NC}"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   • Configure your .env file with Supabase credentials"
echo -e "   • Check AI service logs: docker-compose logs -f ai-explanation-service"
echo -e "   • Stop AI service: docker-compose down"
echo ""

# Start frontend (this will block)
npm run dev
