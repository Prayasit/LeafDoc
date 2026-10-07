
'use server'; // Ensure this is a server module for Genkit usage

import { ai } from '@/ai/ai-instance'; // Import the global ai instance
import { z } from 'genkit';

/**
 * Represents basic care information for a plant.
 */
export interface PlantCare {
  /**
   * The scientific name of the plant.
   */
  scientificName: string;
  /**
   * The common name of the plant.
   */
  commonName: string;
  /**
   * The watering frequency (e.g., "Once a week").
   */
  wateringFrequency: string;
  /**
   * The sunlight needs of the plant (e.g., "Full sun").
   */
  sunlightNeeds: string;
}

/**
 * Asynchronously retrieves care information for a given plant name.
 * This is a placeholder and should be replaced with a real API call or a Genkit flow.
 *
 * @param plantName The name of the plant to retrieve care information for.
 * @returns A promise that resolves to a PlantCare object.
 */
export async function getPlantCare(plantName: string): Promise<PlantCare> {
  // Placeholder implementation
  console.log(`Fetching care info for (placeholder): ${plantName}`);
  // Simulate an API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Basic mock data based on plant name
  if (plantName.toLowerCase().includes("rose")) {
    return {
      scientificName: 'Rosa exampleus',
      commonName: plantName,
      wateringFrequency: 'Water deeply 1-2 times a week, more in hot weather.',
      sunlightNeeds: 'At least 6 hours of full sun per day.',
    };
  } else if (plantName.toLowerCase().includes("tomato")) {
    return {
      scientificName: 'Solanum lycopersicum exampleus',
      commonName: plantName,
      wateringFrequency: 'Water regularly, aiming for 1-1.5 inches per week. Avoid wetting foliage.',
      sunlightNeeds: 'Full sun (6-8 hours) is essential for fruit production.',
    };
  } else if (plantName.toLowerCase().includes("fern")) {
    return {
      scientificName: 'Pteridophyta exampleus',
      commonName: plantName,
      wateringFrequency: 'Keep soil consistently moist, but not waterlogged. High humidity is beneficial.',
      sunlightNeeds: 'Indirect light or shade. Direct sun can scorch leaves.',
    };
  }
  // Default fallback
  return {
    scientificName: 'Plantus exampleus',
    commonName: plantName,
    wateringFrequency: 'Once a week, check soil moisture first.',
    sunlightNeeds: 'Bright, indirect light. Varies by specific unknown plant.',
  };
}


// Define schema for trivia output
const PlantTriviaOutputSchema = z.object({
  triviaFacts: z.array(z.string().describe("An interesting and concise trivia fact about plants.")).min(7).describe("A list of at least 7 unique plant trivia facts."),
});

// Define the prompt for generating plant trivia
const plantTriviaPrompt = ai.definePrompt({
  name: 'plantTriviaPrompt',
  output: { schema: PlantTriviaOutputSchema },
  prompt: `You are a plant enthusiast and expert. Generate a list of at least 7 unique, short, and engaging trivia facts about plants.
Each fact should be a separate string in the array.
The facts should be interesting to a general audience. Avoid overly technical jargon.
Ensure the output is a JSON object with a key "triviaFacts" containing an array of these facts.
Example of desired output format:
{
  "triviaFacts": [
    "Fact 1 about plants.",
    "Fact 2 about plants.",
    "Fact 3 about plants.",
    "Fact 4 about plants.",
    "Fact 5 about plants.",
    "Fact 6 about plants.",
    "Fact 7 about plants."
  ]
}`,
});

const fallbackTriviaFacts: string[] = [
    "Bananas are berries, but strawberries aren't.",
    "The world's tallest tree is a Coast Redwood named Hyperion, measuring over 379 feet.",
    "Bamboo can grow up to 35 inches (nearly 3 feet) in a single day.",
    "Some plants, like Mimosa pudica, can move their leaves when touched.",
    "Coffee beans are actually the roasted seeds of coffee cherries.",
    "The corpse flower (Amorphophallus titanum) can take 7-10 years to bloom and smells like rotting flesh.",
    "More than 85% of plant life is found in the ocean.",
    "A sunflower head is composed of thousands of tiny flowers called florets.",
    "Ginkgo Biloba is one of the oldest living tree species, dating back about 270 million years.",
    "The Amazon rainforest produces about 20% of the world's oxygen."
];


/**
 * Asynchronously generates a list of plant trivia facts using Genkit.
 * @returns A promise that resolves to an array of strings containing plant trivia facts.
 */
export async function generatePlantTrivia(): Promise<string[]> {
  console.log("Generating plant trivia list using Genkit...");
  try {
    const { output } = await plantTriviaPrompt({});
    if (output && output.triviaFacts && output.triviaFacts.length >= 7) {
      console.log("Trivia list generated:", output.triviaFacts);
      return output.triviaFacts;
    }
    console.warn("Failed to generate sufficient trivia facts or output was not as expected. Using fallback.");
    return fallbackTriviaFacts.slice(0, 7); // Return first 7 fallback facts
  } catch (error) {
    console.error("Error generating plant trivia list with Genkit:", error);
    // Fallback in case of Genkit error
    return fallbackTriviaFacts.slice(0, 7); // Return first 7 fallback facts
  }
}
