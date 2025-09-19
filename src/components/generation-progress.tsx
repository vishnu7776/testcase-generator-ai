'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

type GenerationProgressProps = {
  isOpen: boolean;
  onClose: () => void;
  scenarioTitle: string;
};

export default function GenerationProgress({
  isOpen,
  onClose,
  scenarioTitle,
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsComplete(false);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (!isOpen && progress > 0) {
        // This means the generation finished in background
        setProgress(100);
        setIsComplete(true);
        const timer = setTimeout(() => {
            onClose();
        }, 2000);
        return () => clearTimeout(timer);
    }
  }, [isOpen, progress, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Case Generation</DialogTitle>
          <DialogDescription>
            AI is generating test cases for &quot;{scenarioTitle}&quot;. You can
            close this window and continue working.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isComplete ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="font-medium">Generation Complete!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
               <Loader2 className="h-16 w-16 text-primary animate-spin" />
               <p className="font-medium text-muted-foreground">Generating...</p>
               <Progress value={progress} className="w-full" />
            </div>
          )}
        </div>
        <Button onClick={onClose} variant="outline" className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
