
'use client';

import React, { useEffect, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LayoutGrid,
  PlusCircle,
  BarChart,
  ClipboardList,
  FlaskConical,
  Zap,
  Search,
  Bell,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Bug,
  FolderKanban,
  Link as LinkIcon,
} from 'lucide-react';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const kpiData = [
  {
    title: 'Total Apps Used',
    value: '4',
    icon: Zap,
    change: '0%',
    changeType: 'neutral',
    vsLastMonth: '4',
  },
  {
    title: 'Total User Stories',
    value: '128',
    icon: ClipboardList,
    change: '+12.5%',
    changeType: 'increase',
    vsLastMonth: '114',
  },
  {
    title: 'Active Tests',
    value: '7',
    icon: BarChart,
    change: '-14.3%',
    changeType: 'decrease',
    vsLastMonth: '8',
  },
  {
    title: 'Testcases Passed',
    value: '2,345',
    icon: FlaskConical,
    change: '+5.2%',
    changeType: 'increase',
    vsLastMonth: '2,229',
  }
];

const barChartData = [
  { name: 'Clinical Trial App', passed: 315, failed: 51, pending: 88 },
  { name: 'Patient Portal', passed: 265, failed: 39, pending: 71 },
  { name: 'EHR System', passed: 450, failed: 25, pending: 40 },
  { name: 'Telemedicine', passed: 180, failed: 15, pending: 30 },
];

const defectTrendData = [
  { date: '2024-07-01', opened: 10, closed: 8 },
  { date: '2024-07-02', opened: 12, closed: 9 },
  { date: '2024-07-03', opened: 8, closed: 10 },
  { date: '2024-07-04', opened: 15, closed: 11 },
  { date: '2024-07-05', opened: 9, closed: 12 },
  { date: '2024-07-06', opened: 7, closed: 7 },
  { date: '2024-07-07', opened: 11, closed: 13 },
];

const testRunsByApp = [
  {
    appName: 'Clinical Trial App',
    tests: [
      {
        id: 'TR-001',
        userStoryId: 'US-401',
        status: 'Running',
        progress: 75,
        jiraLink: 'https://jira.example.com/browse/CTA-123',
      },
      {
        id: 'TR-006',
        userStoryId: 'US-402',
        status: 'Passed',
        progress: 100,
        jiraLink: 'https://jira.example.com/browse/CTA-120',
      },
    ],
  },
  {
    appName: 'Patient Portal',
    tests: [
      { id: 'TR-002', userStoryId: 'US-512', status: 'Passed', progress: 100, jiraLink: null },
    ],
  },
  {
    appName: 'EHR System',
    tests: [
      {
        id: 'TR-003',
        userStoryId: 'US-603',
        status: 'Failed',
        progress: 100,
        jiraLink: 'https://jira.example.com/browse/EHR-456',
      },
    ],
  },
  {
    appName: 'Telemedicine Platform',
    tests: [
      {
        id: 'TR-004',
        userStoryId: 'US-721',
        status: 'Passed',
        progress: 100,
        jiraLink: 'https://jira.example.com/browse/TP-789',
      },
    ],
  },
  {
    appName: 'Pharmacy Management',
    tests: [
      { id: 'TR-005', userStoryId: 'US-815', status: 'Running', progress: 40, jiraLink: null },
      { id: 'TR-007', userStoryId: 'US-816', status: 'Pending', progress: 0, jiraLink: null },
    ],
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
      'shadow-[0_0_80px_0_var(--card-hover-glow)]',
      'hover:bg-gradient-to-br hover:from-[var(--card-hover-bg-start)] hover:to-[var(--card-hover-bg-end)]',
      'hover:shadow-[0_8px_40px_rgba(255,255,255,0.2)]',
      className
    )}
  >
    <div
      className={cn(
        'h-full w-full rounded-xl transition-all duration-300',
        ''
      )}
    >
      {children}
    </div>
  </div>
);

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/requirements" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Testcase Journey
              </Button>
            </Link>
          </div>
        </div>

        <main className="mt-8 grid flex-1 items-start gap-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
              <GlassCard key={kpi.title}>
                <Card className="bg-transparent border-0 h-full">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <kpi.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{kpi.title}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">{kpi.value}</p>
                        <p
                          className={cn(
                            'text-xs font-semibold flex items-center',
                            kpi.changeType === 'increase' && 'text-green-500',
                            kpi.changeType === 'decrease' && 'text-red-500',
                            kpi.changeType === 'neutral' && 'text-muted-foreground'
                          )}
                        >
                          {kpi.changeType === 'increase' && (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          )}
                          {kpi.changeType === 'decrease' && (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {kpi.change}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        vs last month: {kpi.vsLastMonth}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </GlassCard>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
            <GlassCard className="lg:col-span-4 p-4 sm:p-6">
              <h3 className="text-lg font-semibold">
                App-wise Testcase Status
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Total test cases by status for each application.
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={barChartData}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                      contentStyle={{
                        backgroundColor: 'rgba(5, 5, 5, 0.8)',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar
                      dataKey="passed"
                      name="Passed"
                      stackId="a"
                      fill="#8BEA70"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="failed"
                      name="Failed"
                      stackId="a"
                      fill="#B72B49"
                    />
                    <Bar
                      dataKey="pending"
                      name="Pending"
                      stackId="a"
                      fill="#f97316"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="lg:col-span-3 p-4 sm:p-6">
              <h3 className="text-lg font-semibold">Defect Trend</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bugs opened vs. bugs closed daily.
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={defectTrendData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'hsla(var(--primary), 0.1)' }}
                      contentStyle={{
                        backgroundColor: 'rgba(5, 5, 5, 0.8)',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="opened"
                      name="Bugs Opened"
                      stroke="#B72B49"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#B72B49' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="closed"
                      name="Bugs Closed"
                      stroke="#8BEA70"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#8BEA70' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-4 sm:p-6">
            <h3 className="text-lg font-semibold">Recent Test Runs</h3>
            <p className="text-sm text-muted-foreground mb-4">
              An overview of your recent test case executions by application.
            </p>
            <Accordion type="multiple" className="w-full">
              {testRunsByApp.map((app) => (
                <AccordionItem value={app.appName} key={app.appName}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-4">
                      <FolderKanban className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{app.appName}</span>
                      <Badge variant="outline">{app.tests.length} tests</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b-white/10">
                          <TableHead>Test ID</TableHead>
                          <TableHead>User Story ID</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Progress</TableHead>
                          <TableHead>Jira Link</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {app.tests.map((run) => (
                          <TableRow key={run.id} className="border-b-0">
                            <TableCell className="font-medium">{run.id}</TableCell>
                            <TableCell>{run.userStoryId}</TableCell>
                            <TableCell>
                              <Badge
                                style={{
                                  backgroundColor: run.status === 'Passed' ? '#8BEA70' : run.status === 'Failed' ? '#B72B49' : run.status === 'Pending' ? '#f97316' : undefined,
                                  color: run.status === 'Passed' ? 'black' : 'white',
                                }}
                                className={cn({
                                  'bg-secondary text-secondary-foreground hover:bg-secondary/80': run.status === 'Running'
                                })}
                              >
                                {run.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{run.progress}%</TableCell>
                            <TableCell>
                              {run.jiraLink ? (
                                <a href={run.jiraLink} target="_blank" rel="noopener noreferrer" className='flex items-center gap-1.5 text-blue-400 hover:text-blue-300 hover:underline'>
                                  <LinkIcon className="h-4 w-4" />
                                  <span>Open Ticket</span>
                                </a>
                              ) : (
                                <span className='text-muted-foreground'>-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
