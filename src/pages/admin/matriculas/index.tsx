import { SearchIcon, XIcon, PlusIcon, PencilIcon, Trash2Icon, FileTextIcon, Loader2Icon, CheckCircleIcon, MinusCircleIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { StatusBadge } from '../../../components/StatusBadge';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';

import { useMatriculas } from './hooks/useMatriculas';
import { useEnrollmentForm } from './hooks/useEnrollmentForm';
import { EnrollmentFormModal } from './components/EnrollmentFormModal';
import { EnrollmentStateTag } from './components/EnrollmentStateTag';
import { StudentResponse } from '../../../services/studentsApiService';
import { EnrollmentResponse } from '../../../services/enrollmentsApiService';
import { ENROLLMENT_STATES } from '../../../services/enrollmentsApiService';

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(s: StudentResponse) {
  return `${s.firstName[0] ?? ''}${s.lastName[0] ?? ''}`.toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const STUDENT_STATUS_VARIANT = {
  Regular:         'matriculado',
  Reactualizacion: 'reactualizacion',
} as const satisfies Record<string, 'matriculado' | 'reactualizacion'>;

// ── Componente principal ──────────────────────────────────────────────────────

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
        <h1 className="text-3xl font-serif font-bold text-text">
          Gestión de Matrículas
        </h1>

        {/* ── Buscador ────────────────────────────────────────────────── */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar por nombre, email, CUI o código de pago…"
                value={mat.searchInput}
                onChange={(e) => mat.setSearchInput(e.target.value)}
                onKeyDown={mat.handleKeyDown}
                className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text"
              />
              {mat.searchInput && (
                <button
                  onClick={mat.clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={mat.handleSearch}
              disabled={mat.loading}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {mat.loading
                ? <Loader2Icon className="w-4 h-4 animate-spin" />
                : <SearchIcon className="w-4 h-4" />}
              Buscar
            </button>
          </div>
        </div>

        {mat.error && (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {mat.error}
          </div>
        )}

        {/* ── Vista detalle del estudiante seleccionado ────────────────── */}
        {mat.selectedStudent ? (
          <div className="space-y-6">
            {/* Ficha */}
            <div className="bg-surface border-l-4 border-primary rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {getInitials(mat.selectedStudent)}
                  </div>
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-serif font-bold text-text">
                      {mat.selectedStudent.firstName} {mat.selectedStudent.lastName}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                      {mat.selectedStudent.cui && <span>CUI: {mat.selectedStudent.cui}</span>}
                      {mat.selectedStudent.paymentCode && <span>Cód. pago: {mat.selectedStudent.paymentCode}</span>}
                      {mat.selectedStudent.phone && <span>Tel: {mat.selectedStudent.phone}</span>}
                    </div>
                    <p className="text-sm text-text-muted">
                      {mat.selectedStudent.email} · Promoción {mat.selectedStudent.yearPromotion}
                    </p>
                    <div className="pt-1">
                      <StatusBadge variant={STUDENT_STATUS_VARIANT[mat.selectedStudent.status] ?? 'matriculado'}>
                        {mat.selectedStudent.status === 'Reactualizacion' ? 'Reactualización' : mat.selectedStudent.status}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!mat.isCoordinator && (
                    <button
                      onClick={enrollmentForm.openCreate}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Nueva matrícula
                    </button>
                  )}
                  <button
                    onClick={mat.clearSearch}
                    className="px-4 py-2 border border-border text-text-muted rounded-lg hover:bg-surface-alt transition-colors text-sm"
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>

            {/* Matrículas */}
            <div className="bg-surface border border-border rounded-lg">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-serif font-bold text-text">
                  Matrículas registradas
                  <span className="ml-2 text-sm font-normal text-text-muted">
                    ({mat.selectedEnrollments.length})
                  </span>
                </h3>
              </div>
              {mat.selectedEnrollments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-3">
                  <FileTextIcon className="w-10 h-10 opacity-20" />
                  <p className="text-sm">No hay matrículas registradas para este estudiante</p>
                  {!mat.isCoordinator && (
                    <button onClick={enrollmentForm.openCreate} className="text-sm text-primary hover:underline">
                      + Registrar primera matrícula
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {mat.selectedEnrollments.map((enr) => (
                    <EnrollmentRow
                      key={enr.id}
                      enrollment={enr}
                      isCoordinator={mat.isCoordinator}
                      onEdit={() => enrollmentForm.openEdit(enr)}
                      onDelete={() => enrollmentForm.setDeletingItem(enr)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        ) : (
          /* ── Lista completa de estudiantes ────────────────────────────── */
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            {/* Cabecera con contador */}
            <div className="px-5 py-3 border-b border-border bg-surface-alt">
              <p className="text-sm text-text-muted">
                {mat.loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    Cargando estudiantes…
                  </span>
                ) : mat.searchTerm
                  ? `${mat.filteredStudents.length} resultado${mat.filteredStudents.length !== 1 ? 's' : ''} para "${mat.searchTerm}"`
                  : `${mat.filteredStudents.length} estudiante${mat.filteredStudents.length !== 1 ? 's' : ''} registrados`}
              </p>
            </div>

            {!mat.loading && mat.filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted gap-2">
                <SearchIcon className="w-8 h-8 opacity-20" />
                <p className="text-sm">Sin resultados para la búsqueda</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {mat.filteredStudents.map((student) => {
                  const studentEnrollments = mat.allEnrollments.filter(e => e.studentId === student.id);
                  const activeCount = studentEnrollments.filter(e => e.stateId === ENROLLMENT_STATES.ENROLLED.id).length;
                  const isEnrolled  = activeCount > 0;

                  return (
                    <li key={student.id}>
                      <button
                        onClick={() => mat.selectStudent(student)}
                        className="w-full text-left px-5 py-4 hover:bg-surface-alt transition-colors flex items-center gap-4"
                      >
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
                          {getInitials(student)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-text-muted truncate">{student.email}</p>
                        </div>

                        {/* Metadata + estado matrícula */}
                        <div className="flex items-center gap-3 shrink-0">
                          {student.cui && (
                            <span className="text-xs text-text-muted hidden md:inline">
                              CUI: {student.cui}
                            </span>
                          )}
                          <span className="text-xs text-text-muted">Prom. {student.yearPromotion}</span>

                          <StatusBadge variant={STUDENT_STATUS_VARIANT[student.status] ?? 'matriculado'}>
                            {student.status === 'Reactualizacion' ? 'Reactualización' : student.status}
                          </StatusBadge>

                          {/* Indicador de matrícula activa */}
                          {isEnrolled ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-success">
                              <CheckCircleIcon className="w-4 h-4" />
                              {activeCount} curso{activeCount !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
                              <MinusCircleIcon className="w-4 h-4" />
                              Sin matrícula
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
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

// ── Fila de matrícula (panel detalle) ─────────────────────────────────────────

interface EnrollmentRowProps {
  enrollment: EnrollmentResponse;
  isCoordinator: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function EnrollmentRow({ enrollment: e, isCoordinator, onEdit, onDelete }: EnrollmentRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-surface-alt transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-text">{e.courseName}</span>
          <span className="text-xs text-text-muted">{e.courseCode}</span>
          <EnrollmentStateTag stateCode={e.stateCode} stateName={e.stateName} />
        </div>
        <div className="flex flex-wrap gap-4 mt-1 text-sm text-text-muted">
          <span>Semestre: {e.semesterCode} ({e.semesterYear})</span>
          <span>Fecha: {formatDate(e.enrollmentDate)}</span>
          {e.resolutionFile && (
            <span className="flex items-center gap-1">
              <FileTextIcon className="w-3.5 h-3.5" />
              {e.resolutionFile.originalName}
            </span>
          )}
        </div>
        {e.observations && (
          <p className="text-xs text-text-muted italic mt-1">{e.observations}</p>
        )}
      </div>
      {!isCoordinator && (
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={onEdit} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <PencilIcon className="w-3.5 h-3.5" /> Editar
          </button>
          <button onClick={onDelete} className="flex items-center gap-1 text-sm text-red-500 hover:underline">
            <Trash2Icon className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
