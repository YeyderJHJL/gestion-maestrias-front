import { AlertTriangleIcon } from 'lucide-react';
import { Modal } from '../../../../components/Modal';
import type { EditingGrade } from '../hooks/useCursoDetalle';

interface EditGradeModalProps {
  editingGrade: EditingGrade | null;
  gradeValue: string;
  gradeMotivo: string;
  saving: boolean;
  onGradeValueChange: (value: string) => void;
  onGradeMotivoChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function EditGradeModal({
  editingGrade,
  gradeValue,
  gradeMotivo,
  saving,
  onGradeValueChange,
  onGradeMotivoChange,
  onSave,
  onClose,
}: EditGradeModalProps) {
  if (!editingGrade) return null;

  return (
    <Modal
      isOpen={!!editingGrade}
      onClose={onClose}
      title="Modificar nota"
      size="sm"
      accentBorder
    >
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(); }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="bg-surface-alt rounded-lg p-4">
            <p className="text-sm text-text-muted mb-1">
              Estudiante: {editingGrade.studentName}
            </p>
            <p className="text-sm text-text-muted mb-1">Nota actual</p>
            <p className="text-2xl font-bold text-text">{editingGrade.currentValue}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Nueva nota <span className="text-accent">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={gradeValue}
              onChange={(e) => onGradeValueChange(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Motivo de la modificación <span className="text-accent">*</span>
            </label>
            <textarea
              rows={4}
              value={gradeMotivo}
              onChange={(e) => onGradeMotivoChange(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe el motivo del cambio..."
            />
          </div>

          <div className="bg-warning/10 border border-warning rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangleIcon className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text">
                Esta modificación quedará registrada en el historial de auditoría.
              </p>
            </div>
          </div>
        </div>

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
            disabled={saving || !gradeValue || !gradeMotivo}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar modificación'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
