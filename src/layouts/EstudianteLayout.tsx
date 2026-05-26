import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  ClipboardListIcon,
  FileTextIcon,
  ReceiptIcon,
  FolderIcon,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/estudiante/matricula', icon: ClipboardListIcon, label: 'Mi Matrícula' },
  { to: '/estudiante/notas', icon: FileTextIcon, label: 'Mis Notas' },
  { to: '/estudiante/pagos', icon: ReceiptIcon, label: 'Pagos y Vouchers' },
  { to: '/estudiante/historial', icon: FolderIcon, label: 'Historial Académico' },
];

interface EstudianteLayoutProps {
  children: React.ReactNode;
}

export function EstudianteLayout({ children }: EstudianteLayoutProps) {
  return (
    <DashboardLayout
      userName="Juan Carlos Pérez"
      userRole="Estudiante de Maestría"
      sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
