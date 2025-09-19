
'use client';
import 'regenerator-runtime/runtime'
import React, { useState, useTransition, useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, UploadCloud, X, File as FileIcon, Type, Square, Trash2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { runValidation, runComplianceCheck, runParseProjectDetails } from '@/app/actions';
import { useDropzone } from 'react-dropzone';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

import type { ValidationResult, ComplianceResult, ProjectDetails } from '@/lib/types';
import ProjectDetailsDialog from './project-details-dialog';

type RequirementsViewProps = {
  requirementsText: string;
  setRequirementsText: (text: string) => void;
  onAnalysisComplete: (validation: ValidationResult, compliance: ComplianceResult, requirements: string) => void;
};

type UploadedFile = {
    file: File;
    progress: number;
    source: 'upload' | 'speech';
    content: string;
};


function FileUpload({ onFilesUpload }: { onFilesUpload: (files: File[], source: 'upload' | 'speech') => void; }) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFilesUpload(acceptedFiles, 'upload');
        }
    }, [onFilesUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'text/plain': ['.txt', '.md'], 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx']} });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex w-full h-full flex-col items-center justify-center p-10 rounded-xl cursor-pointer transition-colors',
                'bg-card/50 border-2 border-dashed border-border/30',
                 isDragActive ? 'border-primary bg-primary/10' : 'hover:border-primary/50 hover:bg-primary/5'
            )}
        >
            <div className='h-full w-full rounded-xl flex flex-col items-center justify-center'>
                <input {...getInputProps()} />
                <div className='flex flex-col items-center justify-center text-center'>
                    <UploadCloud className="w-12 h-12 text-primary" />
                    <p className="mt-4 text-center text-foreground">
                        {isDragActive
                            ? 'Drop the files here ...'
                            : "Drag 'n' drop requirement files here, or click to select"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">TXT, PDF, DOC, DOCX</p>
                </div>
            </div>
        </div>
      );
}

const FileProgress: React.FC<{ file: UploadedFile, onCancel: () => void }> = ({ file, onCancel }) => {
  return (
    <div className="bg-gradient-to-br from-[var(--card-bg-start)] to-[var(--card-bg-end)] backdrop-blur-sm rounded-xl p-4 w-full relative group">
        <div className="absolute -inset-px bg-card-border rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
            <Button variant="ghost" size="icon" className="absolute top-0 right-0 h-6 w-6 text-muted-foreground hover:text-foreground" onClick={onCancel}>
                <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                    <FileIcon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="font-semibold truncate">{file.file.name}</p>
                    <p className="text-sm text-muted-foreground">{`${(file.file.size / 1024).toFixed(2)} KB`}</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {file.progress < 100 ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <span>Ready</span>
                    )}
                    <span className="ml-auto font-semibold text-foreground">{Math.round(file.progress)}%</span>
                </div>
                <Progress value={file.progress} className="h-2 bg-primary/20" />
            </div>
        </div>
    </div>
  );
};


export default function RequirementsView({
  requirementsText,
  setRequirementsText,
  onAnalysisComplete,
}: RequirementsViewProps) {
  const [isPending, startTransition] = useTransition();
  const [manualText, setManualText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{url: string, transcript: string} | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isProjectDetailsDialogOpen, setIsProjectDetailsDialogOpen] = useState(false);
  const [parsedDetails, setParsedDetails] = useState<ProjectDetails | null>(null);
  
  const { toast } = useToast();
  const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
    useEffect(() => {
        setIsClient(true);
      }, []);
    
      const handleFilesUpload = (files: File[], source: 'upload' | 'speech') => {
        const newFiles: UploadedFile[] = files.map(file => ({
            file,
            progress: 0,
            source,
            content: ''
        }));
        setUploadedFiles(prev => [...prev, ...newFiles]);
      };
    
      const handleCancelUpload = (fileName: string) => {
        setUploadedFiles(prev => prev.filter(f => f.file.name !== fileName));
      };

      const startRecording = async () => {
        if (mediaRecorder) return;
        resetTranscript();
        setRecordedAudio(null);
        SpeechRecognition.startListening({ continuous: true });
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => chunks.push(e.data);
            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setRecordedAudio({ url, transcript });
                stream.getTracks().forEach(track => track.stop());
            };
            recorder.start();
        } catch (error) {
            console.error("Error starting recording:", error);
            toast({ title: 'Recording Error', description: 'Could not start recording. Please check permissions.', variant: 'destructive' });
            SpeechRecognition.stopListening();
        }
    };

    const stopRecording = () => {
        if (listening) {
            SpeechRecognition.stopListening();
            mediaRecorder?.stop();
            setMediaRecorder(null);
        }
    };

    const cancelRecording = () => {
        if (listening) {
            SpeechRecognition.abortListening();
            mediaRecorder?.stop(); // Stop will trigger onstop, but transcript will be empty
            setMediaRecorder(null);
            resetTranscript();
            setRecordedAudio(null);
        }
    };

    const addRecording = () => {
        if (recordedAudio) {
            const speechFile = new File([recordedAudio.transcript], `speech-recognition-${new Date().toISOString()}.txt`, { type: "text/plain" });
            handleFilesUpload([speechFile], 'speech');
            setRecordedAudio(null);
            resetTranscript();
        }
    };

    const discardRecording = () => {
        setRecordedAudio(null);
        resetTranscript();
    };

      useEffect(() => {
        uploadedFiles.forEach((uploadedFile, index) => {
          if (uploadedFile.progress < 100 && !uploadedFile.content) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setUploadedFiles(prev => {
                    const newFiles = [...prev];
                    if (newFiles[index]) {
                      newFiles[index].content = text;
                    }
                    return newFiles;
                });
            };
            reader.onprogress = (e) => {
                if (e.lengthComputable) {
                    const progress = (e.loaded / e.total) * 100;
                    setUploadedFiles(prev => {
                        const newFiles = [...prev];
                        if (newFiles[index]) {
                            newFiles[index].progress = progress;
                        }
                        return newFiles;
                    });
                }
            };
            reader.onloadend = () => {
                setUploadedFiles(prev => {
                    const newFiles = [...prev];
                    if (newFiles[index]) {
                        newFiles[index].progress = 100;
                    }
                    return newFiles;
                });
            };
            if(uploadedFile.source === 'upload') {
                reader.readAsText(uploadedFile.file);
            } else {
                // For speech, content is already there
                uploadedFile.file.text().then(text => {
                    setUploadedFiles(prev => {
                        const newFiles = [...prev];
                        if (newFiles[index]) {
                            newFiles[index].content = text;
                            newFiles[index].progress = 100;
                        }
                        return newFiles;
                    });
                });
            }
          }
        });

        const allContent = uploadedFiles
            .filter(f => f.content)
            .map(f => f.content)
            .join('\n\n');
        
        setRequirementsText([allContent, manualText].filter(Boolean).join('\n\n'));
    }, [uploadedFiles, manualText, setRequirementsText]);


  const handleOpenDetailsDialog = () => {
    startTransition(async () => {
        try {
            const reqText = requirementsText || "Login screen";
            const details = await runParseProjectDetails(reqText);
            setParsedDetails(details);
            setIsProjectDetailsDialogOpen(true);
        } catch(error) {
            console.error(error);
            toast({
                title: 'Parsing Failed',
                description: 'Could not parse project details from requirements.',
                variant: 'destructive',
            });
            // Fallback to old behavior if parsing fails
            handleAnalyze(null);
        }
    });
  }

  const handleAnalyze = (projectDetails: ProjectDetails | null) => {
    setIsProjectDetailsDialogOpen(false);
    startTransition(async () => {
      try {
        const reqText = requirementsText || "Login screen";
        const standards = 'FDA, GDPR, ISO 13485, HIPAA';

        if (projectDetails) {
            console.log('Confirmed Project Details:', projectDetails);
        }

        const [validation, compliance] = await Promise.all([
          runValidation(reqText),
          runComplianceCheck(
            reqText,
            standards
          ),
        ]);
        toast({
          title: 'Analysis Complete',
          description: 'Requirements analysis is ready on the next screen.',
        });
        onAnalysisComplete(validation, compliance, reqText);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Analysis Failed',
          description: 'An error occurred during the analysis.',
          variant: 'destructive',
        });
      }
    });
  };

  const allFilesUploaded = uploadedFiles.every(f => f.progress === 100);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col space-y-1.5">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">Import Requirement</h1>
            <p className="text-sm text-muted-foreground">
              Upload your software requirements document, type them directly, or use your voice. Our AI
              will analyze it for completeness and compliance.
            </p>
        </div>
        <div className="space-y-6">
        {isClient ? (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2 flex flex-col gap-4'>
                  <FileUpload onFilesUpload={handleFilesUpload} />
              </div>
              <div className='lg:col-span-1 flex flex-col gap-6'>
                <div className={cn(
                    'relative flex w-full h-full flex-col items-stretch justify-start p-6 rounded-xl transition-colors',
                    'bg-card/50 border-2 border-dashed border-border/30'
                )}>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground mb-2'>
                        <Type className='h-4 w-4' />
                        <span>Type your requirements</span>
                    </div>
                    <Textarea 
                        placeholder="e.g., The system must allow users to log in with their email and password."
                        className='min-h-[100px] flex-grow bg-transparent'
                        value={manualText}
                        onChange={(e) => setManualText(e.target.value)}
                    />
                </div>
                <div className={cn(
                    'relative flex w-full h-full flex-col items-center justify-center p-10 rounded-xl transition-colors',
                    'bg-card/50 border-2 border-dashed border-border/30'
                )}>
                    {!browserSupportsSpeechRecognition ? (
                         <div className="text-center text-muted-foreground">
                            <Mic className="h-10 w-10 mx-auto mb-2" />
                            <p>Voice input is not supported by your browser.</p>
                        </div>
                    ) : listening ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                           <div className="relative">
                                <button onClick={stopRecording} className="relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 focus:outline-none bg-red-500 shadow-[0_0_20px_-5px_hsl(0,100%,50%)]">
                                    <Square className="h-6 w-6 text-white" />
                                </button>
                                <div className="absolute inset-0 rounded-full border-2 border-primary pulse-ring"></div>
                           </div>
                           <p className="text-sm text-muted-foreground mt-2 text-center h-10">{transcript || 'Listening...'}</p>
                           <button onClick={cancelRecording} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
                        </div>
                    ) : recordedAudio ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <p className="font-semibold">Review Recording</p>
                            <audio ref={audioRef} src={recordedAudio.url} controls className="w-full" />
                            <div className="flex gap-4">
                                <Button onClick={addRecording}>Add</Button>
                                <Button variant="outline" onClick={discardRecording}>Discard</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={startRecording}
                                className={cn(
                                    "relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 focus:outline-none",
                                    "bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_-10px_hsl(var(--mic-glow))]"
                                )}
                                >
                                <Mic className="h-10 w-10 text-primary-foreground" />
                            </button>
                            <p className="text-sm text-muted-foreground mt-2 text-center">Use your voice</p>
                        </div>
                    )}
                </div>
              </div>
          </div>

        ) : <div className="h-64 w-full animate-pulse rounded-lg bg-muted flex items-center justify-center"><Loader2 className='h-8 w-8 animate-spin' /></div>}
          
          {uploadedFiles.length > 0 && (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {uploadedFiles.map((uploadedFile, index) => (
                <div key={index} className="lg:col-span-1">
                    <FileProgress file={uploadedFile} onCancel={() => handleCancelUpload(uploadedFile.file.name)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        <Button onClick={handleOpenDetailsDialog} disabled={isPending || !requirementsText || !allFilesUploaded} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze & Continue'
            )}
          </Button>
      </div>
       <ProjectDetailsDialog
        isOpen={isProjectDetailsDialogOpen}
        onClose={() => setIsProjectDetailsDialogOpen(false)}
        onConfirm={handleAnalyze}
        initialData={parsedDetails}
        isLoading={isPending && !parsedDetails}
      />
    </div>
  );
}

    
