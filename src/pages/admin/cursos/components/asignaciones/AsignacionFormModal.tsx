import { Loader2Icon } from 'lucide-react';
import { Modal } from '../../../../../components/Modal';
import { AssignmentResponse } from '../../../../../services/assignmentsApiService';
import { TeacherResponse } from '../../../../../services/teachersApiService';
import { CourseResponse } from '../../../../../services/coursesApiService';
import { AsignacionFormState } from '../../hooks/useAsignaciones';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: AssignmentResponse | null;
  form: AsignacionFormState;
  setForm: (form: AsignacionFormState) => void;
  teachers: TeacherResponse[];
  courses: CourseResponse[];
  loadingDeps: boolean;
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text';

export function AsignacionFormModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  teachers,
  courses,
  loadingDeps,
  submitting,
  formError,
  onSubmit,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Editar Asignación' : 'Nueva Asignación'}
      size="md"
      accentBorder
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Curso */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Curso <span className="text-accent">*</span>
            </label>
            {loadingDeps ? (
              <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Cargando cursos...
              </div>
            ) : (
              <select
                required
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className={inputClass}
                disabled={!!editingItem}
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Docente */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Docente <span className="text-accent">*</span>
            </label>
            {loadingDeps ? (
              <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Cargando docentes...
              </div>
            ) : (
              <select
                required
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                className={inputClass}
                disabled={!!editingItem}
              >
                <option value="">Selecciona un docente</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName} ({teacher.type})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Fecha de asignación */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Fecha de asignación <span className="text-accent">*</span>
            </label>
            <input
              type="date"
              required
              value={form.assignmentDate}
              onChange={(e) => setForm({ ...form, assignmentDate: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        {formError && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
            {formError}
          </p>
        )}

        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {editingItem ? 'Guardar cambios' : 'Guardar asignación'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
