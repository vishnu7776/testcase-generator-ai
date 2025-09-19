import type { ValidateRequirementsOutput } from '@/ai/flows/validate-requirements';
import type { ComplianceCheckOutput } from '@/ai/flows/compliance-check';
import type { GenerateTestCasesOutput } from '@/ai/flows/automated-test-case-generation';
import type { ParseProjectDetailsOutput } from '@/ai/flows/parse-project-details';
import type { ParseScenariosOutput } from '@/ai/flows/parse-scenarios';

export type TestCase = GenerateTestCasesOutput['testCases'][0];

export type Scenario = {
  id: string;
  reqId: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  requirementType: 'Functional' | 'Non-Functional' | 'Business';
  requirementSource: string;
  testCases: TestCase[];
  areTestsGenerating: boolean;
};

export type ValidationResult = ValidateRequirementsOutput | null;
export type ComplianceResult = ComplianceCheckOutput | null;
export type ProjectDetails = ParseProjectDetailsOutput;
