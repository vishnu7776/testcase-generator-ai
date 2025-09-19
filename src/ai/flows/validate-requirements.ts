'use server';
/**
 * @fileOverview Validates uploaded requirements and suggests missing elements based on industry best practices.
 *
 * - validateRequirements - A function that validates the requirements.
 * - ValidateRequirementsInput - The input type for the validateRequirements function.
 * - ValidateRequirementsOutput - The return type for the validateRequirements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateRequirementsInputSchema = z.object({
  requirements: z
    .string()
    .describe('The software requirements document content.'),
});
export type ValidateRequirementsInput = z.infer<typeof ValidateRequirementsInputSchema>;

const MissingElementSuggestionSchema = z.object({
  element: z.string().describe('The missing element.'),
  reason: z.string().describe('The reason why the element is important.'),
});

const CompletenessValidationSchema = z.object({
  isValid: z.boolean().describe('Whether the requirements are complete.'),
  missingElements: z.array(MissingElementSuggestionSchema).describe('Suggestions for missing elements.'),
});

const ValidateRequirementsOutputSchema = z.object({
  completenessValidation: CompletenessValidationSchema.describe(
    'Validation result for the completeness of the provided requirements.'
  ),
});
export type ValidateRequirementsOutput = z.infer<typeof ValidateRequirementsOutputSchema>;

export async function validateRequirements(input: ValidateRequirementsInput): Promise<ValidateRequirementsOutput> {
  return validateRequirementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateRequirementsPrompt',
  input: {schema: ValidateRequirementsInputSchema},
  output: {schema: ValidateRequirementsOutputSchema},
  prompt: `You are an AI assistant that validates software requirements for completeness based on industry best practices for healthcare software.

  Analyze the following requirements and determine if they are complete. Provide suggestions for missing elements, if any. For each suggested element, explain why it is important.  Be concise.

  Requirements: {{{requirements}}}
  Output the answer in JSON format.
  `,
});

const validateRequirementsFlow = ai.defineFlow(
  {
    name: 'validateRequirementsFlow',
    inputSchema: ValidateRequirementsInputSchema,
    outputSchema: ValidateRequirementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
