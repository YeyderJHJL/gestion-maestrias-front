import { useState } from 'react';
import { BookOpenIcon, Loader2Icon, PlusIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';
import { EmptyState } from '../../../components/EmptyState';

// Hooks
import { useCursos } from './hooks/useCursos';
import { useSemestres } from './hooks/useSemestres';
import { useAsignaciones } from './hooks/useAsignaciones';

// Componentes
import { SemestreCard } from './components/semestres/SemestreCard';
import { SemestreFormModal } from './components/semestres/SemestreFormModal';
import { CursosListModal } from './components/cursos/CursosListModal';
import { CursoFormModal } from './components/cursos/CursoFormModal';
import { AsignacionFormModal } from './components/asignaciones/AsignacionFormModal';

export function AdminCursos() {
  const cursos = useCursos();
  const semestres = useSemestres();
  const asignaciones = useAsignaciones();

  const [expandedSemesterId, setExpandedSemesterId] = useState<number | null>(null);
  // búsqueda local en la lista de cursos (swap a query param cuando haya API real)
  const [cursoSearch, setCursoSearch] = useState('');

  const toggleSemestre = (id: number) =>
    setExpandedSemesterId((prev) => (prev === id ? null : id));

  const cursosFiltrados = cursos.cursos.filter((c) => {
    if (!cursoSearch) return true;
    const q = cursoSearch.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ── Cabecera ─────────────────────────────────────────────────────── */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-serif font-bold text-text">Semestres y Asignaciones</h1>

          <div className="flex gap-2">
            {!semestres.isCoordinator && (
              <button
                onClick={cursos.openList}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <BookOpenIcon className="w-5 h-5" />
                Lista de Cursos
              </button>
            )}
            {!semestres.isCoordinator && (
              <button
                onClick={semestres.openCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Semestre
              </button>
            )}
          </div>
        </div>

        {/* ── Lista de semestres ────────────────────────────────────────────── */}
        {semestres.loading ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2Icon className="w-6 h-6 animate-spin" />
            <span className="ml-2">Cargando semestres...</span>
          </div>
        ) : semestres.error ? (
          <div className="text-accent text-center py-16">{semestres.error}</div>
        ) : semestres.semestres.length === 0 ? (
          <EmptyState
            icon={BookOpenIcon}
            title="No hay semestres"
            subtitle="Agrega el primer semestre para comenzar."
          />
        ) : (
          <div className="space-y-4">
            {semestres.semestres.map((semestre) => (
              <SemestreCard
                key={semestre.id}
                semestre={semestre}
                isExpanded={expandedSemesterId === semestre.id}
                onToggle={() => toggleSemestre(semestre.id)}
                onEdit={() => semestres.openEdit(semestre)}
                onDelete={() => semestres.setDeletingItem(semestre)}
                assignments={asignaciones.assignments.filter(
                  (a) => a.semesterId === semestre.id
                )}
                assignmentsLoading={asignaciones.loading}
                onAddAssignment={() => asignaciones.openCreate(semestre.id)}
                onEditAssignment={asignaciones.openEdit}
                onDeleteAssignment={asignaciones.setDeletingItem}
                isCoordinator={semestres.isCoordinator}
              />
            ))}
          </div>
        )}
      </div>

      {/* ══ MODALES CURSOS ══════════════════════════════════════════════════ */}

      {/* Modal lista de cursos */}
      <CursosListModal
        isOpen={cursos.isListOpen}
        onClose={cursos.closeList}
        cursos={cursosFiltrados}
        loading={cursos.loading}
        error={cursos.error}
        searchTerm={cursoSearch}
        onSearchChange={setCursoSearch}
        onAdd={cursos.openCreate}
        onEdit={cursos.openEdit}
        onDelete={cursos.setDeletingItem}
      />

      {/* Modal form curso (crear / editar) */}
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

      {/* Confirmación eliminar curso */}
      <ConfirmationModal
        isOpen={cursos.deletingItem !== null}
        onClose={() => cursos.setDeletingItem(null)}
        onConfirm={cursos.handleDelete}
        title="Eliminar Curso"
        message={
          cursos.deletingItem
            ? `¿Estás seguro de que deseas eliminar el curso "${cursos.deletingItem.name}"? Esto podría afectar sus asignaciones.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ══ MODALES SEMESTRES ══════════════════════════════════════════════ */}

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

      <ConfirmationModal
        isOpen={semestres.deletingItem !== null}
        onClose={() => semestres.setDeletingItem(null)}
        onConfirm={semestres.handleDelete}
        title="Eliminar Semestre"
        message={
          semestres.deletingItem
            ? `¿Estás seguro de que deseas eliminar el semestre ${semestres.deletingItem.year}-${semestres.deletingItem.code}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ══ MODALES ASIGNACIONES ═══════════════════════════════════════════ */}

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

      <ConfirmationModal
        isOpen={asignaciones.deletingItem !== null}
        onClose={() => asignaciones.setDeletingItem(null)}
        onConfirm={asignaciones.handleDelete}
        title="Eliminar Asignación"
        message="¿Estás seguro de que deseas eliminar esta asignación? El curso ya no tendrá docente en este semestre."
        confirmLabel="Eliminar"
        variant="danger"
      />

      {/* ══ TOASTS ════════════════════════════════════════════════════════ */}

      <Toast
        variant={cursos.toast.variant}
        message={cursos.toast.message}
        isVisible={cursos.toast.visible}
        onClose={() => cursos.setToast((t) => ({ ...t, visible: false }))}
      />
      <Toast
        variant={semestres.toast.variant}
        message={semestres.toast.message}
        isVisible={semestres.toast.visible}
        onClose={() => semestres.setToast((t) => ({ ...t, visible: false }))}
      />
      <Toast
        variant={asignaciones.toast.variant}
        message={asignaciones.toast.message}
        isVisible={asignaciones.toast.visible}
        onClose={() => asignaciones.setToast((t) => ({ ...t, visible: false }))}
      />
    </AdminLayout>
  );
}
