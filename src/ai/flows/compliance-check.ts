'use server';

/**
 * @fileOverview Verifies requirements against healthcare compliance standards.
 *
 * - complianceCheck - A function that checks requirements against compliance standards.
 * - ComplianceCheckInput - The input type for the complianceCheck function.
 * - ComplianceCheckOutput - The return type for the complianceCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplianceCheckInputSchema = z.object({
  requirements: z.string().describe('The software requirements to check.'),
  complianceStandards: z
    .string()
    .describe(
      'The healthcare compliance standards to verify the requirements against, such as FDA, GDPR, ISO, etc.'
    ),
});
export type ComplianceCheckInput = z.infer<typeof ComplianceCheckInputSchema>;

const ComplianceCheckOutputSchema = z.object({
  complianceReport: z
    .string()
    .describe(
      'A report detailing the compliance status of the requirements against the specified standards, including any violations or areas of concern.'
    ),
  suggestions: z
    .string()
    .describe(
      'Suggestions for improving the requirements to meet the compliance standards.'
    ),
});
export type ComplianceCheckOutput = z.infer<typeof ComplianceCheckOutputSchema>;

export async function complianceCheck(
  input: ComplianceCheckInput
): Promise<ComplianceCheckOutput> {
  return complianceCheckFlow(input);
}

const complianceCheckPrompt = ai.definePrompt({
  name: 'complianceCheckPrompt',
  input: {schema: ComplianceCheckInputSchema},
  output: {schema: ComplianceCheckOutputSchema},
  prompt: `You are an expert in healthcare software compliance.

You will receive a set of software requirements and a list of compliance standards.
Your task is to analyze the requirements and generate a compliance report, highlighting any violations or areas of concern.
Also, provide suggestions for improving the requirements to meet the specified compliance standards.

Requirements:
{{{requirements}}}

Compliance Standards:
{{{complianceStandards}}}`,
});

const complianceCheckFlow = ai.defineFlow(
  {
    name: 'complianceCheckFlow',
    inputSchema: ComplianceCheckInputSchema,
    outputSchema: ComplianceCheckOutputSchema,
  },
  async input => {
    const {output} = await complianceCheckPrompt(input);
    return output!;
  }
);
