import React from 'react';
import { Navbar } from '../components/Navbar';

interface DocenteLayoutProps {
  children: React.ReactNode;
}

export function DocenteLayout({ children }: DocenteLayoutProps) {
  return (
    <div className="h-full flex flex-col bg-[#F4F3F0]">
      <Navbar />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
