import { EstudianteLayout } from '../../../layouts/EstudianteLayout';
import { StatusBadge } from '../../../components/StatusBadge';
import { FilePreviewModal } from '../../../components/FilePreviewModal';
import { CalendarIcon, UserIcon, FileIcon, Loader2Icon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMatricula } from './hooks/useMatricula';

export function EstudianteMatricula() {
  const {
    loading, error, enrollments, activeSemester, activeEnrollments,
    previewFileId, setPreviewFileId,
  } = useMatricula();

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">Mi Matrícula</h1>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span>Cargando matrícula...</span>
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {error}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-text-muted text-sm">No tienes matrículas registradas.</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 border border-primary rounded-lg p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-text">Estado: Matriculado</p>
                <p className="text-sm text-text-muted">
                  Tu matrícula está activa para el periodo {activeSemester?.code}
                </p>
              </div>
            </motion.div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-serif font-bold text-text mb-2">
                Periodo activo: {activeSemester?.code}
              </h2>
              <p className="text-text-muted">Año {activeSemester?.year}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeEnrollments.map((enrollment, index) => (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/estudiante/cursos/${enrollment.courseId}`}
                    className="block bg-surface border border-border rounded-lg p-6 hover:shadow-md hover:border-primary transition-all"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="font-serif font-bold text-text text-lg">{enrollment.courseName}</h3>
                        <StatusBadge variant={enrollment.stateCode === 'ENROLLED' ? 'activo' : 'retiro'}>
                          {enrollment.stateName}
                        </StatusBadge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-text-muted">
                          <UserIcon className="w-4 h-4" />
                          <span>Código de curso: {enrollment.courseCode}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-muted">
                          <CalendarIcon className="w-4 h-4" />
                          <span>Fecha de matrícula: {enrollment.enrollmentDate}</span>
                        </div>
                      </div>
                      {enrollment.resolutionFile && (
                        <button
                          onClick={(e) => { e.preventDefault(); setPreviewFileId(enrollment.resolutionFile!.id); }}
                          className="flex items-center gap-2 text-accent hover:text-accent-light transition-colors font-medium text-sm"
                        >
                          <FileIcon className="w-4 h-4" />
                          Ver resolución
                        </button>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <FilePreviewModal
        fileId={previewFileId}
        isOpen={previewFileId !== null}
        onClose={() => setPreviewFileId(null)}
      />
    </EstudianteLayout>
  );
}
