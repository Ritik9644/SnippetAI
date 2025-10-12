/**
 * AI Explanation Service
 * Generates intelligent explanations for code snippets
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyA9Gs3hSWkWDIaWpTpSXaIuQ-tW0PvsZMU');

/**
 * Generate explanation for code snippet
 * @param {string} code - The code to explain
 * @param {string} language - Programming language
 * @returns {Promise<string>} Generated explanation
 */
export async function explainCode(code, language) {
  try {
    // Use real AI explanation only
    return await generateAIExplanation(code, language);
  } catch (error) {
    console.error('AI explanation failed:', error);
    throw new Error(`Failed to generate AI explanation: ${error.message}`);
  }
}

/**
 * Generate real AI explanation using Google Gemini
 * @param {string} code - The code to explain
 * @param {string} language - Programming language
 * @returns {Promise<string>} Generated explanation
 */
async function generateAIExplanation(code, language) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Please provide a comprehensive explanation of the following ${language} code snippet. Structure your response in markdown format with the following sections:

## Overview
Brief summary of what the code does

## Purpose
Main purpose and functionality

## Key Features
Important features, patterns, or techniques used

## Usage Context
When and how this code would typically be used

## Best Practices
Any best practices demonstrated or recommendations

Code to explain:
\`\`\`${language}
${code}
\`\`\`

Please provide a detailed, educational explanation that would help someone understand this code.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const explanation = response.text();

  return explanation;
}


