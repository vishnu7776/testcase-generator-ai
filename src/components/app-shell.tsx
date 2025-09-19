
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { FileText, LayoutGrid, TestTube, AppWindow } from 'lucide-react';
import Link from 'next/link';

const sidebarNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    href: '/',
  },
  {
    id: 'requirements',
    label: 'Requirements',
    icon: FileText,
    href: '/requirements',
  },
  {
    id: 'scenarios',
    label: 'Scenarios',
    icon: TestTube,
    href: '/scenarios',
  },
  {
    id: 'products',
    label: 'Products',
    icon: AppWindow,
    href: '/products',
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-sidebar-primary" />
            <span className="text-lg font-semibold">CertiTest AI</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarNavItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}
