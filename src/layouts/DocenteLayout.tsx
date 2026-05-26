import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { BookOpenIcon } from 'lucide-react';

const sidebarLinks = [
  { to: '/docente/dashboard', icon: BookOpenIcon, label: 'Mis Cursos' },
  { to: '/docente/historial', icon: BookOpenIcon, label: 'Historial de cursos' },
];

interface DocenteLayoutProps {
  children: React.ReactNode;
}

export function DocenteLayout({ children }: DocenteLayoutProps) {
  return (
    <DashboardLayout
      userName="Dr. Carlos Mendoza"
      userRole="Docente"
      sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
