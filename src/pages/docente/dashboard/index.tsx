import { BookOpenIcon } from 'lucide-react';
import { DocenteLayout } from '../../../layouts/DocenteLayout';
import { useAuth } from '../../../context/AuthContext';
import { PeriodBanner } from './components/PeriodBanner';
import { CourseCard } from './components/CourseCard';
import { useDashboard } from './hooks/useDashboard';

export function DocenteDashboard() {
  const { user } = useAuth();
  const { assignments, loading, error } = useDashboard();

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
          <PeriodBanner
            semesterCode={semester.semesterCode}
            semesterYear={semester.semesterYear}
          />
        ) : (
          <div className="bg-primary text-white rounded-lg p-6">
            <h1 className="text-2xl font-serif font-bold">
              Bienvenido, {user?.firstName}
            </h1>
            <p className="text-white/90 mt-1">No hay periodo activo asignado</p>
          </div>
        )}

        {error && (
          <div className="bg-accent/10 border border-accent rounded-lg p-4 text-accent">
            {error}
          </div>
        )}

        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment, index) => (
              <CourseCard
                key={assignment.id}
                assignment={assignment}
                index={index}
                notasRegistradas={0}
                totalEstudiantes={0}
                estado={assignment.syllabusFile ? 'en-curso' : 'pendiente'}
              />
            ))}
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
