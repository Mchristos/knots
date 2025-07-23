import 'dotenv/config';

// Basic configuration for the AI provider
export const config = {
  // The API key for the AI provider, loaded from environment variables.
  // This is a critical security measure to avoid hardcoding sensitive keys.
  apiKey: process.env.GEMINI_API_KEY,

  // The URL for the AI provider's API endpoint.
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',

  /**
   * Builds the prompt to be sent to the AI provider.
   * This function can be customized to match the specific requirements of the chosen AI provider.
   * 
   * @param {string} query - The user's query.
   * @param {Array} knotsData - The list of available knots.
   * @returns {string} The formatted prompt.
   */
  buildPrompt: (query, knotsData) => {
    return `You are a knot-tying expert.\n\nGiven this user query: "${query}", suggest the most relevant knots from the following list (with id and name):\n\n${knotsData.knots.map(k => `- ${k.id}: ${k.name}`).join('\n')}\n\nReply with a JSON object of this form:\n{\n  explanation: <brief explanation>,\n  knots: [<ids of suggested knots>]\n}`;
  }
};