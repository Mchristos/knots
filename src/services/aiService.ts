import { Knot } from '../types';
import knotsData from '../data/knots.json';

/**
 * Defines the structure of the response expected from an AI service.
 * @property {string} explanation - A natural language explanation or suggestion from the AI.
 * @property {Knot[]} knots - An array of Knot objects suggested by the AI.
 */
export interface AIResponse {
  explanation: string;
  knots: Knot[];
}

/**
 * Interface for AI services, ensuring a consistent contract for different AI providers.
 */
export interface IAIService {
  /**
   * Retrieves knot suggestions based on a natural language query.
   * @param {string} query - The user's natural language query about a knot-tying situation.
   * @returns {Promise<AIResponse>} A promise that resolves to an AIResponse object containing an explanation and suggested knots.
   */
  getKnotSuggestions(query: string): Promise<AIResponse>;
}

/**
 * A mock implementation of the IAIService for demonstration and development purposes.
 * It provides hardcoded knot suggestions based on simple keyword matching in the query.
 * This service simulates an asynchronous API call with a small delay.
 */
export class MockAIService implements IAIService {
  private knots: Knot[] = knotsData.knots as Knot[];

  /**
   * Simulates fetching knot suggestions from an AI.
   * In a real application, this would involve calling an external AI API (e.g., Gemini, OpenAI).
   * @param {string} query - The user's natural language query.
   * @returns {Promise<AIResponse>} A promise resolving to an AIResponse with an explanation and relevant knots.
   */
  async getKnotSuggestions(query: string): Promise<AIResponse> {
    console.log(`MockAIService received query: ${query}: ${query}`);

    // Simulate API call delay to mimic network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    let explanation = "I'm not sure which knot is best for that situation. Please try rephrasing your question.";
    let suggestedKnots: Knot[] = [];

    const lowerCaseQuery = query.toLowerCase();

    // Simple keyword-based matching to provide mock suggestions.
    // This logic would be replaced by actual AI model inference in a real AI service.
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

    // If no specific match, provide a general response and suggest some common, versatile knots.
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

/**
 * --- AI Integration Notes ---
 *
 * To integrate a real AI API (e.g., Gemini, OpenAI, Claude), you would create a new class
 * that implements the `IAIService` interface. This class would make the actual API calls
 * to the chosen AI provider.
 *
 * Example (pseudo-code for Gemini):
 *
 * import { GoogleGenerativeAI } from "@google/generative-ai";
 *
 * export class GeminiAIService implements IAIService {
 *   private genAI: GoogleGenerativeAI;
 *   private model: any; // Or a more specific type for the model, e.g., GenerativeModel
 *
 *   constructor(apiKey: string) {
 *     this.genAI = new GoogleGenerativeAI(apiKey);
 *     // Initialize the generative model with the desired model name (e.g., "gemini-pro")
 *     this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
 *   }
 *
 *   async getKnotSuggestions(query: string): Promise<AIResponse> {
 *     // Construct a prompt that guides the AI to provide a structured response.
 *     // It's crucial to include the knot data and specify the desired output format (e.g., JSON).
 *     const prompt = `Given the following knot data: ${JSON.stringify(knotsData.knots)}\n * \nUser query: "${query}"\n\nBased on the user's query, suggest the best knot(s) from the provided data.\n * Provide a brief natural language explanation (max 2 sentences) and then list the IDs of the suggested knots.\n * If no specific knot is suitable, suggest general versatile knots. Format your response as a JSON object with\n * 'explanation' (string) and 'knotIds' (array of strings).`;
 *
 *     try {
 *       // Send the prompt to the Gemini model and get the response.
 *       const result = await this.model.generateContent(prompt);
 *       const response = await result.response;
 *       const text = response.text(); // Get the raw text response from the AI
 *
 *       // Attempt to parse the AI's response as JSON.
 *       const parsedResponse = JSON.parse(text);
 *       const suggestedKnotIds: string[] = parsedResponse.knotIds || [];
 *       const explanation: string = parsedResponse.explanation || "";
 *
 *       // Filter the actual knot objects based on the IDs returned by the AI.
 *       const suggestedKnots = this.knots.filter(knot => suggestedKnotIds.includes(knot.id));
 *
 *       return {
 *         explanation,
 *         knots: suggestedKnots,
 *       };
 *     } catch (e) {
 *       console.error("Failed to parse AI response or AI call failed:", text, e);
 *       // Return a fallback error response if parsing fails or AI call encounters an issue.
 *       return {
 *         explanation: "Sorry, I couldn't process that. Please try again.",
 *         knots: [],
 *       };
 *     }
 *   }
 * }
 *
 * Important Security Note:
 * For production applications, you should NEVER expose your API keys directly in client-side code.
 * This is a major security vulnerability. Instead, create a backend proxy server that handles
 * the API calls securely. The client-side application would then call your backend proxy,
 * which in turn calls the AI API. This approach protects your API keys and allows for
 * additional server-side logic such as rate limiting, logging, and more complex data processing.
 *
 * To switch services in AIChat.tsx:
 * 1. Uncomment and import the desired AI service (e.g., `import { GeminiAIService } from '../services/aiService';`).
 * 2. Instantiate the service, ensuring you securely provide the API key (e.g., `const aiService = new GeminiAIService(process.env.REACT_APP_GEMINI_API_KEY);`).
 *    API keys should be loaded from environment variables and never hardcoded.
 */