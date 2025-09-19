'use server';

/**
 * @fileOverview Parses a requirements document into individual, structured scenarios.
 *
 * - parseScenarios - A function that parses requirements into scenarios.
 * - ParseScenariosInput - The input type for the parseScenarios function.
 * - ParseScenariosOutput - The return type for the parseScenarios function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ParseScenariosInputSchema = z.object({
  requirements: z
    .string()
    .describe('The full text content of the software requirements document.'),
});
export type ParseScenariosInput = z.infer<typeof ParseScenariosInputSchema>;

const ParsedScenarioSchema = z.object({
  reqId: z
    .string()
    .describe(
      'A unique identifier for the requirement/scenario (e.g., REQ-001).'
    ),
  title: z
    .string()
    .describe('A concise, descriptive title for the scenario.'),
  description: z
    .string()
    .describe('A detailed description of the requirement.'),
  requirementType: z
    .enum(['Functional', 'Non-Functional', 'Business'])
    .describe('The type of the requirement.'),
  requirementSource: z
    .string()
    .describe(
      'The source of the requirement (e.g., Stakeholder, Document Name).'
    ),
  priority: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The priority of the scenario.'),
});

const ParseScenariosOutputSchema = z.object({
  scenarios: z
    .array(ParsedScenarioSchema)
    .describe('An array of structured scenarios parsed from the document.'),
});
export type ParseScenariosOutput = z.infer<typeof ParseScenariosOutputSchema>;

export async function parseScenarios(
  input: ParseScenariosInput
): Promise<ParseScenariosOutput> {
  return parseScenariosFlow(input);
}

const parseScenariosPrompt = ai.definePrompt({
  name: 'parseScenariosPrompt',
  input: { schema: ParseScenariosInputSchema },
  output: { schema: ParseScenariosOutputSchema },
  prompt: `You are an expert at analyzing software requirements documents.

  Your task is to parse the given requirements text and break it down into individual, structured scenarios.
  For each scenario, you must extract the following details:
  - A unique requirement ID (reqId). If not present, generate one like REQ-001, REQ-002.
  - A clear title.
  - A detailed description.
  - The requirement type (Functional, Non-Functional, or Business).
  - The source of the requirement.
  - The priority (High, Medium, or Low).

  If a piece of information for a field is not present in a scenario, make a reasonable assumption. For example, if priority is not mentioned, you can default to 'Medium'. If source is not clear, you can use 'Uploaded Document'.

  Analyze the following requirements document and provide the output in the specified JSON format.

  Requirements:
  {{{requirements}}}
  `,
});

const parseScenariosFlow = ai.defineFlow(
  {
    name: 'parseScenariosFlow',
    inputSchema: ParseScenariosInputSchema,
    outputSchema: ParseScenariosOutputSchema,
  },
  async (input) => {
    const { output } = await parseScenariosPrompt(input);
    return output!;
  }
);
