import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../services/api';
import { VOUCHER_STATE } from '../../../constants/stateIds';
import { listVouchers, updateVoucher } from '../../../services/vouchersApiService';
import { VoucherResponse, VoucherStateCode } from '../../../types/voucher';

type Decision = 'validar' | 'observar' | 'rechazar';

const DECISION_TO_STATE: Record<Decision, { code: VoucherStateCode; id: number }> = {
  validar:  { code: 'VALIDATED', id: VOUCHER_STATE.VALIDATED },
  observar: { code: 'OBSERVED',  id: VOUCHER_STATE.OBSERVED },
  rechazar: { code: 'REJECTED',  id: VOUCHER_STATE.REJECTED },
};

export function useAdminVouchers() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'COORDINATOR';

  const [allVouchers, setAllVouchers] = useState<VoucherResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<VoucherStateCode | ''>('');

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse | null>(null);
  const [checkedPaymentIds, setCheckedPaymentIds] = useState<Set<string>>(new Set());
  const [decision, setDecision] = useState<Decision | null>(null);
  const [motivo, setMotivo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    variant: 'success' | 'error';
    message: string;
  }>({ visible: false, variant: 'success', message: '' });

  const showToast = (variant: 'success' | 'error', message: string) => {
    setToast({ visible: true, variant, message });
  };

  const closeToast = () => setToast((t) => ({ ...t, visible: false }));

  // Debounce de la búsqueda antes de pegarle al backend
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const loadVouchers = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listVouchers(token, debouncedSearch || undefined)
      .then(setAllVouchers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, debouncedSearch]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const vouchers = allVouchers.filter((v) => !stateFilter || v.stateCode === stateFilter);

  const openReview = (voucher: VoucherResponse) => {
    setSelectedVoucher(voucher);
    setCheckedPaymentIds(new Set(voucher.payments.map((p) => p.paymentId)));
  };

  const togglePayment = (paymentId: string) => {
    setCheckedPaymentIds((prev) => {
      const next = new Set(prev);
      if (next.has(paymentId)) next.delete(paymentId);
      else next.add(paymentId);
      return next;
    });
  };

  const closeDrawer = () => {
    setSelectedVoucher(null);
    setCheckedPaymentIds(new Set());
    setDecision(null);
    setMotivo('');
  };

  const handleReview = async () => {
    if (!token || !selectedVoucher || !decision) return;
    setSubmitting(true);
    try {
      const target = DECISION_TO_STATE[decision];
      const includedPayments = decision === 'validar'
        ? selectedVoucher.payments.filter((p) => checkedPaymentIds.has(p.paymentId))
        : selectedVoucher.payments;
      const declaredAmount = includedPayments.reduce((sum, p) => sum + (p.paymentAmount ?? 0), 0);

      const updated = await updateVoucher(token, selectedVoucher.id, {
        declaredAmount,
        payments: includedPayments.map((p) => ({ paymentId: p.paymentId })),
        stateId: target.id,
        fileId: selectedVoucher.file.id,
        observation: motivo || undefined,
        operationNumber: selectedVoucher.operationNumber,
      });
      setAllVouchers((prev) => prev.map((v) => v.id === updated.id ? updated : v));
      showToast('success', 'Decisión registrada correctamente.');
      closeDrawer();
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al registrar la decisión.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    vouchers,
    loading,
    error,
    search,
    setSearch,
    stateFilter,
    setStateFilter,
    selectedVoucher,
    openReview,
    checkedPaymentIds,
    togglePayment,
    decision,
    setDecision,
    motivo,
    setMotivo,
    submitting,
    isCoordinator,
    handleReview,
    closeDrawer,
    toast,
    closeToast,
  };
}
