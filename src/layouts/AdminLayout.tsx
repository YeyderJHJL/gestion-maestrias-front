import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardListIcon,
  ReceiptIcon,
  FileTextIcon,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
  { to: '/admin/usuarios', icon: UsersIcon, label: 'Usuarios' },
  { to: '/admin/cursos', icon: BookOpenIcon, label: 'Promociones y Cursos' },
  { to: '/admin/matriculas', icon: ClipboardListIcon, label: 'Matrículas' },
  { to: '/admin/vouchers', icon: ReceiptIcon, label: 'Vouchers' },
  { to: '/admin/reportes', icon: FileTextIcon, label: 'Reportes' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      {children}
    </DashboardLayout>
  );
}
