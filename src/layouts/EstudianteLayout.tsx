import { DashboardLayout } from '../components/DashboardLayout';
import {
  ClipboardListIcon,
  FileTextIcon,
  ReceiptIcon,
  FolderIcon,
  LayoutDashboardIcon,
} from 'lucide-react';

const sidebarLinks = [
  { to: '/estudiante/dashboard', icon: LayoutDashboardIcon, label: 'Dashboard' },
  { to: '/estudiante/matricula', icon: ClipboardListIcon, label: 'Mi Matrícula' },
  { to: '/estudiante/notas', icon: FileTextIcon, label: 'Mis Notas' },
  { to: '/estudiante/pagos', icon: ReceiptIcon, label: 'Pagos y Vouchers' },
  { to: '/estudiante/historial', icon: FolderIcon, label: 'Historial Académico' },
];

interface EstudianteLayoutProps {
  children: React.ReactNode;
}

import { useAuth } from '../context/AuthContext';

export function EstudianteLayout({ children }: EstudianteLayoutProps) {
  const { user } = useAuth();
  const paymentCode = user?.paymentCode;

  return (
    <DashboardLayout sidebarLinks={sidebarLinks}>
      {paymentCode && (
        <div className="bg-primary/10 border border-primary text-text px-4 py-3 rounded-lg shadow-sm mb-6 flex justify-between items-center">
          <div>
            <span className="font-semibold text-primary">Código de Pago:</span>{' '}
            <span className="font-mono text-lg font-bold ml-2">{paymentCode}</span>
          </div>
          <p className="text-sm text-text-muted">
            Usa este código para realizar tus pagos
          </p>
        </div>
      )}
      {children}
    </DashboardLayout>
  );
}
