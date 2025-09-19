
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileWarning, Lightbulb, Info, ArrowRight, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import type { ValidationResult, ComplianceResult } from '@/lib/types';
import Image from 'next/image';

type AnalysisResultsViewProps = {
  validationResult: ValidationResult;
  complianceResult: ComplianceResult;
  onCreateScenarios: () => void;
  isParsing: boolean;
};

const SuggestionCard = ({
  title,
  description,
  icon,
  iconBgColor,
  buttonText = 'Add',
  onAction,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  buttonText?: string;
  onAction?: () => void;
}) => (
  <Card className="bg-card/80 backdrop-blur-sm border-white/10 overflow-hidden">
    <CardContent className="p-5 flex items-center gap-4">
      <div className="flex-shrink-0">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-lg text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {buttonText === 'Add' ? (
          <Button
            onClick={onAction}
            className="bg-primary/80 text-primary-foreground hover:bg-primary"
          >
            {buttonText}
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              className="bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30"
            >
              Fetch Automatically
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Add Manually
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function AnalysisResultsView({
  validationResult,
  complianceResult,
  onCreateScenarios,
  isParsing,
}: AnalysisResultsViewProps) {
  const missingElements =
    validationResult?.completenessValidation?.missingElements || [];
  
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Requirement Document Validation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Please review the findings below and update your document accordingly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">
            Healthcare Compliance Check
          </h2>
          {complianceResult && (
            <>
              <SuggestionCard
                icon={
                  <Image
                    src="https://raw.githubusercontent.com/google-gemini/studio-images/main/images/certitest/d90e6284.png"
                    width={40}
                    height={40}
                    alt="Warning Icon"
                  />
                }
                title="Missing Country / Regional Information"
                description="With Country Details we can accurately map the relevant compliance with it."
                buttonText="Custom"
              />
              <SuggestionCard
                icon={
                  <Image
                    src="https://raw.githubusercontent.com/google-gemini/studio-images/main/images/certitest/7a7f4575.png"
                    width={40}
                    height={40}
                    alt="HIPAA Icon"
                  />
                }
                title={`Identified Compliance Gaps - ${
                  complianceResult.suggestions.split(' ')[0]
                }`}
                description={complianceResult.suggestions}
                buttonText="Add"
              />
            </>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-white/10 pb-2">
            Requirement Detail Suggestions
          </h2>
          {missingElements.map((item, index) => (
            <SuggestionCard
              key={index}
              icon={
                item.element.includes('Login') ? (
                  <Image
                    src="https://raw.githubusercontent.com/google-gemini/studio-images/main/images/certitest/3be1074e.png"
                    width={40}
                    height={40}
                    alt="Info Icon"
                  />
                ) : (
                  <Image
                    src="https://raw.githubusercontent.com/google-gemini/studio-images/main/images/certitest/5d983447.png"
                    width={40}
                    height={40}
                    alt="Idea Icon"
                  />
                )
              }
              title={item.element}
              description={item.reason}
              buttonText="Add"
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-4 pt-6">
        <Button
          variant="outline"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Document & Re-validate
        </Button>
        <Button onClick={onCreateScenarios} className="bg-primary hover:bg-primary/90" disabled={isParsing}>
          {isParsing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Proceeding...
              </>
            ) : (
              <>
                Proceed with warning <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
        </Button>
      </div>
    </div>
  );
}
