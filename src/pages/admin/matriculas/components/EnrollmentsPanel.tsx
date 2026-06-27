import { FileTextIcon } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { EnrollmentRow } from './EnrollmentRow';

interface Props {
  enrollments: EnrollmentResponse[];
  isCoordinator: boolean;
  onAdd: () => void;
  onEdit: (enrollment: EnrollmentResponse) => void;
  onDelete: (enrollment: EnrollmentResponse) => void;
}

export function EnrollmentsPanel({ enrollments, isCoordinator, onAdd, onEdit, onDelete }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-serif font-bold text-text">
          Matrículas registradas
          <span className="ml-2 text-sm font-normal text-text-muted">({enrollments.length})</span>
        </h3>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState
          icon={FileTextIcon}
          title="No hay matrículas registradas"
          subtitle="Este estudiante aún no tiene matrículas en ningún curso."
          action={!isCoordinator ? { label: '+ Registrar primera matrícula', onClick: onAdd } : undefined}
        />
      ) : (
        <div className="divide-y divide-border">
          {enrollments.map((enr) => (
            <EnrollmentRow
              key={enr.id}
              enrollment={enr}
              isCoordinator={isCoordinator}
              onEdit={() => onEdit(enr)}
              onDelete={() => onDelete(enr)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
