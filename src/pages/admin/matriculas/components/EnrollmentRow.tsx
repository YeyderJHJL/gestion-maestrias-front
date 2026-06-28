import { useState } from 'react';
import { PencilIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { FilePreviewModal } from '../../../../components/FilePreviewModal';
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
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>

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
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1 text-primary hover:text-primary-light transition-colors"
              title="Ver resolución"
            >
              <EyeIcon className="w-3.5 h-3.5" />
              {e.resolutionFile.originalName}
            </button>
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

      <FilePreviewModal
        fileId={e.resolutionFile?.id ?? null}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
