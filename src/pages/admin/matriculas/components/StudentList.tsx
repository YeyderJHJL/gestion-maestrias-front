import { SearchIcon, Loader2Icon } from 'lucide-react';
import { EmptyState } from '../../../../components/EmptyState';
import { StudentResponse } from '../../../../services/studentsApiService';
import { EnrollmentResponse, ENROLLMENT_STATES } from '../../../../services/enrollmentsApiService';
import { StudentRow } from './StudentRow';

interface BulkSelectProps {
  bulkMode: true;
  selectedIds: Set<string>;
  enrolledInTargetCourse: Set<string>;
  onToggleSelect: (studentId: string) => void;
}

interface NormalListProps {
  bulkMode?: false | undefined;
  onSelectStudent: (student: StudentResponse) => void;
}

type Props = {
  students: StudentResponse[];
  allEnrollments: EnrollmentResponse[];
  loading: boolean;
  searchTerm: string;
} & (BulkSelectProps | NormalListProps);

export function StudentList(props: Props) {
  const { students, allEnrollments, loading, searchTerm } = props;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
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

            if (props.bulkMode) {
              const { selectedIds, enrolledInTargetCourse, onToggleSelect } = props;

              return (
                <StudentRow
                  key={student.id}
                  student={student}
                  activeEnrollmentCount={activeCount}
                  enabled
                  isSelected={selectedIds.has(student.id)}
                  isAlreadyEnrolled={enrolledInTargetCourse.has(student.id)}
                  onToggle={() => onToggleSelect(student.id)}
                />
              );
            }

            return (
              <StudentRow
                key={student.id}
                student={student}
                activeEnrollmentCount={activeCount}
                onSelect={() => props.onSelectStudent(student)}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
