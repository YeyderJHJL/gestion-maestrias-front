import { PlusIcon, PencilIcon, Trash2Icon, FileTextIcon, XIcon } from 'lucide-react';
import { StudentResponse } from '../../../../services/studentsApiService';
import { EnrollmentResponse } from '../../../../services/enrollmentsApiService';
import { EnrollmentStateTag } from '../EnrollmentStateTag';

interface Props {
  student: StudentResponse;
  enrollments: EnrollmentResponse[];
  isCoordinator: boolean;
  onClose: () => void;
  onCreateEnrollment: () => void;
  onEditEnrollment: (e: EnrollmentResponse) => void;
  onDeleteEnrollment: (e: EnrollmentResponse) => void;
}

const STATUS_LABEL: Record<string, string> = {
  Regular: 'Regular',
  Reactualizacion: 'Reactualización',
};

const STATUS_CLASS: Record<string, string> = {
  Regular: 'bg-green-100 text-green-700 border border-green-200',
  Reactualizacion: 'bg-amber-100 text-amber-700 border border-amber-200',
};

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

// Única declaración de formatDate — usada por EnrollmentCard abajo
function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function StudentDetailPanel({
  student,
  enrollments,
  isCoordinator,
  onClose,
  onCreateEnrollment,
  onEditEnrollment,
  onDeleteEnrollment,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* ── Header estudiante ─────────────────────────────────────────── */}
      <div className="p-5 border-b border-border bg-surface shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-base font-bold shrink-0">
              {getInitials(student.firstName, student.lastName)}
            </div>
            <div>
              <h2 className="font-serif font-bold text-text leading-tight">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-sm text-text-muted">{student.email}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    STATUS_CLASS[student.status] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {STATUS_LABEL[student.status] ?? student.status}
                </span>
                <span className="text-xs text-text-muted">Promoción {student.yearPromotion}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors shrink-0"
            title="Cerrar panel"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Datos adicionales */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-sm">
          {student.cui && (
            <>
              <dt className="text-text-muted">CUI</dt>
              <dd className="text-text font-medium">{student.cui}</dd>
            </>
          )}
          {student.paymentCode && (
            <>
              <dt className="text-text-muted">Cód. pago</dt>
              <dd className="text-text font-medium">{student.paymentCode}</dd>
            </>
          )}
          {student.phone && (
            <>
              <dt className="text-text-muted">Teléfono</dt>
              <dd className="text-text font-medium">{student.phone}</dd>
            </>
          )}
        </dl>
      </div>

      {/* ── Encabezado matrículas ──────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <h3 className="text-sm font-semibold text-text">
          Matrículas
          <span className="ml-2 text-xs font-normal text-text-muted">
            ({enrollments.length})
          </span>
        </h3>
        {!isCoordinator && (
          <button
            onClick={onCreateEnrollment}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Agregar
          </button>
        )}
      </div>

      {/* ── Lista de matrículas ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted text-sm gap-2">
            <FileTextIcon className="w-8 h-8 opacity-25" />
            <span>Sin matrículas registradas</span>
            {!isCoordinator && (
              <button
                onClick={onCreateEnrollment}
                className="mt-2 text-xs text-primary hover:underline"
              >
                + Registrar primera matrícula
              </button>
            )}
          </div>
        ) : (
          enrollments.map((enr) => (
            <EnrollmentCard
              key={enr.id}
              enrollment={enr}
              isCoordinator={isCoordinator}
              onEdit={() => onEditEnrollment(enr)}
              onDelete={() => onDeleteEnrollment(enr)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── Tarjeta individual de matrícula ───────────────────────────────────────────

interface CardProps {
  enrollment: EnrollmentResponse;
  isCoordinator: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function EnrollmentCard({ enrollment: e, isCoordinator, onEdit, onDelete }: CardProps) {
  return (
    <div className="border border-border rounded-lg p-4 bg-surface space-y-2.5 hover:border-primary/40 transition-colors">
      {/* Curso + estado */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text leading-snug truncate">
            {e.courseName}
          </p>
          <p className="text-xs text-text-muted mt-0.5">{e.courseCode}</p>
        </div>
        <EnrollmentStateTag stateCode={e.stateCode} stateName={e.stateName} />
      </div>

      {/* Semestre y fecha */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
        <dt className="text-text-muted">Semestre</dt>
        <dd className="text-text">{e.semesterCode} ({e.semesterYear})</dd>
        <dt className="text-text-muted">Fecha matrícula</dt>
        <dd className="text-text">{formatDate(e.enrollmentDate)}</dd>
      </dl>

      {/* Resolución */}
      {e.resolutionFile && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <FileTextIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{e.resolutionFile.originalName}</span>
        </div>
      )}

      {/* Observaciones */}
      {e.observations && (
        <p className="text-xs text-text-muted italic border-t border-border pt-2">
          {e.observations}
        </p>
      )}

      {/* Acciones */}
      {!isCoordinator && (
        <div className="flex gap-2 justify-end pt-1 border-t border-border">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <PencilIcon className="w-3 h-3" />
            Editar
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-xs text-red-500 hover:underline"
          >
            <Trash2Icon className="w-3 h-3" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
