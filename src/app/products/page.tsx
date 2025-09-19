
'use client';

import React from 'react';
import Header from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  ClipboardList,
  FlaskConical,
  Link as LinkIcon,
  ChevronRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const productsData = [
  {
    appName: 'Clinical Trial App',
    description:
      'A comprehensive platform for managing clinical trials, from patient recruitment to data analysis.',
    userStories: [
      { id: 'US-401', title: 'Patient Screening and Enrollment' },
      { id: 'US-402', title: 'Adverse Event Reporting' },
    ],
    testCases: { total: 125, passed: 110, failed: 5, pending: 10 },
    jiraLink: 'https://jira.example.com/projects/CTA',
  },
  {
    appName: 'Patient Portal',
    description:
      'A secure portal for patients to access their medical records, schedule appointments, and communicate with providers.',
    userStories: [
        { id: 'US-512', title: 'View Lab Results' },
        { id: 'US-513', title: 'Request Prescription Refill' }
    ],
    testCases: { total: 80, passed: 78, failed: 1, pending: 1 },
    jiraLink: 'https://jira.example.com/projects/PP',
  },
  {
    appName: 'EHR System',
    description:
      'An electronic health record system for hospitals and clinics to manage patient information and clinical workflows.',
    userStories: [
        { id: 'US-603', title: 'Create New Patient Record' },
        { id: 'US-604', title: 'e-Prescribing' },
        { id: 'US-605', title: 'Billing and Invoicing' }
    ],
    testCases: { total: 350, passed: 340, failed: 8, pending: 2 },
    jiraLink: 'https://jira.example.com/projects/EHR',
  },
  {
    appName: 'Telemedicine Platform',
    description:
      'A platform for virtual consultations, connecting patients with healthcare professionals remotely.',
    userStories: [
        { id: 'US-721', title: 'Start a Video Consultation' }
    ],
    testCases: { total: 95, passed: 95, failed: 0, pending: 0 },
    jiraLink: 'https://jira.example.com/projects/TP',
  },
];

const GlassCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'group rounded-xl bg-gradient-to-br from-[var(--card-bg-start)] to-[var(--card-bg-end)] backdrop-blur-sm transition-all duration-300',
      'shadow-[0_0_80px_0_var(--card-glow)]',
      'hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)]',
      className
    )}
  >
    <div
      className={cn(
        'h-full w-full rounded-xl transition-all duration-300',
        'border border-[var(--card-border)] group-hover:border-transparent'
      )}
    >
      {children}
    </div>
  </div>
);


export default function ProductsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Products" />
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <div className="flex flex-col space-y-1.5 mb-6">
          <h1 className="text-2xl font-semibold leading-none tracking-tight">
            Products Tested
          </h1>
          <p className="text-sm text-muted-foreground">
            An overview of all products and their testing status.
          </p>
        </div>

        <div className="space-y-6">
          {productsData.map((product) => (
            <GlassCard key={product.appName}>
              <Accordion type="single" collapsible>
                <AccordionItem value={product.appName} className="border-b-0">
                  <AccordionTrigger className="p-6 hover:no-underline">
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-3">
                        <FolderKanban className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-bold">{product.appName}</h2>
                      </div>
                      <p className="text-muted-foreground mt-2 ml-9">
                        {product.description}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-background/40">
                        <CardHeader>
                          <CardTitle className="flex items-center text-lg">
                            <ClipboardList className="mr-2 h-5 w-5" /> User
                            Stories
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            {product.userStories.map((story) => (
                              <li key={story.id} className="flex items-center">
                                <Badge
                                  variant="outline"
                                  className="mr-2"
                                >
                                  {story.id}
                                </Badge>
                                <span>{story.title}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="bg-background/40">
                        <CardHeader>
                          <CardTitle className="flex items-center text-lg">
                            <FlaskConical className="mr-2 h-5 w-5" /> Testcases
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total</span>
                                <span className="font-bold text-lg">{product.testCases.total}</span>
                           </div>
                           <Separator />
                           <div className="grid grid-cols-3 gap-2 text-center">
                               <div>
                                   <p className="text-green-400 text-xl font-bold">{product.testCases.passed}</p>
                                   <p className="text-xs text-muted-foreground">Passed</p>
                               </div>
                               <div>
                                   <p className="text-red-400 text-xl font-bold">{product.testCases.failed}</p>
                                   <p className="text-xs text-muted-foreground">Failed</p>
                               </div>
                               <div>
                                   <p className="text-orange-400 text-xl font-bold">{product.testCases.pending}</p>
                                   <p className="text-xs text-muted-foreground">Pending</p>
                               </div>
                           </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-background/40 flex flex-col justify-center items-center">
                        <CardContent className="p-6 text-center">
                            <h3 className="text-lg font-semibold mb-4">Jira Details</h3>
                            <Button asChild>
                                <a href={product.jiraLink} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon className="mr-2 h-4 w-4" />
                                    Open in Jira
                                </a>
                            </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  );
}
