'use server';

import { config } from 'dotenv';
config();

import '@/ai/flows/validate-requirements.ts';
import '@/ai/flows/compliance-check.ts';
import '@/ai/flows/automated-test-case-generation.ts';
import '@/ai/flows/impact-analysis-on-change.ts';
import '@/ai/flows/parse-project-details.ts';
import '@/ai/flows/parse-scenarios.ts';
