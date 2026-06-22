import { useRef } from 'react';
import { Loader2Icon, FileTextIcon, UploadCloudIcon, ExternalLinkIcon, XCircleIcon } from 'lucide-react';
import { Modal } from '../../../../../components/Modal';
import { AssignmentResponse } from '../../../../../services/assignmentsApiService';
import { StoredFileResponse } from '../../../../../services/filesApiService';
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
  /** URL firmada del sílabo ya existente (solo en modo edición) */
  existingSyllabus: StoredFileResponse | null;
  loadingSyllabus: boolean;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text';

const ACCEPTED = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  existingSyllabus,
  loadingSyllabus,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editingItem;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm({ ...form, syllabusFile: file });
  };

  const clearFile = () => {
    setForm({ ...form, syllabusFile: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Asignación' : 'Nueva Asignación'}
      size="md"
      accentBorder
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">

          {/* ── Curso ──────────────────────────────────────────────────────── */}
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

          {/* ── Docente ────────────────────────────────────────────────────── */}
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

          {/* ── Fecha de asignación ────────────────────────────────────────── */}
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

          {/* ── Sílabo ─────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Sílabo{' '}
              <span className="text-text-muted font-normal">(opcional — PDF o Word)</span>
            </label>

            {/* Sílabo existente */}
            {isEditing && (
              <div className="min-h-[2.5rem]">
                {loadingSyllabus ? (
                  <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    Cargando sílabo actual...
                  </div>
                ) : existingSyllabus ? (
                  <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-border bg-surface-alt text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileTextIcon className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate text-text">{existingSyllabus.originalName}</span>
                      <span className="text-text-muted shrink-0">
                        ({formatBytes(existingSyllabus.sizeBytes)})
                      </span>
                    </div>
                    <a
                      href={existingSyllabus.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline shrink-0"
                    >
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                      Ver
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-text-muted py-1">Sin sílabo registrado.</p>
                )}
              </div>
            )}

            {/* Archivo seleccionado localmente */}
            {form.syllabusFile ? (
              <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-primary/40 bg-primary/5 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <FileTextIcon className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate text-text">{form.syllabusFile.name}</span>
                  <span className="text-text-muted shrink-0">
                    ({formatBytes(form.syllabusFile.size)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-text-muted hover:text-accent transition-colors shrink-0"
                  title="Quitar archivo"
                >
                  <XCircleIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-lg text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
              >
                <UploadCloudIcon className="w-4 h-4" />
                {isEditing && existingSyllabus ? 'Reemplazar sílabo' : 'Seleccionar archivo'}
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* ── Error ──────────────────────────────────────────────────────────── */}
        {formError && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
            {formError}
          </p>
        )}

        {/* ── Acciones ───────────────────────────────────────────────────────── */}
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
            {isEditing ? 'Guardar cambios' : 'Guardar asignación'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
