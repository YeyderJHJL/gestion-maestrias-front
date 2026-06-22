import { PencilIcon, Trash2Icon, FileTextIcon } from 'lucide-react';
import { EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { EnrollmentStateTag } from './EnrollmentStateTag';
import { formatDate } from '../utils/studentFormat';

interface Props {
  enrollment: EnrollmentResponse;
  isCoordinator: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function EnrollmentRow({ enrollment: e, isCoordinator, onEdit, onDelete }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-surface-alt transition-colors">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-text">{e.courseName}</span>
          <span className="text-xs text-text-muted">{e.courseCode}</span>
          <EnrollmentStateTag stateCode={e.stateCode} stateName={e.stateName} />
        </div>
        <div className="flex flex-wrap gap-4 mt-1 text-sm text-text-muted">
          <span>
            Semestre: {e.semesterCode} ({e.semesterYear})
          </span>
          <span>Fecha: {formatDate(e.enrollmentDate)}</span>
          {e.resolutionFile && (
            <span className="flex items-center gap-1">
              <FileTextIcon className="w-3.5 h-3.5" />
              {e.resolutionFile.originalName}
            </span>
          )}
        </div>
        {e.observations && <p className="text-xs text-text-muted italic mt-1">{e.observations}</p>}
      </div>
      {!isCoordinator && (
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={onEdit} className="flex items-center gap-1 text-sm text-primary hover:underline">
            <PencilIcon className="w-3.5 h-3.5" /> Editar
          </button>
          <button onClick={onDelete} className="flex items-center gap-1 text-sm text-red-500 hover:underline">
            <Trash2Icon className="w-3.5 h-3.5" /> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
