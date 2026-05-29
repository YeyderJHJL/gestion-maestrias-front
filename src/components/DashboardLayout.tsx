import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LucideIcon } from 'lucide-react';

interface SidebarLink {
  to: string;
  icon: LucideIcon;
  label: string;
  dividerAfter?: boolean;
}

interface DashboardLayoutProps {
  sidebarLinks: SidebarLink[];
  children: React.ReactNode;
}

export function DashboardLayout({ sidebarLinks, children }: DashboardLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-[#F4F3F0]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar links={sidebarLinks} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}