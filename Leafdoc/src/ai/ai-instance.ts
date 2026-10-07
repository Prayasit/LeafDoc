// src/ai/ai-instance.ts
import { genkit } from 'genkit';
// Do NOT import 'gemini' or 'gemini25FlashLite' directly from here
import { googleAI } from '@genkit-ai/google-genai'; 

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  // Use the .model() method from the plugin instance
  model: googleAI.model('gemini-2.5-flash-lite'), 
});