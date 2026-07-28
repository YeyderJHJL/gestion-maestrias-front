import { AdminLayout } from '../../../layouts/AdminLayout';
import { PageHeader } from '../../../components/PageHeader';
import { Toast } from '../../../components/Toast';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { useAdminVouchers } from './useAdminVouchers';
import { VouchersTable } from './VouchersTable';
import { VoucherReviewModal } from './VoucherReviewModal';

export function AdminVouchers() {
  const {
    vouchers,
    loading,
    error,
    search,
    setSearch,
    stateFilter,
    setStateFilter,
    selectedVoucher,
    openReview,
    canEditVoucher,
    unvalidatedPreviousPayments,
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
    deletingVoucher,
    setDeletingVoucher,
    deleting,
    handleDelete,
    toast,
    closeToast,
  } = useAdminVouchers();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="Gestión de Vouchers" />

        <VouchersTable
          vouchers={vouchers}
          loading={loading}
          error={error}
          search={search}
          onSearchChange={setSearch}
          stateFilter={stateFilter}
          onStateFilterChange={setStateFilter}
          onSelectVoucher={openReview}
          onDeleteVoucher={setDeletingVoucher}
          canEditVoucher={canEditVoucher}
        />
      </div>

      <VoucherReviewModal
        voucher={selectedVoucher}
        unvalidatedPreviousPayments={unvalidatedPreviousPayments}
        checkedPaymentIds={checkedPaymentIds}
        onTogglePayment={togglePayment}
        decision={decision}
        setDecision={setDecision}
        motivo={motivo}
        setMotivo={setMotivo}
        submitting={submitting}
        isCoordinator={isCoordinator}
        readOnly={selectedVoucher ? !canEditVoucher(selectedVoucher) : false}
        onClose={closeDrawer}
        onConfirm={handleReview}
      />

      <ConfirmationModal
        isOpen={deletingVoucher !== null}
        onClose={() => setDeletingVoucher(null)}
        onConfirm={handleDelete}
        title="Eliminar voucher"
        message={
          deletingVoucher
            ? `¿Estás seguro de que deseas eliminar el voucher de ${deletingVoucher.studentName}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel={deleting ? 'Eliminando...' : 'Eliminar'}
        variant="danger"
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
