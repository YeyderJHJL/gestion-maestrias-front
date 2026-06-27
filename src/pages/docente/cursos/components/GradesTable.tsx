import { LockIcon, EditIcon, PlusIcon } from 'lucide-react';
import { StatusBadge } from '../../../../components/StatusBadge';
import type { GradeResponse } from '../../../../services/gradesApiService';
import type { StudentGradeRow } from '../hooks/useCursoDetalle';

interface GradesTableProps {
  rows: StudentGradeRow[];
  onEditGrade: (grade: GradeResponse, studentName: string) => void;
  onCreateGrade: (enrollment: StudentGradeRow['enrollment']) => void;
}

export function GradesTable({ rows, onEditGrade, onCreateGrade }: GradesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-alt">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Estudiante
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Nota final
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, index) => {
            const { enrollment, grade } = row;
            const aprobado = grade ? grade.value >= 11 : false;
            return (
              <tr
                key={enrollment.id}
                className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
              >
                <td className="px-6 py-4 text-sm text-text font-medium">
                  {enrollment.studentName}
                </td>
                <td className="px-6 py-4">
                  {grade ? (
                    <div className="flex items-center gap-2">
                      <LockIcon className="w-4 h-4 text-text-muted" />
                      <span className="font-semibold text-text">{grade.value}</span>
                    </div>
                  ) : (
                    <span className="text-text-muted italic">Sin registrar</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {grade ? (
                    <StatusBadge variant={aprobado ? 'aprobado' : 'desaprobado'}>
                      {aprobado ? 'Aprobado' : 'Desaprobado'}
                    </StatusBadge>
                  ) : (
                    <StatusBadge variant="pendiente">Pendiente</StatusBadge>
                  )}
                </td>
                <td className="px-6 py-4">
                  {grade ? (
                    <button
                      onClick={() => onEditGrade(grade, enrollment.studentName)}
                      className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
                    >
                      <EditIcon className="w-4 h-4" />
                      Editar
                    </button>
                  ) : (
                    <button
                      onClick={() => onCreateGrade(enrollment)}
                      className="flex items-center gap-1 text-sm text-accent hover:text-accent-light transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Registrar nota
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-center text-text-muted py-8">
          No hay estudiantes matriculados en este curso
        </p>
      )}
    </div>
  );
}
