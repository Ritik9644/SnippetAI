import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { explainCode } from './services/explanationService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'ai-explanation-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Main explanation endpoint
app.post('/explain', async (req, res) => {
  try {
    const { code, language } = req.body;

    // Validate input
    if (!code || !language) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both code and language are required'
      });
    }

    // Generate explanation
    const explanation = await explainCode(code, language);

    res.json({
      explanation,
      metadata: {
        language,
        codeLength: code.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in explain endpoint:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate explanation',
      timestamp: new Date().toISOString()
    });
  }
});

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    service: 'AI Explanation Service',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check endpoint',
      'POST /explain': 'Generate AI explanation for code',
      'GET /api-docs': 'API documentation'
    },
    'POST /explain': {
      description: 'Generate AI-powered explanation for code snippets',
      requestBody: {
        code: 'string (required) - The code to explain',
        language: 'string (required) - Programming language of the code'
      },
      response: {
        explanation: 'string - Generated explanation in markdown format',
        metadata: {
          language: 'string - Programming language',
          codeLength: 'number - Length of input code',
          timestamp: 'string - ISO timestamp'
        }
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Explanation Service running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
