import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../services/api';
import { VOUCHER_STATE } from '../../../constants/stateIds';
import { listVouchers, updateVoucher } from '../../../services/vouchersApiService';
import { VoucherResponse, VoucherStateCode } from '../../../types/voucher';

type ActiveTab = 'pendientes' | 'validados' | 'observados' | 'rechazados';
type Decision = 'validar' | 'observar' | 'rechazar';

const TAB_TO_STATE: Record<ActiveTab, VoucherStateCode> = {
  pendientes: 'UPLOADED',
  validados: 'VALIDATED',
  observados: 'OBSERVED',
  rechazados: 'REJECTED',
};

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
  const [activeTab, setActiveTab] = useState<ActiveTab>('pendientes');

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse | null>(null);
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

  const loadVouchers = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    listVouchers(token)
      .then(setAllVouchers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const vouchers = useMemo(
    () => allVouchers.filter((v) => v.stateCode === TAB_TO_STATE[activeTab]),
    [allVouchers, activeTab]
  );

  const tabs = useMemo(() => [
    { key: 'pendientes' as const, label: 'Pendientes', count: allVouchers.filter((v) => v.stateCode === 'UPLOADED').length },
    { key: 'validados' as const, label: 'Validados', count: allVouchers.filter((v) => v.stateCode === 'VALIDATED').length },
    { key: 'observados' as const, label: 'Observados', count: allVouchers.filter((v) => v.stateCode === 'OBSERVED').length },
    { key: 'rechazados' as const, label: 'Rechazados', count: allVouchers.filter((v) => v.stateCode === 'REJECTED').length },
  ], [allVouchers]);

  const closeDrawer = () => {
    setSelectedVoucher(null);
    setDecision(null);
    setMotivo('');
  };

  const handleReview = async () => {
    if (!token || !selectedVoucher || !decision) return;
    setSubmitting(true);
    try {
      const target = DECISION_TO_STATE[decision];
      const updated = await updateVoucher(token, selectedVoucher.id, {
        paymentId: selectedVoucher.paymentId,
        stateId: target.id,
        fileId: selectedVoucher.file.id,
        observation: motivo || undefined,
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
    activeTab,
    setActiveTab,
    tabs,
    selectedVoucher,
    setSelectedVoucher,
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
