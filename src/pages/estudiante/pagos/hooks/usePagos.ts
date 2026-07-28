import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { ApiError } from '../../../../services/api';
import { VOUCHER_STATE } from '../../../../constants/stateIds';
import { listMyPayments, PaymentResponse } from '../../../../services/paymentsApiService';
import { listMyVouchers, createVoucher } from '../../../../services/vouchersApiService';
import { uploadVoucher } from '../../../../services/filesApiService';
import { VoucherResponse } from '../../../../types/voucher';

export type VoucherFormState = {
  paymentIds: string[];
  operationNumber: string;
  file: File | null;
};

const EMPTY_FORM: VoucherFormState = {
  paymentIds: [],
  operationNumber: '',
  file: null,
};

export function usePagos() {
  const { token } = useAuth();

  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<VoucherFormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) =>
    setToast({ visible: true, variant, message });

  const loadData = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    Promise.all([listMyPayments(token), listMyVouchers(token)])
      .then(([p, v]) => { setPayments(p); setVouchers(v); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const vouchersForPayment = (paymentId: string) =>
    vouchers.filter((v) => v.payments.some((p) => p.paymentId === paymentId));

  // Solo tiene sentido pagar cuotas que todavía no fueron validadas
  const selectablePayments = payments.filter((p) => p.latestVoucherStateCode !== 'VALIDATED');

  // Devuelve el N° de la cuota anterior que bloquea a `payment` (nunca se subió comprobante y no está
  // incluida en la selección actual), o null si no hay ningún hueco antes de esta cuota.
  const blockingPaymentNumber = (payment: PaymentResponse): number | null => {
    const blockers = payments.filter(
      (p) =>
        p.paymentNumber < payment.paymentNumber &&
        p.latestVoucherStateCode === null &&
        !form.paymentIds.includes(p.id)
    );
    if (blockers.length === 0) return null;
    return Math.min(...blockers.map((p) => p.paymentNumber));
  };

  const blockedSelection = selectablePayments.find(
    (p) => form.paymentIds.includes(p.id) && blockingPaymentNumber(p) !== null
  );

  const togglePaymentSelection = (paymentId: string) => {
    setForm((prev) => ({
      ...prev,
      paymentIds: prev.paymentIds.includes(paymentId)
        ? prev.paymentIds.filter((id) => id !== paymentId)
        : [...prev.paymentIds, paymentId],
    }));
  };

  const selectedTotal = selectablePayments
    .filter((p) => form.paymentIds.includes(p.id))
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const handleSubmit = async () => {
    if (!token || form.paymentIds.length === 0 || !form.operationNumber.trim() || !form.file || blockedSelection) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const uploaded = await uploadVoucher(token, form.file);

      await createVoucher(token, {
        declaredAmount: selectedTotal,
        payments: form.paymentIds.map((id) => ({ paymentId: id })),
        stateId: VOUCHER_STATE.UPLOADED,
        fileId: uploaded.id,
        operationNumber: form.operationNumber.trim(),
      });
      setSubmitted(true);
      setForm(EMPTY_FORM);
      showToast('success', 'Voucher enviado correctamente.');
      loadData();
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Error al enviar el voucher.');
      showToast('error', e instanceof ApiError ? e.message : 'Error al enviar el voucher.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setForm(EMPTY_FORM);
    setFormError(null);
  };

  return {
    payments,
    vouchers,
    loading,
    error,
    form,
    setForm,
    selectablePayments,
    blockingPaymentNumber,
    blockedSelection,
    togglePaymentSelection,
    selectedTotal,
    submitting,
    submitted,
    formError,
    handleSubmit,
    resetForm,
    vouchersForPayment,
    toast,
    setToast,
  };
}
