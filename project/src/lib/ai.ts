// Direct Gemini API integration for code explanations and semantic search

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

// Check if Gemini API is configured
const isGeminiConfigured = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  return apiKey && apiKey !== 'your_gemini_api_key_here';
};

export async function generateCodeExplanation(code: string, language: string): Promise<string> {
  // Use the AI Explanation microservice instead of Supabase function
  const microserviceUrl = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:3001';
  const apiUrl = `${microserviceUrl}/explain`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('AI Explanation Service error:', response.status, errorData);
      throw new Error(`AI Explanation Service request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.explanation) {
      throw new Error('No explanation returned from AI service');
    }

    return data.explanation.trim();
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw new Error(`Failed to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: {
          parts: [{
            text: text
          }]
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini Embedding API error:', response.status, errorData);
      throw new Error(`Gemini Embedding API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.embedding || !data.embedding.values) {
      throw new Error('Invalid embedding response from Gemini API');
    }

    return data.embedding.values;
  } catch (error) {
    console.error('Error generating embedding with Gemini:', error);
    throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function semanticSearch(query: string): Promise<any[]> {
  // For semantic search, we'll need to implement this with the database
  // For now, return empty array to indicate semantic search is not available
  console.log('Semantic search not implemented with direct Gemini integration');
  return [];
}