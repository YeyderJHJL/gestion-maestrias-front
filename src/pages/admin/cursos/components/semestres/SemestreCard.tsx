import {
  ChevronDownIcon,
  ChevronRightIcon,
  EditIcon,
  PlusIcon,
  XIcon,
  Loader2Icon,
  UsersIcon,
} from 'lucide-react';
import { SemesterResponse } from '../../../../../services/semestersApiService';
import { AssignmentResponse } from '../../../../../services/assignmentsApiService';

interface Props {
  semestre: SemesterResponse;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  // asignaciones de este semestre
  assignments: AssignmentResponse[];
  assignmentsLoading: boolean;
  onAddAssignment: () => void;
  onEditAssignment: (a: AssignmentResponse) => void;
  onDeleteAssignment: (a: AssignmentResponse) => void;
  // permisos
  isCoordinator: boolean;
}

export function SemestreCard({
  semestre,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  assignments,
  assignmentsLoading,
  onAddAssignment,
  onEditAssignment,
  onDeleteAssignment,
  isCoordinator,
}: Props) {
  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      {/* Cabecera del semestre */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-surface-alt transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 text-text-muted" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-text-muted" />
          )}
          <h2 className="text-xl font-bold text-text">Semestre {semestre.code}</h2>
          <span className="text-sm text-text-muted bg-border px-2 py-0.5 rounded-full">
            Año {semestre.year}
          </span>
        </div>

        {!isCoordinator && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onEdit}
              className="p-1 text-primary hover:text-primary-light transition-colors"
              title="Editar semestre"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-accent hover:text-accent-light transition-colors"
              title="Eliminar semestre"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Panel de asignaciones */}
      {isExpanded && (
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-text">
              Cursos Asignados en {semestre.code}
            </h3>
            {!isCoordinator && (
              <button
                onClick={onAddAssignment}
                className="flex items-center gap-1 text-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary-light transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Asignar Curso a Docente
              </button>
            )}
          </div>

          {assignmentsLoading ? (
            <div className="flex items-center text-text-muted text-sm py-4 gap-2">
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Cargando asignaciones...
            </div>
          ) : assignments.length === 0 ? (
            <p className="text-sm text-text-muted italic py-4">
              No hay cursos asignados a este semestre.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assignments.map((asignacion) => (
                <AsignacionCard
                  key={asignacion.id}
                  asignacion={asignacion}
                  isCoordinator={isCoordinator}
                  onEdit={() => onEditAssignment(asignacion)}
                  onDelete={() => onDeleteAssignment(asignacion)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-componente tarjeta de asignación ─────────────────────────────────────
interface AsignacionCardProps {
  asignacion: AssignmentResponse;
  isCoordinator: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function AsignacionCard({ asignacion, isCoordinator, onEdit, onDelete }: AsignacionCardProps) {
  return (
    <div className="bg-surface border border-border p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-3">
        <div className="pl-2">
          <span className="text-xs font-semibold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
            {asignacion.courseCode}
          </span>
          <h4 className="font-bold text-text mt-2 leading-tight">{asignacion.courseName}</h4>
        </div>

        {!isCoordinator && (
          <div className="flex gap-1">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
              title="Editar asignación"
            >
              <EditIcon className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg text-text-muted hover:bg-accent/10 hover:text-accent transition-colors"
              title="Eliminar asignación"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="pl-2 flex items-center gap-2 mt-4 text-sm font-medium text-text-muted">
        <UsersIcon className="w-4 h-4 text-primary" />
        <span>{asignacion.teacherName}</span>
      </div>
      <div className="pl-2 text-xs text-text-muted/70 mt-2">
        Asignado el: {asignacion.assignmentDate}
      </div>
    </div>
  );
}
