import { UsersIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PageHeader } from '../../../components/PageHeader';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';

import { useMatriculas } from './hooks/useMatriculas';
import { useEnrollmentForm } from './hooks/useEnrollmentForm';
import { useBulkEnrollment } from './hooks/useBulkEnrollment';

import { EnrollmentFormModal } from './components/EnrollmentFormModal';
import { EnrollmentBulkForm } from './components/EnrollmentBulkForm';
import { BulkSummaryBar } from './components/BulkSummaryBar';
import { BulkResultsPanel } from './components/BulkResultsPanel';
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

  const bulk = useBulkEnrollment({
    students: mat.filteredStudents,
    allEnrollments: mat.allEnrollments,
    showToast: mat.showToast,
    onSuccess: mat.refreshEnrollments,
  });

  const studentName = mat.selectedStudent
    ? `${mat.selectedStudent.firstName} ${mat.selectedStudent.lastName}`
    : '';

  // ── MODO MASIVO ──────────────────────────────────────────────────────────
  if (bulk.isBulkMode) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <PageHeader title="Gestión de Matrículas" />

          {/* Botón para volver al modo individual */}
          <button
            type="button"
            onClick={bulk.deactivate}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
          >
            ← Volver a matrícula individual
          </button>

          {/* Panel de configuración del curso destino */}
          {bulk.phase === 'selecting' && (
            <EnrollmentBulkForm
              form={bulk.bulkForm}
              setForm={bulk.setBulkForm}
              courses={bulk.courses}
              semesters={bulk.semesters}
              loadingDeps={bulk.loadingDeps}
            />
          )}

          {/* Resultados (post-envío) */}
          {bulk.phase === 'results' && bulk.bulkResult && (
            <BulkResultsPanel
              result={bulk.bulkResult}
              students={mat.filteredStudents}
              onBack={bulk.resetToSelecting}
            />
          )}

          {/* Procesando */}
          {bulk.phase === 'processing' && (
            <div className="bg-surface border border-border rounded-lg p-16 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-text-muted">
                Procesando matrícula masiva…
              </p>
            </div>
          )}

          {/* Lista de estudiantes con checkboxes (fases selecting y confirming) */}
          {(bulk.phase === 'selecting' || bulk.phase === 'confirming') && (
            <>
              {/* Barra de búsqueda + acciones de selección */}
              <div className="bg-surface border border-border rounded-lg p-3 md:p-4 flex flex-col md:flex-row gap-3 md:gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email, CUI o código de pago…"
                    value={mat.searchInput}
                    onChange={(e) => mat.setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') mat.handleSearch();
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
                  />
                  {/* Icono de lupa inline */}
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={mat.handleSearch}
                  disabled={mat.loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 text-sm"
                >
                  Buscar
                </button>
              </div>

              {/* Cabecera de selección con checkbox maestro */}
              {bulk.bulkForm.courseId && (
                <div className="bg-surface border border-border rounded-lg px-5 py-3 flex items-center justify-between">
                  <label className="flex items-center gap-3 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bulk.isAllSelectableSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = bulk.isPartiallySelected;
                      }}
                      onChange={bulk.toggleSelectAll}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-text font-medium">Seleccionar todos</span>
                    {bulk.selectedIds.size > 0 && (
                      <span className="text-primary font-semibold">
                        · {bulk.selectedIds.size} seleccionado(s)
                      </span>
                    )}
                  </label>
                  <span className="text-xs text-text-muted">
                    {bulk.selectableStudents.length} disponible(s)
                  </span>
                </div>
              )}

              {/* Lista de estudiantes */}
              {bulk.bulkForm.courseId ? (
                <StudentList
                  students={mat.filteredStudents}
                  allEnrollments={mat.allEnrollments}
                  loading={mat.loading}
                  searchTerm={mat.searchTerm}
                  bulkMode
                  selectedIds={bulk.selectedIds}
                  enrolledInTargetCourse={bulk.enrolledInTargetCourse}
                  onToggleSelect={bulk.toggleSelect}
                />
              ) : (
                <div className="bg-surface border border-border rounded-lg p-10 text-center">
                  <UsersIcon className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted text-sm">
                    Selecciona un curso y un semestre para habilitar la selección de alumnos.
                  </p>
                </div>
              )}

              {/* Barra de resumen sticky */}
              {bulk.canSubmit && (
                <BulkSummaryBar
                  courseName={bulk.selectedCourse?.name ?? '—'}
                  semesterLabel={bulk.semesterLabel}
                  selectedCount={bulk.selectedIds.size}
                  selectedLabel={
                    bulk.selectedIds.size === 1 ? 'alumno seleccionado' : 'alumnos seleccionados'
                  }
                  canSubmit={bulk.canSubmit}
                  onCancel={bulk.deactivate}
                  onConfirm={() => bulk.handleConfirm()}
                />
              )}
            </>
          )}
        </div>

        <Toast
          variant={mat.toast.variant}
          message={mat.toast.message}
          isVisible={mat.toast.visible}
          onClose={() => mat.setToast({ ...mat.toast, visible: false })}
        />
      </AdminLayout>
    );
  }

  // ── MODO INDIVIDUAL (original, intacto) ───────────────────────────────────
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Gestión de Matrículas"
          actions={
            !mat.isCoordinator ? (
              <button
                type="button"
                onClick={bulk.activate}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
              >
                <UsersIcon className="w-4 h-4" />
                Matrícula Masiva
              </button>
            ) : undefined
          }
        />

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