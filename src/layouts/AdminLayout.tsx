import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  ReceiptIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const sidebarLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
    { to: '/admin/usuarios', icon: UsersIcon, label: 'Usuarios' },
    { to: '/admin/cursos', icon: BookOpenIcon, label: 'Promociones y Cursos' },
    { to: '/admin/matriculas', icon: ClipboardListIcon, label: 'Matrículas' },
    { to: '/admin/vouchers', icon: ReceiptIcon, label: 'Vouchers' },
    { to: '/admin/reportes', icon: FileTextIcon, label: 'Reportes' },
    ...(isAdmin ? [{ to: '/admin/importar', icon: FileSpreadsheetIcon, label: 'Importar Alumnos' }] : []),
  ];

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
