# Local Development Setup (No Docker Required)

You can absolutely run the AI microservice locally without Docker! Here are multiple ways to do it:

## Method 1: Use the Local Startup Scripts

### Windows:
```bash
start-local.bat
```

### Linux/Mac:
```bash
chmod +x start-local.sh
./start-local.sh
```

## Method 2: Manual Setup (Step by Step)

### Step 1: Start AI Microservice
```bash
# Navigate to AI service directory
cd ai-explanation-service

# Install dependencies (first time only)
npm install

# Start the service
npm run dev
```

The AI service will start on `http://localhost:3001`

### Step 2: Start Frontend (New Terminal)
```bash
# Navigate to project directory
cd project

# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## Method 3: Using npm Scripts

You can also add a script to your main project's `package.json`:

```json
{
  "scripts": {
    "dev:ai": "cd ai-explanation-service && npm run dev",
    "dev:frontend": "npm run dev",
    "dev:all": "concurrently \"npm run dev:ai\" \"npm run dev:frontend\""
  }
}
```

Then install `concurrently`:
```bash
npm install --save-dev concurrently
```

And run both services:
```bash
npm run dev:all
```

## Prerequisites

- **Node.js 18+** (required for both services)
- **npm** (comes with Node.js)

## What You Get

✅ **AI Service**: `http://localhost:3001`
- Health check: `http://localhost:3001/health`
- API docs: `http://localhost:3001/api-docs`
- Explanation endpoint: `http://localhost:3001/explain`

✅ **Frontend**: `http://localhost:5173`
- Your React app with AI explanations working

## Environment Configuration

Make sure to configure your `.env` files:

### Frontend (.env in project/)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_AI_SERVICE_URL=http://localhost:3001
```

### AI Service (.env in ai-explanation-service/)
```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Troubleshooting

### Port Already in Use
If port 3001 is busy:
```bash
# Find what's using the port
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change the port in .env
```

### AI Service Not Starting
```bash
cd ai-explanation-service
npm install  # Make sure dependencies are installed
npm run dev  # Check for error messages
```

### Frontend Can't Connect to AI Service
- Check if AI service is running on `http://localhost:3001/health`
- Verify `VITE_AI_SERVICE_URL` in your frontend `.env`
- Check browser console for CORS errors

## Benefits of Local Development

✅ **Faster startup** (no Docker overhead)  
✅ **Easier debugging** (direct access to logs)  
✅ **No Docker required** (just Node.js)  
✅ **Hot reloading** (changes reflect immediately)  
✅ **Simpler setup** (fewer moving parts)  

## Production Deployment

For production, you can still use Docker if you prefer:
- Docker provides better isolation and consistency
- But local development is perfectly fine without it
- You can deploy the microservice to any Node.js hosting service

The choice is yours! Both approaches work great. 🚀
