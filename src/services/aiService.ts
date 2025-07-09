import { Knot } from '../types';

export interface AIResponse {
  explanation: string;
  knots: Knot[];
}

export interface IAIService {
  getKnotSuggestions(query: string): Promise<AIResponse>;
}

// Use Vite env variable for backend URL, fallback to localhost for dev
const API_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050'}/api/gemini`;

export class AIService implements IAIService {
  async getKnotSuggestions(query: string): Promise<AIResponse> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    if (!res.ok) throw new Error('AI service failed');
    const data = await res.json();
    return {
      explanation: data.explanation || '',
      knots: Array.isArray(data.knots) ? data.knots : []
    };
  }
}

