'use client';

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type ImpactAnalysisDialogProps = {
  isOpen: boolean;
  isLoading: boolean;
  analysis: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ImpactAnalysisDialog({
  isOpen,
  isLoading,
  analysis,
  onConfirm,
  onCancel,
}: ImpactAnalysisDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Impact Analysis on Requirement Change</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;ve edited a scenario with existing test cases. The AI has
            analyzed the impact of your changes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card className="max-h-64 overflow-y-auto bg-muted/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{analysis}</p>
              </CardContent>
            </Card>
          )}
        </div>
        <AlertDialogDescription>
          Accepting will update the scenario and clear existing test cases. You
          can then regenerate them based on the new scenario.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
            Accept & Clear Test Cases
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
