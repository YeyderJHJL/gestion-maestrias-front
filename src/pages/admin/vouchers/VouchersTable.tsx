import { motion } from 'framer-motion';
import { EyeIcon } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { VoucherResponse } from '../../../types/voucher';

type ActiveTab = 'pendientes' | 'validados' | 'observados' | 'rechazados';

interface Tab {
  key: ActiveTab;
  label: string;
  count: number;
}

interface VouchersTableProps {
  vouchers: VoucherResponse[];
  loading: boolean;
  error: string | null;
  activeTab: ActiveTab;
  tabs: Tab[];
  onTabChange: (tab: ActiveTab) => void;
  onSelectVoucher: (voucher: VoucherResponse) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatCurrency = (amount: number) => `S/ ${amount.toFixed(2)}`;

const STATE_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  VALIDATED: 'Validado',
  OBSERVED: 'Observado',
  REJECTED: 'Rechazado',
};

export function VouchersTable({
  vouchers,
  loading,
  error,
  activeTab,
  tabs,
  onTabChange,
  onSelectVoucher,
}: VouchersTableProps) {
  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === tab.key ? 'text-accent' : 'text-text-muted hover:text-text'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeTab === tab.key && tab.key === 'pendientes'
                      ? 'bg-warning text-white'
                      : 'bg-surface-alt text-text-muted'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface border border-t-0 border-border rounded-b-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-accent text-sm">{error}</p>
          </div>
        ) : vouchers.length === 0 ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-text-muted text-sm">No hay vouchers en esta categoría.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estudiante</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Concepto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Monto declarado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Fecha de subida</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Archivo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vouchers.map((voucher, index) => (
                  <tr key={voucher.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                    <td className="px-6 py-4 text-sm text-text font-medium">{voucher.studentName}</td>
                    <td className="px-6 py-4 text-sm text-text">{voucher.concept}</td>
                    <td className="px-6 py-4 text-sm text-text">{formatCurrency(voucher.declaredAmount)}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(voucher.uploadedAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onSelectVoucher(voucher)}
                        className="text-primary hover:text-primary-light transition-colors"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        variant={
                          voucher.stateCode === 'VALIDATED' ? 'validado' :
                          voucher.stateCode === 'OBSERVED'  ? 'observado' :
                          voucher.stateCode === 'REJECTED'  ? 'rechazado' :
                          'pendiente'
                        }
                      >
                        {STATE_LABEL[voucher.stateCode]}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onSelectVoucher(voucher)}
                        className="px-3 py-1 text-sm border border-primary text-primary rounded hover:bg-primary/5 transition-colors"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
