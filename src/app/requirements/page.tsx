
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { ValidationResult, ComplianceResult } from '@/lib/types';

import Header from '@/components/header';
import RequirementsView from '@/components/requirements-view';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RequirementsPage() {
  const router = useRouter();
  const [requirementsText, setRequirementsText] = useState('');
  const [validationResult, setValidationResult] =
    useState<ValidationResult>(null);
  const [complianceResult, setComplianceResult] =
    useState<ComplianceResult>(null);

  const handleAnalysisComplete = (
    validation: ValidationResult,
    compliance: ComplianceResult,
    requirements: string
  ) => {
    setValidationResult(validation);
    setComplianceResult(compliance);
    // Pass the results to the scenarios page via query params or a state management solution
    // For simplicity, we'll use local storage here. In a real app, you might prefer a more robust solution.
    localStorage.setItem('requirementsAnalysis', JSON.stringify({ validation, compliance, requirements }));
    router.push('/scenarios');
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Import Requirement" />
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <RequirementsView
          requirementsText={requirementsText}
          setRequirementsText={setRequirementsText}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </main>
    </div>
  );
}
