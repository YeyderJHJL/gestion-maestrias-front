import { SearchIcon, Loader2Icon } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { StudentResponse } from '../../../../services/studentsApiService';
import { EnrollmentResponse, ENROLLMENT_STATES } from '../../../../services/enrollmentsApiService';
import { StudentRow } from './StudentRow';

interface Props {
  students: StudentResponse[];
  allEnrollments: EnrollmentResponse[];
  loading: boolean;
  searchTerm: string;
  onSelectStudent: (student: StudentResponse) => void;
}

export function StudentList({ students, allEnrollments, loading, searchTerm, onSelectStudent }: Props) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Cabecera con contador */}
      <div className="px-5 py-3 border-b border-border bg-surface-alt">
        <p className="text-sm text-text-muted">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2Icon className="w-4 h-4 animate-spin" />
              Cargando estudiantes…
            </span>
          ) : searchTerm ? (
            `${students.length} resultado${students.length !== 1 ? 's' : ''} para "${searchTerm}"`
          ) : (
            `${students.length} estudiante${students.length !== 1 ? 's' : ''} registrados`
          )}
        </p>
      </div>

      {!loading && students.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title="Sin resultados"
          subtitle="No se encontraron estudiantes para la búsqueda."
        />
      ) : (
        <ul className="divide-y divide-border">
          {students.map((student) => {
            const activeCount = allEnrollments.filter(
              (e) => e.studentId === student.id && e.stateId === ENROLLMENT_STATES.ENROLLED.id
            ).length;

            return (
              <StudentRow
                key={student.id}
                student={student}
                activeEnrollmentCount={activeCount}
                onSelect={() => onSelectStudent(student)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
