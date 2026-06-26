import { LockIcon, EditIcon } from 'lucide-react';
import { StatusBadge } from '../../../../components/StatusBadge';
import type { GradeResponse } from '../../../../services/gradesApiService';

interface GradesTableProps {
  grades: GradeResponse[];
  onEditGrade: (grade: GradeResponse, studentName: string) => void;
}

export function GradesTable({ grades, onEditGrade }: GradesTableProps) {
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
          {grades.map((grade, index) => {
            const aprobado = grade.value >= 11;
            return (
              <tr
                key={grade.id}
                className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
              >
                <td className="px-6 py-4 text-sm text-text font-medium">
                  {grade.studentEmail}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <LockIcon className="w-4 h-4 text-text-muted" />
                    <span className="font-semibold text-text">{grade.value}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge variant={aprobado ? 'aprobado' : 'desaprobado'}>
                    {aprobado ? 'Aprobado' : 'Desaprobado'}
                  </StatusBadge>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onEditGrade(grade, grade.studentEmail)}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    <EditIcon className="w-4 h-4" />
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {grades.length === 0 && (
        <p className="text-center text-text-muted py-8">
          No hay notas registradas para este curso
        </p>
      )}
    </div>
  );
}
