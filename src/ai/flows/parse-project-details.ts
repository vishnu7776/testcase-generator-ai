'use server';
/**
 * @fileOverview Parses project details from requirements text.
 *
 * - parseProjectDetails - A function that parses project details.
 * - ParseProjectDetailsInput - The input type for the parseProjectDetails function.
 * - ParseProjectDetailsOutput - The return type for the parseProjectDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseProjectDetailsInputSchema = z.object({
  requirements: z
    .string()
    .describe('The software requirements document content.'),
});
export type ParseProjectDetailsInput = z.infer<typeof ParseProjectDetailsInputSchema>;


const ParseProjectDetailsOutputSchema = z.object({
  appName: z.string().describe('The name of the application.'),
  objective: z.string().describe('A one-line objective of the application.'),
  features: z.array(z.string()).describe('A list of key features.'),
  techStack: z.array(z.string()).describe('A list of technologies in the tech stack.'),
});
export type ParseProjectDetailsOutput = z.infer<typeof ParseProjectDetailsOutputSchema>;

export async function parseProjectDetails(input: ParseProjectDetailsInput): Promise<ParseProjectDetailsOutput> {
  return parseProjectDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseProjectDetailsPrompt',
  input: {schema: ParseProjectDetailsInputSchema},
  output: {schema: ParseProjectDetailsOutputSchema},
  prompt: `You are an AI assistant that parses software requirements to extract key project details.

  Analyze the following requirements and extract the application name, a one-line objective, a list of key features, and the technology stack.
  If a piece of information is not present, leave the corresponding field as an empty string or an empty array.

  Requirements:
  {{{requirements}}}

  Output the answer in JSON format.
  `,
});

const parseProjectDetailsFlow = ai.defineFlow(
  {
    name: 'parseProjectDetailsFlow',
    inputSchema: ParseProjectDetailsInputSchema,
    outputSchema: ParseProjectDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
