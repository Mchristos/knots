import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const knotsData = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), '../src/data/knots.json'),
    'utf-8'
  )
);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log(GEMINI_API_KEY);
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
  // Gemini's response is in data.candidates[0].content.parts[0].text
  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log(text);
  // Strip markdown code fences and language hints
  if (typeof text === 'string') {
    text = text.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '');
  }
  let aiResponse;
  try {
    aiResponse = JSON.parse(text);
  } catch {
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
