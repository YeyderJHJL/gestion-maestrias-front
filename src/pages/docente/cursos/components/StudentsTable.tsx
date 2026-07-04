import { StatusBadge } from '../../../../components/StatusBadge';
import type { EnrollmentResponse } from '../../../../services/enrollmentsApiService';

interface StudentsTableProps {
  students: EnrollmentResponse[];
}

export function StudentsTable({ students }: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-alt">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">
              Estado de matrícula
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {students.map((student, index) => (
            <tr
              key={student.id}
              className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
            >
              <td className="px-6 py-4 text-sm text-text font-medium">
                {student.studentName}
              </td>
              <td className="px-6 py-4 text-sm text-text-muted">
                {student.studentEmail}
              </td>
              <td className="px-6 py-4">
                <StatusBadge variant="matriculado">
                  {student.stateName || 'Matriculado'}
                </StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && (
        <p className="text-center text-text-muted py-8">
          No hay estudiantes matriculados en este curso
        </p>
      )}
    </div>
  );
}
