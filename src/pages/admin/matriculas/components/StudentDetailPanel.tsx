import { PlusIcon } from 'lucide-react';
import { StatusBadge } from '../../../../components/StatusBadge';
import { StudentResponse } from '../../../../services/studentsApiService';
import { getInitials, STUDENT_STATUS_VARIANT, studentStatusLabel } from '../utils/studentFormat';

interface Props {
  student: StudentResponse;
  isCoordinator: boolean;
  onNewEnrollment: () => void;
  onBack: () => void;
}

export function StudentDetailPanel({ student, isCoordinator, onNewEnrollment, onBack }: Props) {
  return (
    <div className="bg-surface border-l-4 border-primary rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
            {getInitials(student.firstName, student.lastName)}
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-serif font-bold text-text">
              {student.firstName} {student.lastName}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted">
              {student.cui && <span>CUI: {student.cui}</span>}
              {student.paymentCode && <span>Cód. pago: {student.paymentCode}</span>}
              {student.phone && <span>Tel: {student.phone}</span>}
            </div>
            <p className="text-sm text-text-muted">
              {student.email} · Promoción {student.yearPromotion}
            </p>
            <div className="pt-1">
              <StatusBadge variant={STUDENT_STATUS_VARIANT[student.status] ?? 'matriculado'}>
                {studentStatusLabel(student.status)}
              </StatusBadge>
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {!isCoordinator && (
            <button
              onClick={onNewEnrollment}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Nueva matrícula
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 border border-border text-text-muted rounded-lg hover:bg-surface-alt transition-colors text-sm"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
