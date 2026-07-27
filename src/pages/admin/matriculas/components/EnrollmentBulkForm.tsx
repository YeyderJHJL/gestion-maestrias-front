import { useRef } from 'react';
import { Loader2Icon, FileTextIcon, UploadCloudIcon, XCircleIcon } from 'lucide-react';
import { CourseResponse } from '../../../../services/coursesApiService';
import { SemesterResponse } from '../../../../services/semestersApiService';
import { ENROLLMENT_STATES } from '../../../../services/enrollmentsApiService';
import { EnrollmentStateTag } from './EnrollmentStateTag';

export interface BulkFormState {
  courseId: string;
  semesterId: number | '';
  stateId: number;
  enrollmentDate: string;
  resolutionFile: File | null;
  observations: string;
}

interface Props {
  form: BulkFormState;
  setForm: (f: BulkFormState) => void;
  courses: CourseResponse[];
  semesters: SemesterResponse[];
  loadingDeps: boolean;
  disabled?: boolean;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text text-sm';
const ACCEPTED_RES = '.pdf,application/pdf';
const STATES_LIST = Object.values(ENROLLMENT_STATES);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EnrollmentBulkForm({
  form,
  setForm,
  courses,
  semesters,
  loadingDeps,
  disabled,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    setForm({ ...form, resolutionFile: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
        <span className="w-1.5 h-5 rounded-full bg-accent" />
        Configuración del curso destino
      </div>

      {/* Fila 1: Curso · Semestre · Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              disabled={disabled}
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
              disabled={disabled}
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

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Fecha de matrícula <span className="text-accent">*</span>
          </label>
          <input
            type="date"
            required
            disabled={disabled}
            value={form.enrollmentDate}
            onChange={(e) => setForm({ ...form, enrollmentDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Fila 2: Estado (radio buttons) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text">
          Estado <span className="text-accent">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2 max-w-md">
          {STATES_LIST.map((state) => (
            <label
              key={state.id}
              className={`flex items-center justify-center gap-2 p-2.5 border rounded-lg cursor-pointer text-sm transition-colors ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                form.stateId === state.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-surface-alt'
              }`}
            >
              <input
                type="radio"
                name="bulkStateId"
                disabled={disabled}
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

      {/* Fila 3: Resolución + Observaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {!disabled && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-text-muted hover:text-accent transition-colors shrink-0"
                >
                  <XCircleIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-lg text-sm text-text-muted hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
            >
              <UploadCloudIcon className="w-4 h-4" />
              Seleccionar PDF
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_RES}
            disabled={disabled}
            onChange={(e) => setForm({ ...form, resolutionFile: e.target.files?.[0] ?? null })}
            className="hidden"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text">
            Observaciones{' '}
            <span className="text-text-muted font-normal">(opcional)</span>
          </label>
          <textarea
            rows={2}
            disabled={disabled}
            value={form.observations}
            onChange={(e) => setForm({ ...form, observations: e.target.value })}
            placeholder="Ej.: Estudiantes con beca parcial…"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}