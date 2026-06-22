import { Loader2Icon } from 'lucide-react';
import { Modal } from '../../../../../components/Modal';
import { SemesterResponse } from '../../../../../services/semestersApiService';
import { SemestreFormState } from '../../hooks/useSemestres';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: SemesterResponse | null;
  form: SemestreFormState;
  setForm: (form: SemestreFormState) => void;
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text';

export function SemestreFormModal({
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
      title={editingItem ? 'Editar Semestre' : 'Nuevo Semestre'}
      size="md"
      accentBorder
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Año <span className="text-accent">*</span>
            </label>
            <input
              type="number"
              required
              min={2001}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Código <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={50}
              placeholder="Ej. 2025-I"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
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
            {editingItem ? 'Guardar cambios' : 'Guardar semestre'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
