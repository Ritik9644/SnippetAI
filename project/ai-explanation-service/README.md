# AI Explanation Service

A standalone microservice for generating AI-powered code explanations.

## Features

- 🚀 **Fast & Lightweight**: Built with Express.js and optimized for performance
- 🔒 **Secure**: Includes security headers, CORS protection, and input validation
- 🐳 **Docker Ready**: Complete Docker configuration for easy deployment
- 📚 **Well Documented**: Built-in API documentation and health checks
- 🔧 **Configurable**: Environment-based configuration
- 🎯 **Focused**: Single responsibility - code explanation generation

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
   ```bash
   cd ai-explanation-service
   docker-compose up --build
   ```

2. **Or build and run with Docker:**
   ```bash
   docker build -t ai-explanation-service .
   docker run -p 3001:3001 ai-explanation-service
   ```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "ai-explanation-service",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Generate Explanation
```http
POST /explain
Content-Type: application/json

{
  "code": "function hello() { return 'world'; }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "explanation": "## Overview\n\nThis javascript code snippet...",
  "metadata": {
    "language": "javascript",
    "codeLength": 35,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### API Documentation
```http
GET /api-docs
```

## Configuration

Environment variables:

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins
- `GEMINI_API_KEY` - Optional Gemini API key for real AI explanations

## Integration

### Frontend Integration

Update your frontend to call the microservice:

```javascript
// Replace Supabase function call with microservice call
const response = await fetch('http://localhost:3001/explain', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: codeSnippet,
    language: 'javascript'
  })
});

const data = await response.json();
const explanation = data.explanation;
```

### Production Deployment

1. **Using Docker Compose:**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

2. **Using Kubernetes:**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Using Cloud Services:**
   - Deploy to AWS ECS, Google Cloud Run, or Azure Container Instances
   - Use the provided Dockerfile for containerized deployment

## Architecture Benefits

### Microservice Advantages

1. **Scalability**: Scale the AI service independently from the main application
2. **Technology Flexibility**: Use different technologies optimized for AI processing
3. **Fault Isolation**: AI service failures don't affect the main application
4. **Team Independence**: Different teams can work on different services
5. **Deployment Flexibility**: Deploy and update services independently

### Hybrid Architecture

This creates a hybrid architecture where:
- **Frontend**: React SPA (monolithic)
- **Backend**: Supabase (BaaS)
- **AI Service**: Standalone microservice (containerized)

## Development

### Project Structure
```
ai-explanation-service/
├── src/
│   ├── index.js              # Main server file
│   └── services/
│       └── explanationService.js  # AI explanation logic
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

### Real AI Integration (Google Gemini)

The service now includes real AI integration with Google Gemini! Here's how to set it up:

1. **Get a Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key

2. **Configure the Service:**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and add your API key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Restart the Service:**
   ```bash
   npm run dev
   ```

The service will automatically:
- Use real AI explanations when a valid API key is provided
- Fall back to mock explanations if no API key is configured
- Handle API errors gracefully with fallback to mock explanations

**Note:** Without an API key, the service will use intelligent mock explanations that analyze code patterns and provide educational content.

## Monitoring & Logging

The service includes:
- Health check endpoint for monitoring
- Structured error logging
- Request/response metadata
- Docker health checks

## Security

- Helmet.js for security headers
- CORS protection
- Input validation
- Non-root Docker user
- Request size limits

## License

MIT License - see LICENSE file for details
