# Intellicode Hybrid Architecture

This project now uses a **hybrid architecture** combining monolithic frontend with microservices.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │    │   Supabase       │    │ AI Explanation  │
│   (Frontend)    │◄──►│   (Backend)      │    │   Microservice  │
│                 │    │                  │    │                 │
│ - Snippet Editor│    │ - Authentication │    │ - Code Analysis │
│ - Dashboard     │    │ - Database       │    │ - AI Explanations│
│ - Auth Forms    │    │ - Real-time      │    │ - Docker Ready  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Services

### 1. Frontend (React SPA)
- **Technology**: React + TypeScript + Vite
- **Location**: `src/`
- **Responsibilities**: UI, user interactions, state management

### 2. Backend (Supabase)
- **Technology**: Supabase (PostgreSQL + Auth + Real-time)
- **Location**: `supabase/`
- **Responsibilities**: Authentication, database, real-time subscriptions

### 3. AI Explanation Service (Microservice)
- **Technology**: Node.js + Express + Docker
- **Location**: `ai-explanation-service/`
- **Responsibilities**: Code analysis, AI explanations

## Benefits of Hybrid Architecture

### ✅ Advantages
1. **Scalability**: Scale AI service independently
2. **Technology Flexibility**: Use best tools for each service
3. **Fault Isolation**: AI service failures don't crash the app
4. **Team Independence**: Different teams can work on different services
5. **Deployment Flexibility**: Deploy services independently
6. **Cost Optimization**: Scale expensive AI processing separately

### ⚠️ Considerations
1. **Network Latency**: Additional HTTP calls between services
2. **Complexity**: More moving parts to manage
3. **Monitoring**: Need to monitor multiple services
4. **Development Setup**: Need to run multiple services locally

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (for microservice)
- Supabase account

### 1. Setup Frontend
```bash
cd project
npm install
cp .env.example .env
# Configure your Supabase and AI service URLs
npm run dev
```

### 2. Setup AI Microservice
```bash
cd ai-explanation-service
npm install
cp .env.example .env
# Start with Docker
docker-compose up --build
# OR start locally
npm run dev
```

### 3. Setup Supabase
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase (optional)
supabase start

# Or use hosted Supabase
# Configure your .env with Supabase credentials
```

## Development Workflow

### Local Development
1. Start AI microservice: `docker-compose up` (in ai-explanation-service/)
2. Start frontend: `npm run dev` (in project/)
3. Configure Supabase (hosted or local)

### Production Deployment
1. **Frontend**: Deploy to Vercel, Netlify, or similar
2. **AI Service**: Deploy to Docker container service (AWS ECS, Google Cloud Run)
3. **Database**: Use hosted Supabase

## Service Communication

### Frontend → AI Service
```javascript
// Direct HTTP call to microservice
const response = await fetch('http://localhost:3001/explain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code, language })
});
```

### Frontend → Supabase
```javascript
// Using Supabase client
const { data, error } = await supabase
  .from('snippets')
  .insert({ title, code, language });
```

## Monitoring & Debugging

### Health Checks
- **Frontend**: Built-in Vite dev server
- **AI Service**: `GET /health` endpoint
- **Supabase**: Built-in dashboard

### Logging
- **Frontend**: Browser console + React DevTools
- **AI Service**: Console logs + Docker logs
- **Supabase**: Built-in logging dashboard

## Future Enhancements

### Potential Microservices
1. **User Management Service**: Advanced user profiles, preferences
2. **Analytics Service**: Usage tracking, insights
3. **Notification Service**: Real-time notifications
4. **File Storage Service**: Code snippet attachments
5. **Search Service**: Advanced search capabilities

### Migration Strategy
1. **Phase 1**: ✅ AI Explanation Service (Current)
2. **Phase 2**: User Management Service
3. **Phase 3**: Analytics Service
4. **Phase 4**: Full microservices architecture

## Troubleshooting

### Common Issues

1. **AI Service Not Responding**
   ```bash
   # Check if service is running
   curl http://localhost:3001/health
   
   # Check Docker logs
   docker-compose logs ai-explanation-service
   ```

2. **CORS Errors**
   - Ensure `VITE_AI_SERVICE_URL` is correct
   - Check CORS configuration in microservice

3. **Supabase Connection Issues**
   - Verify Supabase URL and keys in `.env`
   - Check Supabase project status

## Contributing

When adding new features:
1. **UI Changes**: Modify React components in `src/`
2. **Database Changes**: Create Supabase migrations
3. **AI Features**: Extend the microservice in `ai-explanation-service/`
4. **New Services**: Create new microservice directories

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
