import { CheckCircleIcon, MinusCircleIcon } from 'lucide-react';
import { StatusBadge } from '../../../../components/StatusBadge';
import { StudentResponse } from '../../../../services/studentsApiService';
import { getInitials, STUDENT_STATUS_VARIANT, studentStatusLabel } from '../utils/studentFormat';

interface BulkModeProps {
  enabled: true;
  isSelected: boolean;
  isAlreadyEnrolled: boolean;
  onToggle: () => void;
}

interface NormalModeProps {
  enabled?: false | undefined;
  onSelect: () => void;
}

type Props = {
  student: StudentResponse;
  activeEnrollmentCount: number;
} & (BulkModeProps | NormalModeProps);

export function StudentRow(props: Props) {
  const { student, activeEnrollmentCount } = props;
  const isEnrolled = activeEnrollmentCount > 0;

  const sharedContent = (
    <>
      <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0">
        {getInitials(student.firstName, student.lastName)}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-text">
          {student.firstName} {student.lastName}
        </p>
        <p className="text-sm text-text-muted truncate">{student.email}</p>
      </div>

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
    </>
  );

  // ── Modo masivo ──
  if (props.enabled) {
    const { isSelected, isAlreadyEnrolled, onToggle } = props;

    return (
      <li>
        <label
          className={`w-full text-left px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors ${
            isAlreadyEnrolled
              ? 'bg-surface-alt/50 opacity-60'
              : isSelected
                ? 'bg-primary/5 hover:bg-primary/10'
                : 'hover:bg-surface-alt'
          }`}
        >
          <input
            type="checkbox"
            checked={isSelected}
            disabled={isAlreadyEnrolled}
            onChange={onToggle}
            className="w-4 h-4 shrink-0 accent-primary disabled:opacity-30"
          />

          {sharedContent}

          {isAlreadyEnrolled && (
            <StatusBadge variant="en-curso">Ya matriculado</StatusBadge>
          )}
        </label>
      </li>
    );
  }

  // ── Modo normal (comportamiento original intacto) ──
  return (
    <li>
      <button
        onClick={props.onSelect}
        className="w-full text-left px-5 py-4 hover:bg-surface-alt transition-colors flex items-center gap-4"
      >
        {sharedContent}
      </button>
    </li>
  );
}
