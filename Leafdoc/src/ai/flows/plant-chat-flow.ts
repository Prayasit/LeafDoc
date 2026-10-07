
'use server';
/**
 * @fileOverview A chatbot specialized in plant information and care.
 *
 * - plantChat - A function that handles the chatbot interaction.
 * - PlantChatInput - The input type for the plantChat function.
 * - PlantChatOutput - The return type for the plantChat function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PlantChatInputSchema = z.object({
  question: z.string().describe('The user s question about plants.'),
});
export type PlantChatInput = z.infer<typeof PlantChatInputSchema>;

const PlantChatOutputSchema = z.object({
  answer: z.string().describe('The chatbot s answer to the user s question.'),
});
export type PlantChatOutput = z.infer<typeof PlantChatOutputSchema>;

export async function plantChat(input: PlantChatInput): Promise<PlantChatOutput> {
  const maxRetries = 2;
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await plantChatFlow(input);
    } catch (error: any) {
      if (error.message?.includes('503') && attempt < maxRetries - 1) {
        attempt++;
        console.warn(`PlantChatFlow failed with 503, retrying attempt ${attempt}...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        console.error('Error in plantChat:', error);
        return { answer: "I'm sorry, I encountered an issue and couldn't process your request. Please try again later." };
      }
    }
  }
  return { answer: "I'm sorry, I'm currently unable to respond. Please try again later." };
}

const plantChatPrompt = ai.definePrompt({
  name: 'plantChatPrompt',
  input: {schema: PlantChatInputSchema},
  output: {schema: PlantChatOutputSchema},
  prompt: `You are "PlantBot", a friendly and expert horticultural chatbot.
Your knowledge covers all aspects of plant life, including:
- Plant identification (though you cannot see images here, you can discuss characteristics)
- Detailed plant care instructions (watering, sunlight, soil, fertilizer, pruning)
- Diagnosing plant diseases and pests (based on descriptions)
- Suggesting treatments for plant ailments
- Gardening tips and techniques
- Information about different plant species, their origins, and fun facts.

When a user asks a question, provide a clear, concise, and helpful answer.
If you don't know the answer, politely say so.
Maintain a positive and encouraging tone.

User's question: {{{question}}}

Answer:`,
});

const plantChatFlow = ai.defineFlow(
  {
    name: 'plantChatFlow',
    inputSchema: PlantChatInputSchema,
    outputSchema: PlantChatOutputSchema,
  },
  async (input: PlantChatInput) => {
    const {output} = await plantChatPrompt(input);
    if (!output) {
        console.error("plantChatPrompt returned null output");
        return { answer: "I'm sorry, I couldn't generate a response. Please try asking in a different way." };
    }
    return output;
  }
);
