import { CheckCircleIcon, MinusCircleIcon } from 'lucide-react';
import { StatusBadge } from '../../../../components/StatusBadge';
import { StudentResponse } from '../../../../services/studentsApiService';
import { getInitials, STUDENT_STATUS_VARIANT, studentStatusLabel } from '../utils/studentFormat';

interface Props {
  student: StudentResponse;
  activeEnrollmentCount: number;
  onSelect: () => void;
}

export function StudentRow({ student, activeEnrollmentCount, onSelect }: Props) {
  const isEnrolled = activeEnrollmentCount > 0;

  return (
    <li>
      <button
        onClick={onSelect}
        className="w-full text-left px-5 py-4 hover:bg-surface-alt transition-colors flex items-center gap-4"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
          {getInitials(student.firstName, student.lastName)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text">
            {student.firstName} {student.lastName}
          </p>
          <p className="text-sm text-text-muted truncate">{student.email}</p>
        </div>

        {/* Metadata + estado matrícula */}
        <div className="flex items-center gap-3 shrink-0">
          {student.cui && (
            <span className="text-xs text-text-muted hidden md:inline">CUI: {student.cui}</span>
          )}
          <span className="text-xs text-text-muted">Prom. {student.yearPromotion}</span>

          <StatusBadge variant={STUDENT_STATUS_VARIANT[student.status ?? 'Regular'] ?? 'matriculado'}>
            {studentStatusLabel(student.status ?? 'Regular')}
          </StatusBadge>

          {isEnrolled ? (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <CheckCircleIcon className="w-4 h-4" />
              {activeEnrollmentCount} curso{activeEnrollmentCount !== 1 ? 's' : ''}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-text-muted">
              <MinusCircleIcon className="w-4 h-4" />
              Sin matrícula
            </span>
          )}
        </div>
      </button>
    </li>
  );
}
