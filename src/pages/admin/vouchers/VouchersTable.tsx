import { SearchIcon, EyeIcon, CheckIcon, Trash2Icon } from 'lucide-react';
import { StatusBadge } from '../../../components/StatusBadge';
import { EmptyState } from '../../../components/EmptyState';
import { IconButton } from '../../../components/IconButton';
import { VoucherResponse, VoucherStateCode } from '../../../types/voucher';

interface VouchersTableProps {
  vouchers: VoucherResponse[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  stateFilter: VoucherStateCode | '';
  onStateFilterChange: (value: VoucherStateCode | '') => void;
  onSelectVoucher: (voucher: VoucherResponse) => void;
  onDeleteVoucher: (voucher: VoucherResponse) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatCurrency = (amount: number) => `S/ ${amount.toFixed(2)}`;

const STATE_LABEL: Record<string, string> = {
  UPLOADED: 'Pendiente',
  VALIDATED: 'Validado',
  OBSERVED: 'Observado',
  REJECTED: 'Rechazado',
};

const conceptSummary = (voucher: VoucherResponse) => {
  if (voucher.payments.length === 1) {
    return voucher.payments[0].paymentConcept ?? '—';
  }
  const numbers = voucher.payments.map((p) => p.paymentNumber).join(', N°');
  return `${voucher.payments.length} cuotas (N°${numbers})`;
};

export function VouchersTable({
  vouchers,
  loading,
  error,
  search,
  onSearchChange,
  stateFilter,
  onStateFilterChange,
  onSelectVoucher,
  onDeleteVoucher,
}: VouchersTableProps) {
  return (
    <div>
      {/* Barra de búsqueda y filtro de estado */}
      <div className="bg-surface border border-border rounded-lg p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por DNI o CUI..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => onStateFilterChange(e.target.value as VoucherStateCode | '')}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          <option value="UPLOADED">Pendiente</option>
          <option value="VALIDATED">Validado</option>
          <option value="OBSERVED">Observado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>

      {/* Contenido */}
      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden mt-4">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-accent text-sm">{error}</p>
          </div>
        ) : vouchers.length === 0 ? (
          <EmptyState
            icon={SearchIcon}
            title="No se encontraron vouchers"
            subtitle={search || stateFilter ? 'Intenta ajustar los filtros de búsqueda.' : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estudiante</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Concepto</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Monto declarado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">N° operación</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Fecha de subida</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Archivo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vouchers.map((voucher, index) => (
                  <tr key={voucher.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                    <td className="px-6 py-4 text-sm text-text font-medium">
                      {voucher.studentName}
                      <div className="text-xs text-text-muted font-normal">
                        DNI {voucher.studentDni ?? '—'} · CUI {voucher.studentCui}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text">{conceptSummary(voucher)}</td>
                    <td className="px-6 py-4 text-sm text-text">{formatCurrency(voucher.declaredAmount)}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{voucher.operationNumber}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(voucher.createdAt)}</td>
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
                          'en-revision'
                        }
                      >
                        {STATE_LABEL[voucher.stateCode]}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <IconButton
                          icon={CheckIcon}
                          onClick={() => onSelectVoucher(voucher)}
                          title="Revisar voucher"
                          variant="success"
                        />
                        <IconButton
                          icon={Trash2Icon}
                          onClick={() => onDeleteVoucher(voucher)}
                          title="Eliminar voucher"
                          variant="accent"
                        />
                      </div>
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
