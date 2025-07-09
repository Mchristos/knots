import { Knot } from '../types';
import knotsData from '../data/knots.json';

export interface AIResponse {
  explanation: string;
  knots: Knot[];
}

export interface IAIService {
  getKnotSuggestions(query: string): Promise<AIResponse>;
}

export class MockAIService implements IAIService {
  private knots: Knot[] = knotsData.knots as Knot[];

  async getKnotSuggestions(query: string): Promise<AIResponse> {
    console.log(`MockAIService received query: ${query}`);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let explanation = "I'm not sure which knot is best for that situation. Please try rephrasing your question.";
    let suggestedKnots: Knot[] = [];

    const lowerCaseQuery = query.toLowerCase();

    // Simple keyword-based matching for demonstration
    if (lowerCaseQuery.includes("paddle board") || lowerCaseQuery.includes("buoy") || lowerCaseQuery.includes("boat")) {
      explanation = "For securing a paddle board or boat to a buoy, a strong and reliable loop knot is essential. The Bowline is an excellent choice as it forms a non-slipping loop.";
      suggestedKnots = this.knots.filter(knot => knot.id === "bowline");
    } else if (lowerCaseQuery.includes("stick") && lowerCaseQuery.includes("post")) {
      explanation = "To secure a stick to a post, you'll need a good hitching knot. The Clove Hitch is quick and effective for temporary attachments to cylindrical objects.";
      suggestedKnots = this.knots.filter(knot => knot.id === "clove-hitch");
    } else if (lowerCaseQuery.includes("join") || lowerCaseQuery.includes("connect")) {
      explanation = "When joining two ropes, especially of different sizes, the Sheet Bend is highly recommended.";
      suggestedKnots = this.knots.filter(knot => knot.id === "sheet-bend");
    } else if (lowerCaseQuery.includes("tension") || lowerCaseQuery.includes("guy line")) {
      explanation = "For tensioning lines or creating adjustable attachments, the Rolling Hitch is very effective.";
      suggestedKnots = this.knots.filter(knot => knot.id === "rolling-hitch");
    } else if (lowerCaseQuery.includes("cargo") || lowerCaseQuery.includes("heavy load")) {
      explanation = "For securing heavy loads or tensioning cargo, the Trucker's Hitch provides excellent mechanical advantage.";
      suggestedKnots = this.knots.filter(knot => knot.id === "trucker-hitch");
    } else if (lowerCaseQuery.includes("climbing") || lowerCaseQuery.includes("safety")) {
      explanation = "For climbing or safety applications where a friction hitch is needed, the Prusik Knot is a good choice.";
      suggestedKnots = this.knots.filter(knot => knot.id === "prusik");
    } else if (lowerCaseQuery.includes("package") || lowerCaseQuery.includes("binding")) {
      explanation = "For general binding or tying packages, the Square Knot is a common and reliable choice.";
      suggestedKnots = this.knots.filter(knot => knot.id === "square-knot");
    }

    // If no specific match, provide a general response and suggest some common knots
    if (suggestedKnots.length === 0) {
      explanation = "I can suggest some versatile knots that are useful in many situations. Could you provide more details about what you're trying to do?";
      suggestedKnots = this.knots.filter(knot => 
        ["bowline", "clove-hitch", "square-knot"].includes(knot.id)
      );
    }

    return {
      explanation,
      knots: suggestedKnots,
    };
  }
}

// --- AI Integration Notes ---
// To integrate a real AI API (e.g., Gemini, OpenAI, Claude), you would create a new class
// that implements the `IAIService` interface. This class would make the actual API calls.
//
// Example (pseudo-code for Gemini):
/*
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiAIService implements IAIService {
  private genAI: GoogleGenerativeAI;
  private model: any; // Or a more specific type for the model

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async getKnotSuggestions(query: string): Promise<AIResponse> {
    const prompt = `Given the following knot data: ${JSON.stringify(knotsData.knots)}\n\nUser query: "${query}"\n\nBased on the user's query, suggest the best knot(s) from the provided data. Provide a brief natural language explanation (max 2 sentences) and then list the IDs of the suggested knots. If no specific knot is suitable, suggest general versatile knots. Format your response as a JSON object with 'explanation' (string) and 'knotIds' (array of strings).`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const parsedResponse = JSON.parse(text);
      const suggestedKnotIds: string[] = parsedResponse.knotIds || [];
      const explanation: string = parsedResponse.explanation || "";

      const suggestedKnots = this.knots.filter(knot => suggestedKnotIds.includes(knot.id));

      return {
        explanation,
        knots: suggestedKnots,
      };
    } catch (e) {
      console.error("Failed to parse AI response:", text, e);
      return {
        explanation: "Sorry, I couldn't process that. Please try again.",
        knots: [],
      };
    }
  }
}

// Important Security Note:
// For production applications, you should NEVER expose your API keys directly in client-side code.
// Instead, create a backend proxy server that handles the API calls securely.
// The client-side would then call your backend proxy, which in turn calls the AI API.
// This protects your API keys and allows for rate limiting, logging, and other server-side logic.

// To switch services in AIChat.tsx:
// import { GeminiAIService } from '../services/aiService';
// const aiService = new GeminiAIService(process.env.REACT_APP_GEMINI_API_KEY); // Get API key securely
*/