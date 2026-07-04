import { useRef } from 'react';
import { Loader2Icon, FileTextIcon, UploadCloudIcon, XCircleIcon } from 'lucide-react';
import { Modal } from '../../../../components/Modal';
import { EnrollmentResponse, ENROLLMENT_STATES } from '../../../../services/enrollmentsApiService';
import { CourseResponse } from '../../../../services/coursesApiService';
import { SemesterResponse } from '../../../../services/semestersApiService';
import { EnrollmentFormState } from '../hooks/useEnrollmentForm';
import { EnrollmentStateTag } from './EnrollmentStateTag';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: EnrollmentResponse | null;
  form: EnrollmentFormState;
  setForm: (f: EnrollmentFormState) => void;
  courses: CourseResponse[];
  semesters: SemesterResponse[];
  loadingDeps: boolean;
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  studentName: string;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text text-sm';

const ACCEPTED_RES = '.pdf,application/pdf';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATES_LIST = Object.values(ENROLLMENT_STATES);

export function EnrollmentFormModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  courses,
  semesters,
  loadingDeps,
  submitting,
  formError,
  onSubmit,
  studentName,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editingItem;

  const clearFile = () => {
    setForm({ ...form, resolutionFile: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Matrícula' : 'Nueva Matrícula'}
      size="md"
      accentBorder
    >
      {/* Estudiante */}
      <div className="mb-4 px-4 py-2.5 rounded-lg bg-primary/5 border border-primary/20 text-sm text-text">
        <span className="text-text-muted">Estudiante: </span>
        <span className="font-semibold">{studentName}</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">

        {/* Curso */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Curso <span className="text-accent">*</span>
          </label>
          {loadingDeps ? (
            <div className="flex items-center gap-2 text-text-muted text-sm py-2">
              <Loader2Icon className="w-4 h-4 animate-spin" /> Cargando…
            </div>
          ) : (
            <select
              required
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className={inputClass}
            >
              <option value="">Selecciona un curso</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Semestre */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Semestre <span className="text-accent">*</span>
          </label>
          {loadingDeps ? (
            <div className="flex items-center gap-2 text-text-muted text-sm py-2">
              <Loader2Icon className="w-4 h-4 animate-spin" /> Cargando…
            </div>
          ) : (
            <select
              required
              value={form.semesterId}
              onChange={(e) => setForm({ ...form, semesterId: Number(e.target.value) })}
              className={inputClass}
            >
              <option value="">Selecciona un semestre</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} ({s.year})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Estado */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Estado <span className="text-accent">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {STATES_LIST.map((state) => (
              <label
                key={state.id}
                className={`flex items-center justify-center gap-2 p-2.5 border rounded-lg cursor-pointer text-sm transition-colors ${
                  form.stateId === state.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-surface-alt'
                }`}
              >
                <input
                  type="radio"
                  name="stateId"
                  value={state.id}
                  checked={form.stateId === state.id}
                  onChange={() => setForm({ ...form, stateId: state.id })}
                  className="sr-only"
                />
                <EnrollmentStateTag stateCode={state.code} stateName={state.name} />
              </label>
            ))}
          </div>
        </div>

        {/* Fecha */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Fecha de matrícula <span className="text-accent">*</span>
          </label>
          <input
            type="date"
            required
            value={form.enrollmentDate}
            onChange={(e) => setForm({ ...form, enrollmentDate: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Resolución (opcional) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Resolución{' '}
            <span className="text-text-muted font-normal">(opcional — PDF)</span>
          </label>
          {form.resolutionFile ? (
            <div className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-primary/40 bg-primary/5 text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <FileTextIcon className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate text-text">{form.resolutionFile.name}</span>
                <span className="text-text-muted shrink-0">
                  ({formatBytes(form.resolutionFile.size)})
                </span>
              </div>
              <button
                type="button"
                onClick={clearFile}
                className="text-text-muted hover:text-accent transition-colors shrink-0"
              >
                <XCircleIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-lg text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
            >
              <UploadCloudIcon className="w-4 h-4" />
              {isEditing && editingItem?.resolutionFile
                ? 'Reemplazar resolución'
                : 'Seleccionar PDF'}
            </button>
          )}
          {isEditing && editingItem?.resolutionFile && !form.resolutionFile && (
            <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
              <FileTextIcon className="w-3 h-3" />
              Resolución actual: {editingItem.resolutionFile.originalName}
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_RES}
            onChange={(e) => setForm({ ...form, resolutionFile: e.target.files?.[0] ?? null })}
            className="hidden"
          />
        </div>

        {/* Observaciones */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Observaciones <span className="text-text-muted font-normal">(opcional)</span>
          </label>
          <textarea
            rows={3}
            value={form.observations}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
            placeholder="Ej.: Estudiante con beca parcial…"
            className={inputClass}
          />
        </div>

        {/* Error */}
        {formError && (
          <p className="text-sm text-accent bg-accent/10 border border-accent/30 rounded-lg px-4 py-2">
            {formError}
          </p>
        )}

        {/* Acciones */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {submitting && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Guardar cambios' : 'Registrar matrícula'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
