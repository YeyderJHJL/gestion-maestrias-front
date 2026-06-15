import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ApiError } from '../../../services/api';
import { listVouchers, reviewVoucher } from '../../../services/vouchersApiService';
import { VoucherResponse, VoucherStateCode } from '../../../types/voucher';

type ActiveTab = 'pendientes' | 'validados' | 'observados' | 'rechazados';
type Decision = 'validar' | 'observar' | 'rechazar';

const TAB_TO_STATE: Record<ActiveTab, VoucherStateCode> = {
  pendientes: 'PENDING',
  validados: 'VALIDATED',
  observados: 'OBSERVED',
  rechazados: 'REJECTED',
};

const DECISION_TO_ACTION: Record<Decision, 'VALIDATE' | 'OBSERVE' | 'REJECT'> = {
  validar: 'VALIDATE',
  observar: 'OBSERVE',
  rechazar: 'REJECT',
};

export function useAdminVouchers() {
  const { user, token } = useAuth();
  const isCoordinator = user?.role === 'Coordinador';

  const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
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
    listVouchers(token, TAB_TO_STATE[activeTab])
      .then(setVouchers)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, activeTab]);

  useEffect(() => {
    loadVouchers();
  }, [loadVouchers]);

  const closeDrawer = () => {
    setSelectedVoucher(null);
    setDecision(null);
    setMotivo('');
  };

  const handleReview = async () => {
    if (!token || !selectedVoucher || !decision) return;
    setSubmitting(true);
    try {
      await reviewVoucher(token, selectedVoucher.id, {
        action: DECISION_TO_ACTION[decision],
        observation: motivo || undefined,
      });
      setVouchers((prev) => prev.filter((v) => v.id !== selectedVoucher.id));
      showToast('success', 'Decisión registrada correctamente.');
      closeDrawer();
    } catch (e) {
      showToast('error', e instanceof ApiError ? e.message : 'Error al registrar la decisión.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { key: 'pendientes' as const, label: 'Pendientes', count: activeTab === 'pendientes' ? vouchers.length : 0 },
    { key: 'validados' as const, label: 'Validados', count: activeTab === 'validados' ? vouchers.length : 0 },
    { key: 'observados' as const, label: 'Observados', count: activeTab === 'observados' ? vouchers.length : 0 },
    { key: 'rechazados' as const, label: 'Rechazados', count: activeTab === 'rechazados' ? vouchers.length : 0 },
  ];

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
