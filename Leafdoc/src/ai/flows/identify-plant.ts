// This file is machine-generated - DO NOT EDIT.
'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

/* ---------------- INPUT SCHEMA ---------------- */

const IdentifyPlantInputSchema = z.object({
  photoDataUri: z.string().describe(
    "A photo of a plant as a base64 data URI. Format: data:<mimetype>;base64,<data>"
  ),
});

export type IdentifyPlantInput = z.infer<typeof IdentifyPlantInputSchema>;


/* ---------------- OUTPUT SCHEMA ---------------- */

const IdentifyPlantOutputSchema = z.object({
  commonName: z.string(),
  scientificName: z.string(),
  confidence: z.number(),
  health: z.number(),
  region: z.string(),
  description: z.string(),
  care: z.object({
    sunlight: z.string(),
    water: z.string(),
    soil: z.string(),
    temperature: z.string(),
  }),
});

export type IdentifyPlantOutput = z.infer<typeof IdentifyPlantOutputSchema>;


/* ---------------- MAIN FUNCTION ---------------- */

export async function identifyPlant(
  input: IdentifyPlantInput
): Promise<IdentifyPlantOutput> {

  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {

      console.log(`Calling identifyPlantFlow (Attempt ${retryCount + 1})`);

      const result = await identifyPlantFlow(input);

      console.log("identifyPlantFlow success:", result);

      return result;

    } catch (error: any) {

      console.error("Error:", error);

      if (
        (error.message?.includes("503") || error.status === 503) &&
        retryCount < maxRetries - 1
      ) {

        retryCount++;

        const delay = 1000 * Math.pow(2, retryCount);

        console.log(`Retrying after ${delay}ms`);

        await new Promise((resolve) => setTimeout(resolve, delay));

      } else {

        throw error;

      }
    }
  }

  throw new Error("Plant identification failed after retries.");
}


/* ---------------- PROMPT ---------------- */

const identifyPlantPrompt = ai.definePrompt({
  name: "identifyPlantPrompt",
  input: {
    schema: IdentifyPlantInputSchema,
  },
  output: {
    schema: IdentifyPlantOutputSchema,
  },
  prompt: `You are a professional botanist and plant taxonomist.

Analyze the plant image and identify the plant accurately.

Image:
{{media url=photoDataUri}}

Return the result in JSON format:

{
  "commonName": "",
  "scientificName": "",
  "confidence": number between 0 and 1,
  "health": number between 0 and 100,
  "region": "",
  "description": "",
  "care": {
    "sunlight": "",
    "water": "",
    "soil": "",
    "temperature": ""
  }
}

Rules:
- commonName = return the simplest common plant name only (e.g., "Sunflower")
- scientificName = botanical Latin name (e.g., Helianthus annuus)
- health = plant health percentage
- region = write a detailed sentence like:
  "Native to North America and commonly found in prairies, meadows, roadsides and open grasslands."
- description = write 2–3 sentences describing the plant’s appearance, growth habit, and notable characteristics.
- care instructions should be practical for gardeners.
`,
});


/* ---------------- FLOW ---------------- */

const identifyPlantFlow = ai.defineFlow<
  typeof IdentifyPlantInputSchema,
  typeof IdentifyPlantOutputSchema
>(
{
  name: "identifyPlantFlow",
  inputSchema: IdentifyPlantInputSchema,
  outputSchema: IdentifyPlantOutputSchema,
},

async (input) => {

  console.log("Running plant identification...");

  const { output } = await identifyPlantPrompt(input);

  if (!output) {
    throw new Error("Model returned empty response.");
  }

  return {
    commonName: output.commonName ?? "Unknown Plant",
    scientificName: output.scientificName ?? "Unknown Species",
    confidence: output.confidence ?? 0.5,
    health: output.health ?? 80,
    region: output.region ?? "Unknown Region",
    description: output.description ?? "No description available.",
    care: {
      sunlight: output.care?.sunlight ?? "Full sun",
      water: output.care?.water ?? "Moderate watering",
      soil: output.care?.soil ?? "Well-drained soil",
      temperature: output.care?.temperature ?? "20°C - 30°C",
    },
  };

});