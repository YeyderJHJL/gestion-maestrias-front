import { Loader2Icon } from 'lucide-react';
import { Modal } from '../../../../../components/Modal';
import { CourseResponse } from '../../../../../services/coursesApiService';
import { CursoFormState } from '../../hooks/useCursos';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: CourseResponse | null;
  form: CursoFormState;
  setForm: (form: CursoFormState) => void;
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text';

export function CursoFormModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  submitting,
  formError,
  onSubmit,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Editar Curso' : 'Nuevo Curso'}
      size="lg"
      accentBorder
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-text">
              Nombre del curso <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={255}
              placeholder="Ej. Fundamentos de Programación"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Código */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Código <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={50}
              placeholder="Ej. CS-101"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Spacer para mantener grid */}
          <div />

          {/* Fecha inicio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Fecha de inicio <span className="text-accent">*</span>
            </label>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Fecha fin */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Fecha de fin <span className="text-accent">*</span>
            </label>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={inputClass}
            />
          </div>

          {/* Observaciones */}
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-text">
              Observaciones de fechas
            </label>
            <textarea
              rows={3}
              placeholder="Registrar cambios o ajustes de fechas aquí"
              value={form.observations}
              onChange={(e) => setForm({ ...form, observations: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-text">Sílabus (Archivo)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setForm({ ...form, syllabusFile: e.target.files[0] });
                } else {
                  setForm({ ...form, syllabusFile: null });
                }
              }}
              className={inputClass}
            />
            {editingItem?.syllabusFile && !form.syllabusFile && (
              <p className="text-sm text-text-muted">
                Archivo actual: <span className="text-primary">{editingItem.syllabusFile.originalName}</span>
              </p>
            )}
            {form.syllabusFile && (
              <p className="text-sm text-text-muted">Archivo seleccionado: {form.syllabusFile.name}</p>
            )}
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
            {editingItem ? 'Guardar cambios' : 'Guardar curso'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
