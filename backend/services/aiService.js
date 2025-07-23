import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

import { config } from '../config.js';

const knotsData = JSON.parse(
  fs.readFileSync(
    path.resolve(process.cwd(), '../frontend/src/data/knots.json'),
    'utf-8'
  )
);

async function getKnotSuggestions(query) {
  if (!config.apiKey) {
    console.error('AI_API_KEY not set in environment variables.');
    throw new Error('AI provider API key is not configured.');
  }

  const prompt = config.buildPrompt(query, knotsData);
  const body = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  const { data } = await axios.post(
    `${config.apiUrl}?key=${config.apiKey}`,
    body,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (data.error) {
    console.error("AI Provider API Error:", data.error);
    throw new Error(`AI Provider returned an error: ${data.error.message}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("AI response is missing expected content:", JSON.stringify(data, null, 2));
    throw new Error('AI response did not contain valid content.');
  }

  let jsonString = '';

  const jsonCodeBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonCodeBlockMatch && jsonCodeBlockMatch[1]) {
    jsonString = jsonCodeBlockMatch[1];
  } else {
    const jsonMatch = text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
  }

  if (!jsonString) {
    console.log("No JSON object found in AI response. Returning raw text as explanation.");
    return {
      explanation: text,
      knots: []
    };
  }

  let aiResponse;
  try {
    aiResponse = JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse extracted JSON. Raw string:", jsonString);
    throw new Error('AI returned malformed JSON');
  }

  const knots = (aiResponse.knots || []).map(
    id => knotsData.knots.find(k => k.id === id)
  ).filter(Boolean);

  return {
    explanation: aiResponse.explanation || '',
    knots
  };
}

export default { getKnotSuggestions };
