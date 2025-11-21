'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarLink } from '@/types';

const sidebarLinks: SidebarLink[] = [
  {
    id: '1',
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
  },
  {
    id: '2',
    label: 'Users',
    href: '/dashboard/users',
    icon: '👥',
  },
  {
    id: '3',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: '📈',
  },
  {
    id: '4',
    label: 'Reports',
    href: '/dashboard/reports',
    icon: '📄',
  },
  {
    id: '5',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: '⚙️',
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar links={sidebarLinks} logo={<div className="font-bold text-lg">🏛️ Varanasi</div>} />

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <Header title="Dashboard" />

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
