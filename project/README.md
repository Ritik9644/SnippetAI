# IntelliCode - AI-Powered Code Snippet Manager

A sophisticated web application that transforms your personal code library into an intelligent, searchable knowledge base with AI-powered explanations and semantic search capabilities.

## Features

- **Secure Authentication** - Email/password registration and login
- **Smart Code Editor** - Monaco Editor with syntax highlighting for 15+ languages
- **AI-Powered Explanations** - Automatic plain-English explanations for saved code
- **Semantic Search** - Find snippets by meaning and intent, not just keywords
- **Beautiful UI** - Apple-level design aesthetics with smooth animations
- **Responsive Design** - Optimized for desktop development workflows

## Getting Started

### Prerequisites

1. **Supabase Project** - Click "Connect to Supabase" in the top right to set up your database
2. **Environment Variables** - Configure your `.env` file with Supabase credentials

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your Supabase URL and anon key
   ```

3. The database schema will be automatically applied when you connect to Supabase

4. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **Supabase** for authentication and database

### Backend Services
- **Supabase Edge Functions** for AI operations
- **PostgreSQL with pgvector** for semantic search
- **Row Level Security** for data isolation

### AI Features
- Code explanation generation
- Semantic search with vector embeddings
- Natural language query processing

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Main dashboard
│   ├── snippets/       # Snippet management
│   └── ui/            # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
└── utils/             # Helper functions

supabase/
├── functions/         # Edge functions
└── migrations/        # Database migrations
```

## Usage

1. **Register/Login** - Create an account or sign in
2. **Create Snippets** - Click "New Snippet" to add code with automatic AI explanations
3. **Search Intelligently** - Use natural language to find snippets by purpose
4. **Organize & Manage** - Edit, delete, and organize your code library

## Production Deployment

1. Set up Supabase project with pgvector extension
2. Deploy edge functions for AI operations
3. Configure environment variables
4. Build and deploy frontend

## License

MIT License - see LICENSE file for details