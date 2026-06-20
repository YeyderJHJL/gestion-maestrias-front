import { AdminLayout } from '../../../layouts/AdminLayout';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';
import { EmptyState } from '../../../components/EmptyState';
import { UsersIcon } from 'lucide-react';

import { useMatriculas } from './hooks/useMatriculas';
import { useEnrollmentForm } from './hooks/useEnrollmentForm';

import { StudentsTable } from './components/tabla/StudentsTable';
import { StudentDetailPanel } from './components/detalle/StudentDetailPanel';
import { EnrollmentFormModal } from './components/modales/EnrollmentFormModal';

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
      <div className="flex flex-col h-full space-y-0">
        {/* ── Encabezado ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-4 shrink-0">
          <div>
            <h1 className="text-3xl font-serif font-bold text-text">Gestión de Matrículas</h1>
            <p className="text-sm text-text-muted mt-1">
              Selecciona un estudiante para ver y administrar sus matrículas.
            </p>
          </div>
        </div>

        {/* ── Error global ────────────────────────────────────────────── */}
        {mat.error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {mat.error}
          </div>
        )}

        {/* ── Layout split-panel ───────────────────────────────────────── */}
        <div
          className="flex gap-0 border border-border rounded-xl overflow-hidden bg-surface"
          style={{ height: 'calc(100vh - 180px)' }}
        >
          {/* Panel izquierdo: lista de estudiantes */}
          <div
            className={`border-r border-border transition-all duration-300 flex flex-col ${
              mat.selectedStudent ? 'w-80 shrink-0' : 'flex-1'
            }`}
          >
            <StudentsTable
              rows={mat.rows}
              loading={mat.loading}
              search={mat.search}
              onSearchChange={mat.setSearch}
              filterStatus={mat.filterStatus}
              onFilterStatusChange={mat.setFilterStatus}
              filterYear={mat.filterYear}
              onFilterYearChange={mat.setFilterYear}
              promotionYears={mat.promotionYears}
              selectedStudentId={mat.selectedStudent?.id ?? null}
              onSelect={mat.selectStudent}
            />
          </div>

          {/* Panel derecho: detalle del estudiante seleccionado */}
          {mat.selectedStudent ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <StudentDetailPanel
                student={mat.selectedStudent}
                enrollments={mat.selectedEnrollments}
                isCoordinator={mat.isCoordinator}
                onClose={mat.clearSelection}
                onCreateEnrollment={enrollmentForm.openCreate}
                onEditEnrollment={enrollmentForm.openEdit}
                onDeleteEnrollment={enrollmentForm.setDeletingItem}
              />
            </div>
          ) : (
            /* Placeholder cuando ningún estudiante está seleccionado */
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center space-y-3">
                <UsersIcon className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-sm">
                  Selecciona un estudiante de la lista para ver sus matrículas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: formulario de matrícula ──────────────────────────── */}
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

      {/* ── Modal: confirmación de eliminación ──────────────────────── */}
      <ConfirmationModal
        isOpen={!!enrollmentForm.deletingItem}
        onClose={() => enrollmentForm.setDeletingItem(null)}
        onConfirm={enrollmentForm.handleDelete}
        title="Eliminar matrícula"
        message={
          enrollmentForm.deletingItem
            ? `¿Confirmas la eliminación de la matrícula de "${enrollmentForm.deletingItem.studentName}" en "${enrollmentForm.deletingItem.courseName}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        loading={enrollmentForm.deleting}
      />

      {/* ── Toast ───────────────────────────────────────────────────── */}
      <Toast
        visible={mat.toast.visible}
        variant={mat.toast.variant}
        message={mat.toast.message}
        onClose={() => mat.setToast({ ...mat.toast, visible: false })}
      />
    </AdminLayout>
  );
}
