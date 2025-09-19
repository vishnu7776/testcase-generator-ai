
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import type { Scenario, TestCase, ValidationResult, ComplianceResult } from '@/lib/types';
import Header from '@/components/header';
import ScenariosView from '@/components/scenarios-view';
import AnalysisResultsView from '@/components/analysis-results-view';
import { Button } from '@/components/ui/button';
import { runParseScenarios } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [analysis, setAnalysis] = useState<{
    validation: ValidationResult;
    compliance: ComplianceResult;
    requirements: string;
  } | null>(null);
  const [view, setView] = useState<'scenarios' | 'analysis'>('scenarios');
  const [isParsing, startParsingTransition] = useTransition();
  const { toast } = useToast();
  
  useEffect(() => {
    const storedAnalysis = localStorage.getItem('requirementsAnalysis');
    if (storedAnalysis) {
      const parsedAnalysis = JSON.parse(storedAnalysis);
      setAnalysis(parsedAnalysis);
      handleCreateScenarios(parsedAnalysis.requirements);
      // localStorage.removeItem('requirementsAnalysis');
    }
  }, []);

  const handleUpdateScenario = (updatedScenario: Scenario) => {
    setScenarios(
      scenarios.map((s) => (s.id === updatedScenario.id ? updatedScenario : s))
    );
  };

  const handleUpdateTestCases = (
    scenarioId: string,
    testCases: TestCase[]
  ) => {
    setScenarios((scenarios) =>
      scenarios.map((s) =>
        s.id === scenarioId
          ? { ...s, testCases, areTestsGenerating: false }
          : s
      )
    );
  };

  const handleSetTestsGenerating = (
    scenarioId: string,
    isGenerating: boolean
  ) => {
    setScenarios((scenarios) =>
      scenarios.map((s) =>
        s.id === scenarioId ? { ...s, areTestsGenerating: isGenerating } : s
      )
    );
  };

  const handleCreateScenarios = (requirements: string) => {
    startParsingTransition(async () => {
        try {
            const parsedScenarios = await runParseScenarios(requirements);
            setScenarios(parsedScenarios);
            toast({
                title: 'Scenarios Generated',
                description: `We've created ${parsedScenarios.length} scenarios from your document.`
            });
            setView('scenarios');
            localStorage.removeItem('requirementsAnalysis');
        } catch (error) {
            console.error(error);
            toast({
                title: 'Scenario Generation Failed',
                description: 'Could not parse scenarios from the requirements.',
                variant: 'destructive',
            });
            // Fallback to old behavior
            const newScenario: Scenario = {
                id: `SCN-${Date.now()}`,
                reqId: `SCN-${Date.now()}`,
                title: 'Initial Scenario from Requirements',
                description: requirements,
                priority: 'Medium',
                requirementType: 'Functional',
                requirementSource: 'Uploaded Document',
                testCases: [],
                areTestsGenerating: false,
            };
            setScenarios([newScenario]);
            setView('scenarios');
            localStorage.removeItem('requirementsAnalysis');
        }
    });    
  };

  return (
    <>
      <Header title="Scenarios & Test Cases" />
      <main className="flex-1 p-4 lg:p-6">
        {isParsing ? (
           <div className="flex justify-center items-center h-full">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Generating scenarios...</p>
                </div>
            </div>
        ) : (
          <ScenariosView
            scenarios={scenarios}
            setScenarios={setScenarios}
            onUpdateScenario={handleUpdateScenario}
            onUpdateTestCases={handleUpdateTestCases}
            onSetTestsGenerating={handleSetTestsGenerating}
          />
        )}
      </main>
    </>
  );
}
