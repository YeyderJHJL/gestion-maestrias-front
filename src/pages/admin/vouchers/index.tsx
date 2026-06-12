import React from 'react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { Toast } from '../../../components/Toast';
import { useAdminVouchers } from './useAdminVouchers';
import { VouchersTable } from './VouchersTable';
import { VoucherReviewDrawer } from './VoucherReviewDrawer';

export function AdminVouchers() {
  const {
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
  } = useAdminVouchers();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">Gestión de Vouchers</h1>

        <VouchersTable
          vouchers={vouchers}
          loading={loading}
          error={error}
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
          onSelectVoucher={setSelectedVoucher}
        />
      </div>

      <VoucherReviewDrawer
        voucher={selectedVoucher}
        decision={decision}
        setDecision={setDecision}
        motivo={motivo}
        setMotivo={setMotivo}
        submitting={submitting}
        isCoordinator={isCoordinator}
        onClose={closeDrawer}
        onConfirm={handleReview}
      />

      <Toast
        variant={toast.variant}
        message={toast.message}
        isVisible={toast.visible}
        onClose={closeToast}
      />
    </AdminLayout>
  );
}
