import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const knotsData = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), '../frontend/src/data/knots.json'),
    'utf-8'
  )
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildPrompt(query) {
  return `You are a knot-tying expert.\n\nGiven this user query: "${query}", suggest the most relevant knots from the following list (with id and name):\n\n${knotsData.knots.map(k => `- ${k.id}: ${k.name}`).join('\n')}\n\nReply with a JSON object of this form:\n{\n  explanation: <brief explanation>,\n  knots: [<ids of suggested knots>]\n}`;
}

async function getKnotSuggestions(query) {
  if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
  const prompt = buildPrompt(query);
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };
  const { data } = await axios.post(
    `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );

  // Check for API error response from Google
  if (data.error) {
    console.error("AI Provider API Error:", data.error);
    throw new Error(`AI Provider returned an error: ${data.error.message}`);
  }

  // Safely access the response text
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("AI response is missing expected content:", JSON.stringify(data, null, 2));
    throw new Error('AI response did not contain valid content.');
  }

  // Extract JSON object from the response text using a regular expression
  const jsonMatch = text.match(/{[\s\S]*}/);

  if (!jsonMatch) {
    console.error("No JSON object found in AI response. Raw text:", text);
    throw new Error('AI did not return a valid JSON object.');
  }

  const jsonString = jsonMatch[0];
  let aiResponse;
  try {
    aiResponse = JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse extracted JSON. Raw string:", jsonString);
    throw new Error('AI did not return valid JSON');
  }
  // Map knot ids to full knot objects
  const knots = (aiResponse.knots || []).map(
    id => knotsData.knots.find(k => k.id === id)
  ).filter(Boolean);
  return {
    explanation: aiResponse.explanation || '',
    knots
  };
}

export default { getKnotSuggestions };
