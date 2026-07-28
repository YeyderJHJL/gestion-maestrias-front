import { XIcon, CheckIcon, AlertTriangleIcon, Loader2Icon } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { VoucherResponse, voucherConceptSummary } from '../../../types/voucher';
import { PaymentResponse } from '../../../services/paymentsApiService';
import { useFilePreview } from '../../../hooks/useFilePreview';

type Decision = 'validar' | 'observar' | 'rechazar';

interface VoucherReviewModalProps {
  voucher: VoucherResponse | null;
  unvalidatedPreviousPayments: PaymentResponse[];
  checkedPaymentIds: Set<string>;
  onTogglePayment: (paymentId: string) => void;
  decision: Decision | null;
  setDecision: (d: Decision | null) => void;
  motivo: string;
  setMotivo: (m: string) => void;
  submitting: boolean;
  isCoordinator: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatCurrency = (amount: number) => `S/ ${amount.toFixed(2)}`;

export function VoucherReviewModal({
  voucher,
  unvalidatedPreviousPayments,
  checkedPaymentIds,
  onTogglePayment,
  decision,
  setDecision,
  motivo,
  setMotivo,
  submitting,
  isCoordinator,
  onClose,
  onConfirm,
}: VoucherReviewModalProps) {
  const { previewUrl, isPdf, loading: previewLoading } = useFilePreview(
    voucher?.file.id ?? null,
    voucher !== null
  );

  const isChecklistEditable = decision === 'validar';
  const hasUnvalidatedPreviousPayments = unvalidatedPreviousPayments.length > 0;
  const confirmDisabled =
    isCoordinator ||
    !decision ||
    submitting ||
    ((decision === 'observar' || decision === 'rechazar') && !motivo) ||
    (decision === 'validar' && (checkedPaymentIds.size === 0 || hasUnvalidatedPreviousPayments));

  return (
    <Modal
      isOpen={voucher !== null}
      onClose={onClose}
      title="Revisar voucher"
      size="xl"
    >
      {voucher && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          <div className="md:col-span-3">
            <div className="rounded-lg border border-border overflow-hidden bg-surface-alt" style={{ minHeight: '480px' }}>
              {previewLoading ? (
                <div className="w-full h-full flex items-center justify-center gap-2 text-text-muted" style={{ minHeight: '480px' }}>
                  <Loader2Icon className="w-6 h-6 animate-spin" />
                  <span className="text-sm">Cargando vista previa...</span>
                </div>
              ) : previewUrl ? (
                isPdf ? (
                  <iframe src={previewUrl} className="w-full" style={{ minHeight: '480px' }} title="Vista previa del voucher" />
                ) : (
                  <img src={previewUrl} alt="Voucher" className="w-full object-contain" style={{ maxHeight: '600px' }} />
                )
              ) : (
                <div className="w-full flex items-center justify-center" style={{ minHeight: '480px' }}>
                  <p className="text-text-muted text-sm">No se pudo cargar la vista previa</p>
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted mt-2">
              {voucher.file.originalName} · {(voucher.file.sizeBytes / 1024).toFixed(0)} KB
            </p>
          </div>

          {/* Columna derecha — Datos + Decisión (2/5) */}
          <div className="md:col-span-2 space-y-5">
            {/* Info del estudiante */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Estudiante</p>
                <p className="text-sm font-medium text-text">{voucher.studentName}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">DNI</p>
                  <p className="text-sm font-medium text-text">{voucher.studentDni ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">CUI</p>
                  <p className="text-sm font-medium text-text">{voucher.studentCui}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Código de pago</p>
                <p className="text-sm font-medium text-text">{voucher.studentPaymentCode}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-text-muted mb-1">Monto declarado</p>
                  <p className="text-sm font-medium text-text">{formatCurrency(voucher.declaredAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Fecha subida</p>
                  <p className="text-sm font-medium text-text">{formatDate(voucher.createdAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">N° de operación</p>
                <p className="text-sm font-medium text-text">{voucher.operationNumber}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Concepto</p>
                <p className="text-sm font-medium text-text">{voucherConceptSummary(voucher)}</p>
              </div>
              {voucher.observation && (
                <div className="px-3 py-2 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="text-xs text-text-muted mb-1">Observación previa</p>
                  <p className="text-sm text-text">{voucher.observation}</p>
                </div>
              )}
            </div>

            {/* Cuotas incluidas */}
            <div className="border-t border-border pt-4 space-y-2">
              <p className="text-sm font-medium text-text">Cuotas incluidas</p>
              {isChecklistEditable && (
                <p className="text-xs text-text-muted">
                  Desmarca la(s) cuota(s) que no corresponda validar — quedarán sin voucher vinculado.
                </p>
              )}
              <div className="space-y-1.5">
                {voucher.payments.map((payment) => (
                  <label
                    key={payment.paymentId}
                    className={`flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm ${
                      isChecklistEditable ? 'cursor-pointer hover:bg-surface-alt' : ''
                    }`}
                  >
                    {isChecklistEditable ? (
                      <input
                        type="checkbox"
                        checked={checkedPaymentIds.has(payment.paymentId)}
                        onChange={() => onTogglePayment(payment.paymentId)}
                        className="w-4 h-4"
                      />
                    ) : (
                      <CheckIcon className="w-4 h-4 text-text-muted" />
                    )}
                    <span className="flex-1 text-text">
                      N° {payment.paymentNumber} — {payment.paymentConcept ?? 'Sin concepto'}
                    </span>
                    <span className="text-text-muted">
                      {payment.paymentAmount != null ? formatCurrency(payment.paymentAmount) : '—'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Decisión */}
            <div className="border-t border-border pt-4 space-y-3">
              <p className="text-sm font-medium text-text">Decisión</p>

              <button
                disabled={isCoordinator || hasUnvalidatedPreviousPayments}
                onClick={() => setDecision('validar')}
                title={hasUnvalidatedPreviousPayments ? 'No puede validar: hay pagos anteriores sin validar' : undefined}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  isCoordinator || hasUnvalidatedPreviousPayments
                    ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt'
                    : decision === 'validar'
                    ? 'bg-success text-white'
                    : 'border border-success text-success hover:bg-success/10'
                }`}
              >
                <CheckIcon className="w-4 h-4" />
                Validar
              </button>

              {hasUnvalidatedPreviousPayments && (
                <p className="text-xs text-accent bg-accent/10 border border-accent/30 rounded-lg px-3 py-2">
                  No puede validar este voucher: el/los pago(s) N°{' '}
                  {unvalidatedPreviousPayments.map((p) => p.paymentNumber).join(', N°')} de este estudiante
                  aún no está(n) validado(s).
                </p>
              )}

              <button
                disabled={isCoordinator}
                onClick={() => setDecision('observar')}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  isCoordinator
                    ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt'
                    : decision === 'observar'
                    ? 'bg-warning text-white'
                    : 'border border-warning text-warning hover:bg-warning/10'
                }`}
              >
                <AlertTriangleIcon className="w-4 h-4" />
                Observar
              </button>

              <button
                disabled={isCoordinator}
                onClick={() => setDecision('rechazar')}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  isCoordinator
                    ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt'
                    : decision === 'rechazar'
                    ? 'bg-accent text-white'
                    : 'border border-accent text-accent hover:bg-accent/10'
                }`}
              >
                <XIcon className="w-4 h-4" />
                Rechazar
              </button>

              {(decision === 'observar' || decision === 'rechazar') && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text">
                    Motivo <span className="text-accent">*</span>
                  </label>
                  <textarea
                    disabled={isCoordinator}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Describe el motivo"
                    rows={3}
                    className={`w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      isCoordinator ? 'bg-surface-alt text-text-muted cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              )}

              <button
                disabled={confirmDisabled}
                onClick={onConfirm}
                className="w-full px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                {submitting ? 'Guardando...' : 'Confirmar decisión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
