'use server';

/**
 * @fileOverview Analyzes the impact of requirement changes on existing test cases.
 *
 * - analyzeImpactOnChange - A function that analyzes the impact of requirement changes on existing test cases.
 * - ImpactAnalysisOnChangeInput - The input type for the analyzeImpactOnChange function.
 * - ImpactAnalysisOnChangeOutput - The return type for the analyzeImpactOnChange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImpactAnalysisOnChangeInputSchema = z.object({
  requirementChanges: z
    .string()
    .describe('A description of the changes made to the requirements.'),
  existingTestCases: z
    .string()
    .describe('A list of the existing test cases to analyze.'),
});
export type ImpactAnalysisOnChangeInput = z.infer<
  typeof ImpactAnalysisOnChangeInputSchema
>;

const ImpactAnalysisOnChangeOutputSchema = z.object({
  impactAnalysis: z
    .string()
    .describe(
      'An analysis of the impact of the requirement changes on the existing test cases, including suggestions for updates.'
    ),
});
export type ImpactAnalysisOnChangeOutput = z.infer<
  typeof ImpactAnalysisOnChangeOutputSchema
>;

export async function analyzeImpactOnChange(
  input: ImpactAnalysisOnChangeInput
): Promise<ImpactAnalysisOnChangeOutput> {
  return analyzeImpactOnChangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'impactAnalysisOnChangePrompt',
  input: {schema: ImpactAnalysisOnChangeInputSchema},
  output: {schema: ImpactAnalysisOnChangeOutputSchema},
  prompt: `You are an expert test case impact analyst. You are provided a summary of requirement changes, and a list of existing test cases.

  Analyze the impact of the requirement changes on the existing test cases and determine what modifications should be made. Be as specific as possible.

Requirement Changes: {{{requirementChanges}}}
Existing Test Cases: {{{existingTestCases}}}`,
});

const analyzeImpactOnChangeFlow = ai.defineFlow(
  {
    name: 'analyzeImpactOnChangeFlow',
    inputSchema: ImpactAnalysisOnChangeInputSchema,
    outputSchema: ImpactAnalysisOnChangeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
