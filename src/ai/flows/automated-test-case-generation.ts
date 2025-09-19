'use server';

/**
 * @fileOverview Automatically generates test cases from defined scenarios, tagging them with compliance standards and priority.
 *
 * - generateTestCases - A function that generates test cases based on input scenarios.
 * - GenerateTestCasesInput - The input type for the generateTestCases function.
 * - GenerateTestCasesOutput - The return type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  scenario: z
    .string()
    .describe('A detailed description of the scenario for which test cases need to be generated.'),
  complianceStandards: z
    .array(z.string())
    .describe('An array of compliance standards relevant to the scenario (e.g., FDA, GDPR, ISO).'),
  priority: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The priority of the scenario, influencing the depth and rigor of the generated test cases.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const GenerateTestCasesOutputSchema = z.object({
  testCases: z.array(
    z.object({
      testCaseId: z.string().describe('A unique identifier for the test case.'),
      title: z.string().describe('A concise title for the test case.'),
      steps: z.array(z.string()).describe('A list of steps to execute the test case.'),
      expectedResult: z.string().describe('The expected outcome after executing the test case.'),
      complianceTags: z
        .array(z.string())
        .describe('The compliance standards that this test case verifies.'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The priority of the test case.'),
      confidenceLevel: z
        .string()
        .describe('The confidence level of the test case, indicating its reliability.'),
    })
  ).describe('An array of generated test cases.'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const generateTestCasesPrompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert test case generator for healthcare software.

  Given a scenario, compliance standards, and priority, generate a comprehensive set of test cases.
  Each test case should include a unique ID, title, steps, expected result, compliance tags, priority, and confidence level.

  Scenario: {{{scenario}}}
  Compliance Standards: {{#each complianceStandards}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Priority: {{{priority}}}

  Ensure that the generated test cases are relevant, cover various aspects of the scenario, and align with the specified compliance standards and priority.

  Format the output as a JSON array of test cases.`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await generateTestCasesPrompt(input);
    return output!;
  }
);
