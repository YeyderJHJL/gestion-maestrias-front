import { Modal } from '../../../../components/Modal';
import type { EditingGrade } from '../hooks/useCursoDetalle';

interface EditGradeModalProps {
  editingGrade: EditingGrade | null;
  gradeValue: string;
  saving: boolean;
  onGradeValueChange: (value: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function EditGradeModal({
  editingGrade,
  gradeValue,
  saving,
  onGradeValueChange,
  onSave,
  onClose,
}: EditGradeModalProps) {
  if (!editingGrade) return null;

  const isEditing = !!editingGrade.gradeId;
  const title = isEditing ? 'Modificar nota' : 'Registrar nota';
  const valueNum = Number(gradeValue);
  const canSave = !saving && gradeValue !== '' && valueNum >= 0 && valueNum <= 20;

  return (
    <Modal
      isOpen={!!editingGrade}
      onClose={onClose}
      title={title}
      size="sm"
      accentBorder
    >
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(); }}
        className="space-y-6"
      >
        <div className="bg-surface-alt rounded-lg p-4">
          <p className="text-sm text-text-muted mb-1">
            Estudiante: {editingGrade.studentName}
          </p>
          {isEditing && (
            <>
              <p className="text-sm text-text-muted mb-1">Nota actual</p>
              <p className="text-2xl font-bold text-text">{editingGrade.currentValue}</p>
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            {isEditing ? 'Nueva nota' : 'Nota'} <span className="text-accent">*</span>
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
            disabled={!canSave}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : (isEditing ? 'Guardar modificación' : 'Registrar nota')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
