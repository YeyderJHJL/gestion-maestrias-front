import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ApiError } from '../../services/api';
import { VOUCHER_STATE } from '../../constants/stateIds';
import { listMyPayments, PaymentResponse } from '../../services/paymentsApiService';
import { listMyVouchers, createVoucher } from '../../services/vouchersApiService';
import { uploadVoucher } from '../../services/filesApiService';
import { VoucherResponse } from '../../types/voucher';

export type VoucherFormState = {
  paymentId: string;
  file: File | null;
};

const EMPTY_FORM: VoucherFormState = {
  paymentId: '',
  file: null,
};

export function useEstudiantePagos() {
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
    vouchers.filter((v) => v.paymentId === paymentId);

  const handleSubmit = async () => {
    if (!token || !form.paymentId || !form.file) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const uploaded = await uploadVoucher(token, form.file);

      await createVoucher(token, {
        paymentId: form.paymentId,
        stateId: VOUCHER_STATE.UPLOADED,
        fileId: uploaded.id,
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