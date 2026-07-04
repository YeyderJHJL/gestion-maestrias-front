import { BookOpenIcon } from 'lucide-react';
import { DocenteLayout } from '../../../layouts/DocenteLayout';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { CourseCard } from './components/CourseCard';
import { useDashboard } from './hooks/useDashboard';

export function DocenteDashboard() {
  const { user } = useAuth();
  const { assignments, courseStats, loading, error } = useDashboard();

  if (loading) {
    return (
      <DocenteLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DocenteLayout>
    );
  }

  const hasActiveSemester = assignments.length > 0;
  const semester = assignments[0];

  return (
    <DocenteLayout>
      <div className="space-y-6">
        {hasActiveSemester && semester ? (
          <WelcomeBanner
            title={`Periodo activo: ${semester.semesterYear}-${semester.semesterCode}`}
            subtitle={`${semester.semesterCode === 'I' ? 'Primer' : 'Segundo'} semestre ${semester.semesterYear}`}
          />
        ) : (
          <WelcomeBanner
            title={`Bienvenido, ${user?.firstName}`}
            subtitle="No hay periodo activo asignado"
          />
        )}

        {error && (
          <div className="bg-accent/10 border border-accent rounded-lg p-4 text-accent">
            {error}
          </div>
        )}

        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => {
              const stats = courseStats[assignment.courseId] ?? { notasRegistradas: 0, totalEstudiantes: 0 };
              return (
                <CourseCard
                  key={assignment.id}
                  assignment={assignment}
                  index={index}
                  notasRegistradas={stats.notasRegistradas}
                  totalEstudiantes={stats.totalEstudiantes}
                  estado={assignment.syllabusFile ? 'en-curso' : 'pendiente'}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <BookOpenIcon className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">
              No tienes cursos asignados en el periodo activo
            </h3>
            <p className="text-text-muted">
              Contacta a Administración si crees que hay un error
            </p>
          </div>
        )}
      </div>
    </DocenteLayout>
  );
}
