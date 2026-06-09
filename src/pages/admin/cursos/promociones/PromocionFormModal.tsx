import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { Modal } from '../../../../components/Modal';
import { ProgramResponse } from '../../../../services/programsApiService';
import { PromotionResponse } from '../../../../services/promotionsApiService';
import { PromocionFormState } from './usePromociones';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem: PromotionResponse | null;
  form: PromocionFormState;
  setForm: (form: PromocionFormState) => void;
  programs: ProgramResponse[];
  loadingPrograms: boolean;
  submitting: boolean;
  formError: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

export function PromocionFormModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  programs,
  loadingPrograms,
  submitting,
  formError,
  onSubmit,
}: Props) {
  const inputClass =
    'w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Editar Promoción' : 'Nueva Promoción'}
      size="lg"
      accentBorder
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <label className="block text-sm font-medium text-text">Programa *</label>
            {loadingPrograms ? (
              <div className="flex items-center gap-2 text-text-muted text-sm py-2">
                <Loader2Icon className="w-4 h-4 animate-spin" />
                Cargando programas...
              </div>
            ) : (
              <select
                required
                value={form.programId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    programId: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className={inputClass}
              >
                <option value="">Selecciona un programa</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Nombre *</label>
            <input
              type="text"
              required
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Periodo *</label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="Primer semestre"
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Año *</label>
            <input
              type="number"
              required
              min={2000}
              max={2100}
              value={form.year}
              onChange={(e) =>
                setForm({ ...form, year: e.target.value === '' ? '' : Number(e.target.value) })
              }
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
            {editingItem ? 'Guardar cambios' : 'Guardar promoción'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
