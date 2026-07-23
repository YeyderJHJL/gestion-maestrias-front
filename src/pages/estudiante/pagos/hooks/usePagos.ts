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
    if (!token || form.paymentIds.length === 0 || !form.operationNumber.trim() || !form.file) return;
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
