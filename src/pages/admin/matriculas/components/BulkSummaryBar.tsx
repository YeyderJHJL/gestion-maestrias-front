import { UsersIcon } from 'lucide-react';

interface Props {
  courseName: string;
  semesterLabel: string;
  selectedCount: number;
  selectedLabel: string;
  canSubmit: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function BulkSummaryBar({
  courseName,
  semesterLabel,
  selectedCount,
  selectedLabel,
  canSubmit,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div className="sticky bottom-0 bg-surface border-t border-border px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 text-sm min-w-0">
        <div className="flex items-center gap-2 text-primary shrink-0">
          <UsersIcon className="w-4 h-4" />
          <span className="font-semibold whitespace-nowrap">{selectedCount}</span>
        </div>
        <span className="text-text-muted truncate">
          {selectedLabel} · {courseName} ({semesterLabel})
        </span>
      </div>
      <div className="flex gap-3 shrink-0 self-end md:self-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!canSubmit}
          className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar matrícula masiva
        </button>
      </div>
    </div>
  );
}