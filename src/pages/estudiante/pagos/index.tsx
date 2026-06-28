import { Fragment, useState } from 'react';
import { EstudianteLayout } from '../../../layouts/EstudianteLayout';
import { StatusBadge } from '../../../components/StatusBadge';
import { FileUpload } from '../../../components/FileUpload';
import { Modal } from '../../../components/Modal';
import { Toast } from '../../../components/Toast';
import { ChevronDownIcon, CheckCircleIcon, Loader2Icon, ImageIcon, InfoIcon } from 'lucide-react';
import { usePagos } from './hooks/usePagos';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const STATE_VARIANT: Record<string, string> = {
  UPLOADED: 'pendiente',
  VALIDATED: 'validado',
  OBSERVED: 'observado',
  REJECTED: 'rechazado',
};

const STATE_LABEL: Record<string, string> = {
  UPLOADED: 'Pendiente de validación',
  VALIDATED: 'Validado',
  OBSERVED: 'Observado',
  REJECTED: 'Rechazado',
};

export function EstudiantePagos() {
  const {
    payments, loading, error,
    form, setForm, submitting, submitted, formError,
    handleSubmit, resetForm, vouchersForPayment,
    toast, setToast,
  } = usePagos();

  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        <div className="border-b-2 border-accent pb-3">
          <h1 className="text-3xl font-serif font-bold text-text">Pagos y Vouchers</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-serif font-bold text-text">Mis pagos y vouchers</h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
                <Loader2Icon className="w-5 h-5 animate-spin" />
                <span>Cargando pagos...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-accent text-sm">{error}</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-text-muted text-sm">No tienes pagos registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-alt">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Concepto</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado voucher</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map((payment, index) => {
                      const paymentVouchers = vouchersForPayment(payment.id);
                      const latestVoucher = paymentVouchers[0];
                      const stateCode = payment.latestVoucherStateCode;
                      const hasObservation = latestVoucher?.observation && (stateCode === 'OBSERVED' || stateCode === 'REJECTED');

                      return (
                        <Fragment key={payment.id}>
                          <tr className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                            <td className="px-6 py-4 text-sm text-text font-medium">
                              {payment.concept || `Pago #${payment.paymentNumber}`}
                            </td>
                            <td className="px-6 py-4 text-sm text-text">
                              S/ {payment.amount?.toFixed(2) ?? '—'}
                            </td>
                            <td className="px-6 py-4 text-sm text-text-muted">
                              {payment.paymentDate ? formatDate(payment.paymentDate) : '—'}
                            </td>
                            <td className="px-6 py-4">
                              {stateCode ? (
                                <StatusBadge variant={(STATE_VARIANT[stateCode] ?? 'pendiente') as 'validado' | 'observado' | 'rechazado' | 'pendiente'}>
                                  {STATE_LABEL[stateCode] ?? stateCode}
                                </StatusBadge>
                              ) : (
                                <span className="text-sm text-text-muted italic">Sin voucher</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {hasObservation && (
                                <button
                                  onClick={() => setExpandedRow(expandedRow === payment.id ? null : payment.id)}
                                  className="text-accent hover:text-accent-light transition-colors"
                                >
                                  <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedRow === payment.id ? 'rotate-180' : ''}`} />
                                </button>
                              )}
                            </td>
                          </tr>
                          {expandedRow === payment.id && latestVoucher?.observation && (
                            <tr>
                              <td colSpan={5} className="px-6 py-4 bg-accent/10">
                                <div className="text-sm">
                                  <p className="font-semibold text-accent mb-1">
                                    {stateCode === 'OBSERVED' ? 'Motivo de observación:' : 'Motivo de rechazo:'}
                                  </p>
                                  <p className="text-text">{latestVoucher.observation}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-surface border-t-4 border-accent rounded-lg p-6 shadow-sm h-fit">
            {!submitted ? (
              <div className="space-y-6">
                <h2 className="text-lg font-serif font-bold text-text">Adjuntar comprobante de pago</h2>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text">¿A qué pago corresponde? *</label>
                  <select
                    value={form.paymentId}
                    onChange={(e) => setForm({ ...form, paymentId: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Seleccionar...</option>
                    {payments.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.concept || `Pago #${p.paymentNumber}`} — S/ {p.amount?.toFixed(2) ?? '0.00'}
                      </option>
                    ))}
                  </select>
                </div>

                <FileUpload
                  onFileSelect={(file) => setForm((prev) => ({ ...prev, file }))}
                  acceptedFormats=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={20}
                  label="Arrastra el comprobante aquí o haz clic para seleccionar"
                />

                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-light transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                  Ver guía de pago
                </button>

                {formError && (
                  <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
                    {formError}
                  </p>
                )}

                <button
                  type="button"
                  disabled={submitting || !form.paymentId || !form.file}
                  onClick={handleSubmit}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Enviando...' : 'Enviar voucher'}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 py-8">
                <CheckCircleIcon className="w-16 h-16 text-success mx-auto" />
                <h3 className="text-lg font-semibold text-text">Voucher enviado correctamente</h3>
                <p className="text-text-muted">Estado actual: Pendiente de validación</p>
                <p className="text-sm text-text-muted">Recibirás una notificación cuando sea revisado.</p>
                <button onClick={resetForm} className="text-primary hover:text-primary-light font-medium text-sm">
                  Enviar otro voucher
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={guideOpen} onClose={() => setGuideOpen(false)} title="Guía de pago" size="lg">
        <p className="text-sm text-text-muted mb-4">
          Asegúrate de que tu comprobante sea legible y muestre claramente el monto, fecha y número de operación.
        </p>
        <div className="rounded-lg border border-border bg-surface-alt overflow-hidden">
          <img src="/img/Guia_pagos.jpg.jpeg" alt="Guía de pago por banca y Yape" className="w-full object-contain" />
        </div>
        <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
          <InfoIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-text">
            <strong>Pago por agente:</strong> Brinda tu código de pago al agente.
            El comprobante que recibas debe mostrar tus datos y el monto pagado.
            Tómale una foto clara y súbela como voucher.
          </p>
        </div>
      </Modal>

      <Toast
        variant={toast.variant}
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </EstudianteLayout>
  );
}
