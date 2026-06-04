import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';
import { VoucherResponse } from '../../../types/voucher';

type Decision = 'validar' | 'observar' | 'rechazar';

interface VoucherReviewDrawerProps {
  voucher: VoucherResponse | null;
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

export function VoucherReviewDrawer({
  voucher,
  decision,
  setDecision,
  motivo,
  setMotivo,
  submitting,
  isCoordinator,
  onClose,
  onConfirm,
}: VoucherReviewDrawerProps) {
  return (
    <AnimatePresence>
      {voucher && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-surface shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-text">Revisar voucher</h2>
                <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              {/*
                TODO: renderizar fileUrl cuando el backend defina cómo sirve el archivo.
                - Signed URL (GCS directo):
                    const isPdf = voucher.fileUrl.toLowerCase().includes('.pdf');
                    isPdf
                      ? <iframe src={voucher.fileUrl} className="w-full h-[280px] rounded-lg border border-border" />
                      : <img src={voucher.fileUrl} alt="Voucher" className="w-full h-[280px] object-contain rounded-lg border border-border" />
                - Proxy backend (requiere JWT):
                    usar useEffect para fetch(voucher.fileUrl, { headers: { Authorization: `Bearer ${token}` } })
                    → .blob() → URL.createObjectURL(blob) → guardar en estado local → usar como src
              */}
              <div className="h-[280px] bg-surface-alt rounded-lg flex items-center justify-center border border-border">
                <p className="text-text-muted">Vista previa del voucher</p>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Estudiante</p>
                  <p className="text-sm font-medium text-text">{voucher.studentName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Código de pago</p>
                  <p className="text-sm font-medium text-text">{voucher.studentPaymentCode}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Monto declarado</p>
                  <p className="text-sm font-medium text-text">{formatCurrency(voucher.declaredAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Fecha subida</p>
                  <p className="text-sm font-medium text-text">{formatDate(voucher.uploadedAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-text-muted mb-1">Pago asociado</p>
                  <p className="text-sm font-medium text-text">{voucher.concept}</p>
                </div>
                {voucher.observation && (
                  <div className="col-span-2">
                    <p className="text-xs text-text-muted mb-1">Observación previa</p>
                    <p className="text-sm text-text">{voucher.observation}</p>
                  </div>
                )}
              </div>

              {/* Decision */}
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-text mb-4">Decisión</p>

                <div className="space-y-3">
                  <button
                    disabled={isCoordinator}
                    onClick={() => setDecision('validar')}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      isCoordinator
                        ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt'
                        : decision === 'validar'
                        ? 'bg-success text-white'
                        : 'border border-success text-success hover:bg-success/10'
                    }`}
                  >
                    <CheckIcon className="w-5 h-5" />
                    Validar
                  </button>

                  <button
                    disabled={isCoordinator}
                    onClick={() => setDecision('observar')}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      isCoordinator
                        ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt'
                        : decision === 'observar'
                        ? 'bg-warning text-white'
                        : 'border border-warning text-warning hover:bg-warning/10'
                    }`}
                  >
                    <AlertTriangleIcon className="w-5 h-5" />
                    Observar
                  </button>

                  <button
                    disabled={isCoordinator}
                    onClick={() => setDecision('rechazar')}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                      isCoordinator
                        ? 'opacity-50 cursor-not-allowed border border-border text-text-muted bg-surface-alt'
                        : decision === 'rechazar'
                        ? 'bg-accent text-white'
                        : 'border border-accent text-accent hover:bg-accent/10'
                    }`}
                  >
                    <XIcon className="w-5 h-5" />
                    Rechazar
                  </button>
                </div>

                {(decision === 'observar' || decision === 'rechazar') && (
                  <div className="mt-4 space-y-2">
                    <label className="block text-sm font-medium text-text">
                      Motivo <span className="text-accent">*</span>
                    </label>
                    <textarea
                      disabled={isCoordinator}
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Describe el motivo de observación o rechazo"
                      rows={4}
                      className={`w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        isCoordinator ? 'bg-surface-alt text-text-muted cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                )}

                <button
                  disabled={
                    isCoordinator ||
                    !decision ||
                    submitting ||
                    ((decision === 'observar' || decision === 'rechazar') && !motivo)
                  }
                  onClick={onConfirm}
                  className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Guardando...' : 'Confirmar decisión'}
                </button>

                <p className="text-xs text-text-muted text-center mt-4">
                  Se registrará: usuario validador + fecha y hora
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
