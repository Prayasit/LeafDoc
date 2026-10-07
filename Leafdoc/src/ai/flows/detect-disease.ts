
'use server';
/**
 * @fileOverview Detects diseases in a plant from an image and description.
 *
 * - detectDisease - A function that handles the disease detection process.
 * - DetectDiseaseInput - The input type for the detectDisease function.
 * - DetectDiseaseOutput - The return type for the detectDisease function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const DetectDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant.'),
  plantName: z.string().describe('The identified name of the plant.'),
});
export type DetectDiseaseInput = z.infer<typeof DetectDiseaseInputSchema>;

const DetectDiseaseOutputSchema = z.object({
  isDiseased: z.boolean().describe('Whether or not the plant is diseased.'),
  diseaseName: z.string().describe('The name of the identified disease, if any.').optional(), // Made optional
  confidence: z
    .number()
    .describe('Confidence level of the disease detection (0-1).')
    .optional(),
  suggestedTreatment: z.string().describe('Suggested treatment for the disease, if any.').optional(), // Made optional
});
export type DetectDiseaseOutput = z.infer<typeof DetectDiseaseOutputSchema>;


// Updated detectDisease function with retry logic
export async function detectDisease(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(`Calling detectDiseaseFlow (Attempt ${retryCount + 1})`);
      const result = await detectDiseaseFlow(input);
      console.log('detectDiseaseFlow successful:', result);
      return result;
    } catch (error: any) {
      console.error(`Error in detectDiseaseFlow (Attempt ${retryCount + 1}):`, error);
      // Check if the error is a temporary overload error (e.g., 503)
      if ((error.message?.includes('503') || error.status === 503) && retryCount < maxRetries -1) {
        retryCount++;
        const delay = 1000 * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying detectDiseaseFlow after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('detectDiseaseFlow failed after retries or due to non-retryable error.');
        // Re-throw the error if it's not a retryable error or max retries reached
        throw error;
      }
    }
  }
   // This line should theoretically not be reached if retries are handled correctly
  throw new Error(`detectDiseaseFlow failed after ${maxRetries} retries.`);
}


const prompt = ai.definePrompt({
  name: 'detectDiseasePrompt',
  input: {
    schema: z.object({
      photoDataUri: z
        .string()
        .describe(
          "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
      description: z.string().describe('The description of the plant.'),
      plantName: z.string().describe('The identified name of the plant.'),
    }),
  },
  output: {
    schema: z.object({
      isDiseased: z.boolean().describe('Whether or not the plant is diseased.'),
      diseaseName: z.string().describe('The name of the identified disease, if any. Provide "Unknown Disease" if unsure but symptoms suggest disease.').optional(),
      confidence: z
        .number()
        .describe('Confidence level of the disease detection (0-1). Provide a lower score if unsure.')
        .optional(),
      suggestedTreatment: z.string().describe('Suggested treatment for the disease, if any. Provide "Consult a specialist" if unsure.').optional(),
    }),
  },
  prompt: `You are an expert plant pathologist. Analyze the image and description provided to detect any potential diseases affecting the plant.

  Plant Name: {{{plantName}}}
  Description: {{{description}}}
  Image: {{media url=photoDataUri}}

  Based on the visual symptoms and description, determine if the plant is diseased.
  - If a disease is detected:
    - Set isDiseased to true.
    - Provide the diseaseName. If unsure about the specific disease but symptoms are present, use "Unknown Disease".
    - Provide a confidence level (0-1). Use a lower confidence if you are less certain.
    - Provide a suggestedTreatment. If unsure, suggest "Consult a local gardening expert or agricultural extension office for accurate diagnosis and treatment."
  - If no significant disease is detected:
    - Set isDiseased to false.
    - You may leave diseaseName, confidence, and suggestedTreatment empty or null.

  Respond strictly in the requested JSON format.
  `,
});

const detectDiseaseFlow = ai.defineFlow<
  typeof DetectDiseaseInputSchema,
  typeof DetectDiseaseOutputSchema
>({
  name: 'detectDiseaseFlow',
  inputSchema: DetectDiseaseInputSchema,
  outputSchema: DetectDiseaseOutputSchema,
},
async input => {
  console.log("Inside detectDiseaseFlow, calling detectDiseasePrompt...");
  const {output} = await prompt(input);
   console.log("detectDiseasePrompt output:", output);
   if (!output) {
       console.error("detectDiseasePrompt returned null output");
       throw new Error("Failed to get response from disease detection model.");
   }
   // Provide default values for optional fields if they are missing, especially when not diseased
   return {
     isDiseased: output.isDiseased ?? false,
     diseaseName: output.diseaseName,
     confidence: output.confidence,
     suggestedTreatment: output.suggestedTreatment,
   };
}
);

