# SnippetAI - AI-Powered Code Snippet Manager

A web application that transforms your code library into an intelligent, searchable knowledge base with AI-powered explanations.

## Features

- **Secure Authentication** - Email/password registration and login
- **Smart Code Editor** - Monaco Editor with syntax highlighting for 15+ languages
- **AI-Powered Explanations** - Automatic plain-English explanations for saved code
- **Semantic Search** - Find snippets by meaning and intent, not just keywords
- **Beautiful UI** - Modern design with smooth animations

## Quick Start

### Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Supabase Project** - Create at [supabase.com](https://supabase.com)
3. **Google Gemini API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd SnippetAI
```

### 2. Start AI Service

```bash
# Navigate to AI service
cd ai-explanation-service

# Install dependencies
npm install

# Create environment file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Start AI service
npm start
```

The AI service will run on http://localhost:3001

### 3. Start Frontend

Open a new terminal:

```bash
# Navigate to frontend
cd project

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_AI_SERVICE_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Usage

1. **Register/Login** - Create an account at http://localhost:5173
2. **Create Snippets** - Click "New Snippet" to add code
3. **View AI Explanations** - Explanations appear automatically in the right panel
4. **Search & Organize** - Find and manage your code snippets

## Troubleshooting

### AI Generation Failed

1. **Check AI Service:**
   ```bash
   curl http://localhost:3001/health
   ```

2. **Verify Environment Variables:**
   - Frontend: `VITE_AI_SERVICE_URL=http://localhost:3001`
   - AI Service: `GEMINI_API_KEY=your_actual_api_key`

3. **Restart Services:**
   - Stop both terminals (Ctrl+C)
   - Restart AI service: `cd ai-explanation-service && npm start`
   - Restart frontend: `cd project && npm run dev`

### Common Issues

**Port Already in Use:**
- Kill processes using ports 3001 or 5173
- Or change ports in environment files

**CORS Errors:**
- Ensure `VITE_AI_SERVICE_URL=http://localhost:3001` in frontend `.env`

**API Key Issues:**
- Verify Gemini API key is valid
- Check API key is set in both `.env` files

## Project Structure

```
SnippetAI/
├── project/                    # React Frontend (port 5173)
│   ├── src/                   # React components and logic
│   ├── .env                   # Frontend environment variables
│   └── package.json           # Frontend dependencies
│
├── ai-explanation-service/    # AI Microservice (port 3001)
│   ├── src/                   # Express server and AI logic
│   ├── .env                   # AI service environment variables
│   └── package.json           # AI service dependencies
│
└── README.md                  # This file
```

## License

MIT License