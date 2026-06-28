import { AdminLayout } from '../../../layouts/AdminLayout';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';

import { useMatriculas } from './hooks/useMatriculas';
import { useEnrollmentForm } from './hooks/useEnrollmentForm';

import { EnrollmentFormModal } from './components/EnrollmentFormModal';
import { SearchBar } from '../../../components/SearchBar';
import { StudentList } from './components/StudentList';
import { StudentDetailPanel } from './components/StudentDetailPanel';
import { EnrollmentsPanel } from './components/EnrollmentsPanel';

export function AdminMatriculas() {
  const mat = useMatriculas();

  const enrollmentForm = useEnrollmentForm({
    studentId: mat.selectedStudent?.id ?? '',
    onSuccess: mat.refreshEnrollments,
    showToast: mat.showToast,
  });

  const studentName = mat.selectedStudent
    ? `${mat.selectedStudent.firstName} ${mat.selectedStudent.lastName}`
    : '';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b-2 border-accent pb-3">
          <h1 className="text-3xl font-serif font-bold text-text">Gestión de Matrículas</h1>
        </div>

        <SearchBar
          value={mat.searchInput}
          onChange={mat.setSearchInput}
          onKeyDown={mat.handleKeyDown}
          onClear={mat.clearSearch}
          onSearch={mat.handleSearch}
          loading={mat.loading}
          placeholder="Buscar por nombre, email, CUI o código de pago…"
        />

        {mat.error && (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {mat.error}
          </div>
        )}

        {mat.selectedStudent ? (
          <div className="space-y-6">
            <StudentDetailPanel
              student={mat.selectedStudent}
              isCoordinator={mat.isCoordinator}
              onNewEnrollment={enrollmentForm.openCreate}
              onBack={mat.clearSearch}
            />

            <EnrollmentsPanel
              enrollments={mat.selectedEnrollments}
              isCoordinator={mat.isCoordinator}
              onAdd={enrollmentForm.openCreate}
              onEdit={enrollmentForm.openEdit}
              onDelete={enrollmentForm.setDeletingItem}
            />
          </div>
        ) : (
          <StudentList
            students={mat.filteredStudents}
            allEnrollments={mat.allEnrollments}
            loading={mat.loading}
            searchTerm={mat.searchTerm}
            onSelectStudent={mat.selectStudent}
          />
        )}
      </div>

      {/* ── Modales ──────────────────────────────────────────────────── */}
      <EnrollmentFormModal
        isOpen={enrollmentForm.isFormOpen}
        onClose={enrollmentForm.closeForm}
        editingItem={enrollmentForm.editingItem}
        form={enrollmentForm.form}
        setForm={enrollmentForm.setForm}
        courses={enrollmentForm.courses}
        semesters={enrollmentForm.semesters}
        loadingDeps={enrollmentForm.loadingDeps}
        submitting={enrollmentForm.submitting}
        formError={enrollmentForm.formError}
        onSubmit={enrollmentForm.handleSubmit}
        studentName={studentName}
      />

      <ConfirmationModal
        isOpen={!!enrollmentForm.deletingItem}
        onClose={() => enrollmentForm.setDeletingItem(null)}
        onConfirm={enrollmentForm.triggerDelete}
        title="Eliminar matrícula"
        message={
          enrollmentForm.deletingItem
            ? `¿Confirmas la eliminación de la matrícula en "${enrollmentForm.deletingItem.courseName}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <Toast
        variant={mat.toast.variant}
        message={mat.toast.message}
        isVisible={mat.toast.visible}
        onClose={() => mat.setToast({ ...mat.toast, visible: false })}
      />
    </AdminLayout>
  );
}
