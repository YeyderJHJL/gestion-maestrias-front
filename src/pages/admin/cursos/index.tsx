import { useState } from 'react';
import { PlusIcon, BookOpenIcon, Loader2Icon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { PageHeader } from '../../../components/PageHeader';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';

import { useCursos } from './hooks/useCursos';
import { useSemestres } from './hooks/useSemestres';
import { useAsignaciones } from './hooks/useAsignaciones';

import { SemestreCard } from './components/semestres/SemestreCard';
import { SemestreFormModal } from './components/semestres/SemestreFormModal';
import { CursosListModal } from './components/cursos/CursosListModal';
import { CursoFormModal } from './components/cursos/CursoFormModal';
import { AsignacionFormModal } from './components/asignaciones/AsignacionFormModal';
import { ImportGradesModal } from '../../../components/ImportGradesModal';

export function AdminCursos() {
  const cursos = useCursos();
  const semestres = useSemestres();
  const asignaciones = useAsignaciones();

  // Semestre expandido
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const toggleExpanded = (id: number) =>
    setExpandedId((prev) => (prev === id ? null : id));

  // Búsqueda en modal de cursos
  const [searchTerm, setSearchTerm] = useState('');
  const filteredCursos = cursos.cursos.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Estado para el modal de importar notas masivamente
  const [importGradesCourseId, setImportGradesCourseId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">

        <PageHeader
          title="Cursos y Semestres"
          subtitle="Gestiona los semestres, los cursos y sus asignaciones a docentes."
          actions={
            <>
              <button
                onClick={cursos.openList}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
              >
                <BookOpenIcon className="w-4 h-4" />
                Gestionar Cursos
              </button>
              {!semestres.isCoordinator && (
                <button
                  onClick={semestres.openCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  Nuevo Semestre
                </button>
              )}
            </>
          }
        />

        {/* ── Lista de semestres ───────────────────────────────────────────── */}
        {semestres.loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando semestres...</span>
          </div>
        ) : semestres.error ? (
          <div className="py-12 text-center text-sm text-accent">{semestres.error}</div>
        ) : semestres.semestres.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted">
            <BookOpenIcon className="w-12 h-12 opacity-20" />
            <p className="text-sm">No hay semestres registrados aún.</p>
            {!semestres.isCoordinator && (
              <button
                onClick={semestres.openCreate}
                className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
              >
                <PlusIcon className="w-4 h-4" />
                Crear primer semestre
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {semestres.semestres.map((semestre) => {
              const semesterAssignments = asignaciones.assignments.filter(
                (a) => a.semesterId === semestre.id
              );
              return (
                <SemestreCard
                  key={semestre.id}
                  semestre={semestre}
                  isExpanded={expandedId === semestre.id}
                  onToggle={() => toggleExpanded(semestre.id)}
                  onEdit={() => semestres.openEdit(semestre)}
                  onDelete={() => semestres.setDeletingItem(semestre)}
                  assignments={semesterAssignments}
                  assignmentsLoading={asignaciones.loading}
                  onAddAssignment={() => asignaciones.openCreate(semestre.id)}
                  onEditAssignment={(a) => asignaciones.openEdit(a)}
                  onDeleteAssignment={(a) => asignaciones.setDeletingItem(a)}
                  isCoordinator={asignaciones.isCoordinator}
                  onImportGrades={(courseId) => setImportGradesCourseId(courseId)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modal lista de cursos ────────────────────────────────────────────── */}
      <CursosListModal
        isOpen={cursos.isListOpen}
        onClose={cursos.closeList}
        cursos={filteredCursos}
        loading={cursos.loading}
        error={cursos.error}
        onAdd={() => { cursos.closeList(); cursos.openCreate(); }}
        onEdit={(curso) => { cursos.closeList(); cursos.openEdit(curso); }}
        onDelete={(curso) => { cursos.closeList(); cursos.setDeletingItem(curso); }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        isCoordinator={cursos.isCoordinator}
      />

      {/* ── Modal form de curso ──────────────────────────────────────────────── */}
      <CursoFormModal
        isOpen={cursos.isFormOpen}
        onClose={cursos.closeForm}
        editingItem={cursos.editingItem}
        form={cursos.form}
        setForm={cursos.setForm}
        submitting={cursos.submitting}
        formError={cursos.formError}
        onSubmit={cursos.handleSubmit}
      />

      {/* ── Modal form de semestre ───────────────────────────────────────────── */}
      <SemestreFormModal
        isOpen={semestres.isFormOpen}
        onClose={semestres.closeForm}
        editingItem={semestres.editingItem}
        form={semestres.form}
        setForm={semestres.setForm}
        submitting={semestres.submitting}
        formError={semestres.formError}
        onSubmit={semestres.handleSubmit}
      />

      {/* ── Modal form de asignación ─────────────────────────────────────────── */}
      <AsignacionFormModal
        isOpen={asignaciones.isFormOpen}
        onClose={asignaciones.closeForm}
        editingItem={asignaciones.editingItem}
        form={asignaciones.form}
        setForm={asignaciones.setForm}
        teachers={asignaciones.teachers}
        courses={asignaciones.courses}
        loadingDeps={asignaciones.loadingDeps}
        submitting={asignaciones.submitting}
        formError={asignaciones.formError}
        onSubmit={asignaciones.handleSubmit}
        existingSyllabus={asignaciones.existingSyllabus}
        loadingSyllabus={asignaciones.loadingSyllabus}
      />

      {/* ── Confirmación eliminar curso ──────────────────────────────────────── */}
      <ConfirmationModal
        isOpen={!!cursos.deletingItem}
        onClose={() => cursos.setDeletingItem(null)}
        onConfirm={cursos.handleDelete}
        title="Eliminar curso"
        message={`¿Estás seguro de que deseas eliminar el curso "${cursos.deletingItem?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ── Confirmación eliminar semestre ───────────────────────────────────── */}
      <ConfirmationModal
        isOpen={!!semestres.deletingItem}
        onClose={() => semestres.setDeletingItem(null)}
        onConfirm={semestres.handleDelete}
        title="Eliminar semestre"
        message={`¿Estás seguro de que deseas eliminar el semestre "${semestres.deletingItem?.year}-${semestres.deletingItem?.code}"? Se eliminarán también sus asignaciones.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ── Confirmación eliminar asignación ─────────────────────────────────── */}
      <ConfirmationModal
        isOpen={!!asignaciones.deletingItem}
        onClose={() => asignaciones.setDeletingItem(null)}
        onConfirm={asignaciones.handleDelete}
        title="Eliminar asignación"
        message={`¿Estás seguro de que deseas eliminar la asignación de "${asignaciones.deletingItem?.courseName}" a "${asignaciones.deletingItem?.teacherName}"?`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ── Toasts ───────────────────────────────────────────────────────────── */}
      <Toast
        isVisible={cursos.toast.visible}
        variant={cursos.toast.variant}
        message={cursos.toast.message}
        onClose={() => cursos.setToast({ ...cursos.toast, visible: false })}
      />
      <Toast
        isVisible={semestres.toast.visible}
        variant={semestres.toast.variant}
        message={semestres.toast.message}
        onClose={() => semestres.setToast({ ...semestres.toast, visible: false })}
      />
      <Toast
        isVisible={asignaciones.toast.visible}
        variant={asignaciones.toast.variant}
        message={asignaciones.toast.message}
        onClose={() => asignaciones.setToast({ ...asignaciones.toast, visible: false })}
      />

      {/* Modal de Importar Notas Masivas */}
      <ImportGradesModal
        isOpen={!!importGradesCourseId}
        onClose={() => setImportGradesCourseId(null)}
        courseId={importGradesCourseId || ''}
        onSuccess={() => window.location.reload()}
      />
    </AdminLayout>
  );
}
