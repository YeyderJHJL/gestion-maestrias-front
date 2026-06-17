import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, Loader2Icon, EditIcon, XIcon, BookOpenIcon, UsersIcon } from 'lucide-react';
import { AdminLayout } from '../../../layouts/AdminLayout';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { Toast } from '../../../components/Toast';
import { EmptyState } from '../../../components/EmptyState';
import { useSemestres } from './semestres/useSemestres';
import { SemestreFormModal } from './semestres/SemestreFormModal';
import { useAsignaciones } from './asignaciones/useAsignaciones';
import { AssignmentFormModal } from './asignaciones/AssignmentFormModal';
import { useCursos } from './cursos/useCursos';
import { CursoFormModal } from './cursos/CursoFormModal';

export function AdminCursos() {
  const semestresState = useSemestres();
  const asignacionesState = useAsignaciones();
  const cursosState = useCursos();

  const [expandedSemesterId, setExpandedSemesterId] = useState<number | null>(null);

  const toggleSemester = (semesterId: number) => {
    if (expandedSemesterId === semesterId) {
      setExpandedSemesterId(null);
    } else {
      setExpandedSemesterId(semesterId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-serif font-bold text-text">Semestres y Asignaciones</h1>
          <div className="flex gap-2">
            {!cursosState.isCoordinator && (
              <button
                onClick={cursosState.openCreateModal}
                className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                <BookOpenIcon className="w-5 h-5" />
                Catálogo de Cursos Base
              </button>
            )}
            {!semestresState.isCoordinator && (
              <button
                onClick={semestresState.openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Nuevo Semestre
              </button>
            )}
          </div>
        </div>

        {semestresState.loading ? (
          <div className="flex items-center justify-center py-16 text-text-muted">
            <Loader2Icon className="w-6 h-6 animate-spin" />
            <span className="ml-2">Cargando semestres...</span>
          </div>
        ) : semestresState.error ? (
          <div className="text-accent text-center py-16">{semestresState.error}</div>
        ) : semestresState.semestres.length === 0 ? (
          <EmptyState
            icon={BookOpenIcon}
            title="No hay semestres"
            subtitle="Agrega el primer semestre para comenzar."
          />
        ) : (
          <div className="space-y-4">
            {semestresState.semestres.map((semestre) => {
              const isExpanded = expandedSemesterId === semestre.id;
              // Filtrado de asignaciones para este semestre
              const semesterAssignments = asignacionesState.assignments.filter(
                (a) => a.semesterId === semestre.id
              );

              return (
                <div key={semestre.id} className="border border-border rounded-lg bg-surface overflow-hidden">
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-surface-alt transition-colors"
                    onClick={() => toggleSemester(semestre.id)}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDownIcon className="w-5 h-5 text-text-muted" />
                      ) : (
                        <ChevronRightIcon className="w-5 h-5 text-text-muted" />
                      )}
                      <h2 className="text-xl font-bold text-text">
                        Semestre {semestre.code}
                      </h2>
                      <span className="text-sm text-text-muted bg-border px-2 py-0.5 rounded-full">
                        Año {semestre.year}
                      </span>
                    </div>
                    {!semestresState.isCoordinator && (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => semestresState.openEditModal(semestre)}
                          className="p-1 text-primary hover:text-primary-light transition-colors"
                          title="Editar Semestre"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => semestresState.setDeletingItem(semestre)}
                          className="p-1 text-accent hover:text-accent-light transition-colors"
                          title="Eliminar Semestre"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-border bg-background/50">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-text">Cursos Asignados en {semestre.code}</h3>
                        {!asignacionesState.isCoordinator && (
                          <button
                            onClick={() => asignacionesState.openCreateModal(semestre.id)}
                            className="flex items-center gap-1 text-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary-light transition-colors"
                          >
                            <PlusIcon className="w-4 h-4" />
                            Asignar Curso a Docente
                          </button>
                        )}
                      </div>

                      {asignacionesState.loading ? (
                        <div className="flex items-center text-text-muted text-sm py-4">
                          <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                          Cargando asignaciones...
                        </div>
                      ) : semesterAssignments.length === 0 ? (
                        <p className="text-sm text-text-muted italic py-4">No hay cursos asignados a este semestre.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {semesterAssignments.map((asignacion) => (
                            <div key={asignacion.id} className="bg-surface border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                              <div className="flex justify-between items-start mb-3">
                                <div className="pl-2">
                                  <span className="text-xs font-semibold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                                    {asignacion.courseCode}
                                  </span>
                                  <h4 className="font-bold text-text mt-2 leading-tight">{asignacion.courseName}</h4>
                                </div>
                                {!asignacionesState.isCoordinator && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => asignacionesState.openEditModal(asignacion)}
                                      className="p-1.5 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                      <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => asignacionesState.setDeletingItem(asignacion)}
                                      className="p-1.5 rounded-lg text-text-muted hover:bg-accent/10 hover:text-accent transition-colors"
                                    >
                                      <XIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="pl-2 flex items-center gap-2 mt-4 text-sm font-medium text-text-muted">
                                <UsersIcon className="w-4 h-4 text-primary" />
                                <span>{asignacion.teacherName}</span>
                              </div>
                              <div className="pl-2 text-xs text-text-muted/70 mt-2">
                                Asignado el: {asignacion.assignmentDate}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SemestreFormModal
        isOpen={semestresState.isModalOpen}
        onClose={semestresState.closeModal}
        editingItem={semestresState.editingItem}
        form={semestresState.form}
        setForm={semestresState.setForm}
        submitting={semestresState.submitting}
        formError={semestresState.formError}
        onSubmit={semestresState.handleSubmit}
      />

      <AssignmentFormModal
        isOpen={asignacionesState.isModalOpen}
        onClose={asignacionesState.closeModal}
        editingItem={asignacionesState.editingItem}
        form={asignacionesState.form}
        setForm={asignacionesState.setForm}
        teachers={asignacionesState.teachers}
        courses={asignacionesState.courses}
        loadingDependencies={asignacionesState.loadingDependencies}
        submitting={asignacionesState.submitting}
        formError={asignacionesState.formError}
        onSubmit={asignacionesState.handleSubmit}
      />

      <CursoFormModal
        isOpen={cursosState.isModalOpen}
        onClose={cursosState.closeModal}
        editingItem={cursosState.editingItem}
        form={cursosState.form}
        setForm={cursosState.setForm}
        submitting={cursosState.submitting}
        formError={cursosState.formError}
        onSubmit={cursosState.handleSubmit}
      />

      <ConfirmationModal
        isOpen={semestresState.deletingItem !== null}
        onClose={() => semestresState.setDeletingItem(null)}
        onConfirm={semestresState.handleDelete}
        title="Eliminar Semestre"
        message={
          semestresState.deletingItem
            ? `¿Estás seguro de que deseas eliminar el semestre ${semestresState.deletingItem.year}-${semestresState.deletingItem.code}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={asignacionesState.deletingItem !== null}
        onClose={() => asignacionesState.setDeletingItem(null)}
        onConfirm={asignacionesState.handleDelete}
        title="Eliminar Asignación"
        message="¿Estás seguro de que deseas eliminar esta asignación? El curso ya no tendrá docente en este semestre."
        confirmLabel="Eliminar"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={cursosState.deletingItem !== null}
        onClose={() => cursosState.setDeletingItem(null)}
        onConfirm={cursosState.handleDelete}
        title="Eliminar Curso Base"
        message={
          cursosState.deletingItem
            ? `¿Estás seguro de que deseas eliminar el curso ${cursosState.deletingItem.name}? Esto podría afectar sus asignaciones.`
            : ''
        }
        confirmLabel="Eliminar"
        variant="danger"
      />

      <Toast
        variant={semestresState.toast.variant}
        message={semestresState.toast.message}
        isVisible={semestresState.toast.visible}
        onClose={() => semestresState.setToast((t) => ({ ...t, visible: false }))}
      />
      
      <Toast
        variant={asignacionesState.toast.variant}
        message={asignacionesState.toast.message}
        isVisible={asignacionesState.toast.visible}
        onClose={() => asignacionesState.setToast((t) => ({ ...t, visible: false }))}
      />

      <Toast
        variant={cursosState.toast.variant}
        message={cursosState.toast.message}
        isVisible={cursosState.toast.visible}
        onClose={() => cursosState.setToast((t) => ({ ...t, visible: false }))}
      />
    </AdminLayout>
  );
}
