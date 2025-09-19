'use server';

import { validateRequirements } from '@/ai/flows/validate-requirements';
import { complianceCheck } from '@/ai/flows/compliance-check';
import { generateTestCases } from '@/ai/flows/automated-test-case-generation';
import { analyzeImpactOnChange } from '@/ai/flows/impact-analysis-on-change';
import { parseProjectDetails } from '@/ai/flows/parse-project-details';
import { parseScenarios } from '@/ai/flows/parse-scenarios';
import type { TestCase, ProjectDetails, Scenario } from '@/lib/types';

export async function runValidation(requirements: string) {
  return await validateRequirements({ requirements });
}

export async function runComplianceCheck(requirements: string, complianceStandards: string) {
  return await complianceCheck({ requirements, complianceStandards });
}

export async function runTestCaseGeneration(
  scenario: string,
  complianceStandards: string[],
  priority: 'High' | 'Medium' | 'Low'
) {
  return await generateTestCases({ scenario, complianceStandards, priority });
}

export async function runImpactAnalysis(
  requirementChanges: string,
  existingTestCases: TestCase[]
) {
  const testCasesString = existingTestCases.map(tc => `ID: ${tc.testCaseId}, Title: ${tc.title}`).join('\n');
  return await analyzeImpactOnChange({ requirementChanges, existingTestCases: testCasesString });
}

export async function runParseProjectDetails(requirements: string): Promise<ProjectDetails> {
  return await parseProjectDetails({ requirements });
}

export async function runParseScenarios(requirements: string): Promise<Scenario[]> {
    const result = await parseScenarios({ requirements });
    return result.scenarios.map(s => ({
        ...s,
        id: s.reqId,
        testCases: [],
        areTestsGenerating: false,
    }));
}
