'use client';

import React, { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { runTestCaseGeneration, runImpactAnalysis } from '@/app/actions';
import { PlusCircle, Edit, Trash2, FlaskConical, Loader2, FileText, ChevronRight, FileUp } from 'lucide-react';
import type { Scenario, TestCase } from '@/lib/types';
import GenerationProgress from './generation-progress';
import ImpactAnalysisDialog from './impact-analysis-dialog';
import { Separator } from './ui/separator';

type ScenariosViewProps = {
  scenarios: Scenario[];
  setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>;
  onUpdateScenario: (scenario: Scenario) => void;
  onUpdateTestCases: (scenarioId: string, testCases: TestCase[]) => void;
  onSetTestsGenerating: (scenarioId: string, isGenerating: boolean) => void;
};

type ScenarioFormData = Omit<Scenario, 'id' | 'testCases' | 'areTestsGenerating'>;


const ScenarioForm: React.FC<{
  onSubmit: (data: ScenarioFormData) => void;
  initialData?: ScenarioFormData;
  buttonText: string;
}> = ({ onSubmit, initialData, buttonText }) => {
  const [formData, setFormData] = useState<ScenarioFormData>(
    initialData || { 
        reqId: '',
        title: '', 
        description: '', 
        priority: 'Medium',
        requirementType: 'Functional',
        requirementSource: 'Manual',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
      <div className="space-y-2">
        <Label htmlFor="reqId">Requirement ID</Label>
        <Input id="reqId" value={formData.reqId} onChange={(e) => setFormData({ ...formData, reqId: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Scenario Title</Label>
        <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData({ ...formData, priority: value })} >
            <SelectTrigger>
                <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="requirementType">Type</Label>
            <Select value={formData.requirementType} onValueChange={(value: 'Functional' | 'Non-Functional' | 'Business') => setFormData({ ...formData, requirementType: value })}>
            <SelectTrigger>
                <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Functional">Functional</SelectItem>
                <SelectItem value="Non-Functional">Non-Functional</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="requirementSource">Source</Label>
        <Input id="requirementSource" value={formData.requirementSource} onChange={(e) => setFormData({ ...formData, requirementSource: e.target.value })} required />
      </div>
      <DialogFooter className='pt-4'>
        <DialogClose asChild><Button type="submit">{buttonText}</Button></DialogClose>
      </DialogFooter>
    </form>
  );
};

const ScenarioCard: React.FC<{
  scenario: Scenario;
  onEdit: (scenario: Scenario, data: ScenarioFormData) => void;
  onDelete: (id: string) => void;
  onGenerateTests: (scenario: Scenario) => void;
}> = ({ scenario, onEdit, onDelete, onGenerateTests }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isTestCasesVisible, setIsTestCasesVisible] = useState(false);

  const handleEdit = (data: ScenarioFormData) => {
    onEdit(scenario, data);
    setIsEditOpen(false);
  };
  
  return (
    <Card className="flex flex-col bg-card/80 backdrop-blur-sm border border-white/10">
      <CardHeader className='pb-4'>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg font-semibold">{scenario.title}</CardTitle>
          <Badge variant={scenario.priority === 'High' ? 'destructive' : scenario.priority === 'Medium' ? 'secondary' : 'outline'} className="flex-shrink-0">
            {scenario.priority}
          </Badge>
        </div>
        <CardDescription className='text-sm text-gray-400 line-clamp-2'>{scenario.description}</CardDescription>
        <div className='flex items-center gap-4 text-xs text-gray-500 pt-2'>
            <span>ID: <span className='font-medium text-gray-400'>{scenario.reqId}</span></span>
            <Separator orientation='vertical' className='h-4' />
            <span>Type: <span className='font-medium text-gray-400'>{scenario.requirementType}</span></span>
            <Separator orientation='vertical' className='h-4' />
            <span>Source: <span className='font-medium text-gray-400'>{scenario.requirementSource}</span></span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-4">
        {scenario.testCases.length > 0 && (
            <>
                <Button variant='link' size='sm' className='p-0 h-auto text-primary' onClick={() => setIsTestCasesVisible(!isTestCasesVisible)}>
                    {isTestCasesVisible ? 'Hide' : 'Show'} {scenario.testCases.length} Test Cases <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${isTestCasesVisible ? 'rotate-90' : ''}`} />
                </Button>
                {isTestCasesVisible && (
                    <div className='mt-2 max-h-48 overflow-y-auto rounded-lg border border-white/10 p-2'>
                        <Table>
                        <TableHeader>
                            <TableRow className='border-b-white/10 hover:bg-transparent'>
                                <TableHead className='p-2'>ID</TableHead>
                                <TableHead className='p-2'>Title</TableHead>
                                <TableHead className='p-2'>Priority</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scenario.testCases.map((tc) => (
                            <TableRow key={tc.testCaseId} className='border-0 hover:bg-white/5'>
                                <TableCell className='p-2'>{tc.testCaseId}</TableCell>
                                <TableCell className='p-2'>{tc.title}</TableCell>
                                <TableCell className='p-2'><Badge variant="outline">{tc.priority}</Badge></TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                )}
            </>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-black/20 py-3 px-4">
        <div className="flex gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"><FileUp className="mr-2 h-4 w-4" /> Update Document</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Scenario</DialogTitle>
                    </DialogHeader>
                    <ScenarioForm onSubmit={handleEdit} initialData={scenario} buttonText="Save Changes" />
                </DialogContent>
            </Dialog>
          <Button variant="ghost" size="sm" onClick={() => onDelete(scenario.id)} className='text-red-400 hover:text-red-300 hover:bg-red-500/10'>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
         <Button
          size="sm"
          onClick={() => onGenerateTests(scenario)}
          disabled={scenario.areTestsGenerating}
          className='bg-primary/90 hover:bg-primary'
        >
          {scenario.areTestsGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FlaskConical className="mr-2 h-4 w-4" />
              Generate Tests
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function ScenariosView({
  scenarios,
  setScenarios,
  onUpdateScenario,
  onUpdateTestCases,
  onSetTestsGenerating
}: ScenariosViewProps) {
  const { toast } = useToast();
  const [isAddScenarioOpen, setIsAddScenarioOpen] = useState(false);
  const [generatingScenarioId, setGeneratingScenarioId] = useState<string | null>(null);
  const [impactAnalysis, setImpactAnalysis] = useState<{ analysis: string, scenario: Scenario, newData: ScenarioFormData } | null>(null);
  const [isImpactAnalysisPending, startImpactAnalysisTransition] = useTransition();

  const emptyStateImage = PlaceHolderImages.find(img => img.id === 'empty-state-scenarios');
  
  const handleAddScenario = (data: ScenarioFormData) => {
    const newScenario: Scenario = {
      id: data.reqId || `SCN-${Date.now()}`,
      areTestsGenerating: false,
      testCases: [],
      ...data,
    };
    setScenarios([...scenarios, newScenario]);
    setIsAddScenarioOpen(false);
    toast({ title: 'Scenario Added', description: `Scenario "${data.title}" has been created.` });
  };

  const handleEditScenario = (scenario: Scenario, newData: ScenarioFormData) => {
    const updatedScenario = { ...scenario, ...newData };
    if (scenario.testCases.length > 0 && (scenario.description !== newData.description || scenario.title !== newData.title)) {
      startImpactAnalysisTransition(async () => {
        let changes = [];
        if (scenario.title !== newData.title) changes.push(`Title changed from "${scenario.title}" to "${newData.title}".`);
        if (scenario.description !== newData.description) changes.push(`Description updated.`);

        try {
          const result = await runImpactAnalysis(changes.join(' '), scenario.testCases);
          setImpactAnalysis({ analysis: result.impactAnalysis, scenario: updatedScenario, newData });
        } catch (error) {
          toast({ title: 'Impact Analysis Failed', variant: 'destructive' });
          onUpdateScenario(updatedScenario);
        }
      });
    } else {
      onUpdateScenario(updatedScenario);
      toast({ title: 'Scenario Updated' });
    }
  };

  const confirmScenarioUpdate = () => {
    if (!impactAnalysis) return;
    onUpdateScenario({ ...impactAnalysis.scenario, testCases: [] });
    toast({ title: 'Scenario Updated', description: 'Test cases have been cleared due to changes.' });
    setImpactAnalysis(null);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
    toast({ title: 'Scenario Deleted' });
  };

  const handleGenerateTests = async (scenario: Scenario) => {
    onSetTestsGenerating(scenario.id, true);
    setGeneratingScenarioId(scenario.id);
    
    try {
      const result = await runTestCaseGeneration(
        scenario.description,
        ['FDA', 'GDPR'],
        scenario.priority
      );
      onUpdateTestCases(scenario.id, result.testCases);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Test Case Generation Failed',
        variant: 'destructive',
      });
      onSetTestsGenerating(scenario.id, false);
    } finally {
        setGeneratingScenarioId(null);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Scenarios</h2>
        <Dialog open={isAddScenarioOpen} onOpenChange={setIsAddScenarioOpen}>
          <DialogTrigger asChild>
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Scenario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Scenario</DialogTitle>
              <DialogDescription>
                Define a new scenario to generate test cases for.
              </DialogDescription>
            </DialogHeader>
            <ScenarioForm onSubmit={handleAddScenario} buttonText="Add Scenario" />
          </DialogContent>
        </Dialog>
      </div>

      {scenarios.length === 0 ? (
        <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center gap-4">
                {emptyStateImage && (
                    <Image
                        src={emptyStateImage.imageUrl}
                        alt={emptyStateImage.description}
                        width={300}
                        height={200}
                        className="rounded-lg"
                        data-ai-hint={emptyStateImage.imageHint}
                    />
                )}
                <h3 className="text-xl font-semibold">No Scenarios Yet</h3>
                <p className="text-muted-foreground">
                    Click Add Scenario to get started.
                </p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onEdit={handleEditScenario}
              onDelete={handleDeleteScenario}
              onGenerateTests={handleGenerateTests}
            />
          ))}
        </div>
      )}
      
      <GenerationProgress
        isOpen={generatingScenarioId !== null}
        onClose={() => setGeneratingScenarioId(null)}
        scenarioTitle={scenarios.find(s => s.id === generatingScenarioId)?.title || ''}
      />

      <ImpactAnalysisDialog
        isOpen={impactAnalysis !== null || isImpactAnalysisPending}
        isLoading={isImpactAnalysisPending}
        analysis={impactAnalysis?.analysis || ''}
        onConfirm={confirmScenarioUpdate}
        onCancel={() => setImpactAnalysis(null)}
      />
    </div>
  );
}
