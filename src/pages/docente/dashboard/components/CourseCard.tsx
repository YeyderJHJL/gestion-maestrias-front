import { Link } from 'react-router-dom';
import { CalendarIcon, AlertTriangleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from '../../../../components/StatusBadge';
import type { AssignmentResponse } from '../../../../services/assignmentsApiService';

interface CourseCardProps {
  assignment: AssignmentResponse;
  index: number;
  notasRegistradas: number;
  totalEstudiantes: number;
  estado: 'completo' | 'en-curso' | 'pendiente';
}

function getTypeColor(tipo: string) {
  if (tipo === 'Regular') return 'bg-primary';
  if (tipo === 'Tesis') return 'bg-accent';
  return 'bg-warning';
}

function getTipoVariant(tipo: string) {
  if (tipo === 'Regular') return 'activo' as const;
  if (tipo === 'Tesis') return 'retiro' as const;
  return 'observado' as const;
}

function getEstadoVariant(estado: string) {
  if (estado === 'completo') return 'aprobado' as const;
  if (estado === 'en-curso') return 'en-curso' as const;
  return 'pendiente' as const;
}

function getEstadoLabel(estado: string) {
  if (estado === 'completo') return 'Completo';
  if (estado === 'en-curso') return 'En curso';
  return 'Pendiente';
}

export function CourseCard({
  assignment,
  index,
  notasRegistradas,
  totalEstudiantes,
  estado,
}: CourseCardProps) {
  const progress = totalEstudiantes > 0 ? (notasRegistradas / totalEstudiantes) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className={getTypeColor(assignment.courseName)} style={{ height: 4 }} />
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-serif font-bold text-text text-lg">
              {assignment.courseName}
            </h3>
            <StatusBadge variant={getTipoVariant(assignment.courseName)}>
              {assignment.courseName}
            </StatusBadge>
          </div>
          <p className="text-sm text-text-muted">
            Promoción {assignment.semesterYear}-{assignment.semesterCode}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-text-muted">
          <CalendarIcon className="w-4 h-4" />
          <span>{assignment.assignmentDate}</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Notas registradas</span>
            <span className="font-semibold text-text">
              {notasRegistradas} / {totalEstudiantes}
            </span>
          </div>
          <div className="w-full bg-surface-alt rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <StatusBadge variant={getEstadoVariant(estado)}>
            {getEstadoLabel(estado)}
          </StatusBadge>

          {!assignment.syllabusFile && (
            <div className="flex items-center gap-1 text-xs text-accent">
              <AlertTriangleIcon className="w-4 h-4" />
              <span className="font-semibold">Sílabo pendiente</span>
            </div>
          )}
        </div>

        <Link
          to={`/docente/cursos/${assignment.courseId}`}
          className="block text-center text-accent hover:text-accent-light font-medium text-sm transition-colors"
        >
          Ver curso →
        </Link>
      </div>
    </motion.div>
  );
}
