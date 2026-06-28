import { EstudianteLayout } from '../../../layouts/EstudianteLayout';
import { StatusBadge } from '../../../components/StatusBadge';
import { Loader2Icon } from 'lucide-react';
import { motion } from 'framer-motion';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useDashboard } from './hooks/useDashboard';

export function EstudianteDashboard() {
  const { user, loading, error, activeSemester, currentCourses, stats } = useDashboard();

  if (loading) {
    return (
      <EstudianteLayout>
        <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
          <Loader2Icon className="w-5 h-5 animate-spin" />
          <span>Cargando dashboard...</span>
        </div>
      </EstudianteLayout>
    );
  }

  if (error) {
    return (
      <EstudianteLayout>
        <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
          {error}
        </div>
      </EstudianteLayout>
    );
  }

  return (
    <EstudianteLayout>
      <div className="space-y-8">
        <WelcomeBanner
          title={`Bienvenido/a, ${user?.firstName}`}
          subtitle={`Periodo activo: ${activeSemester ? `${activeSemester.code} · Año ${activeSemester.year}` : 'Sin periodo activo'}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-surface border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-text">{stat.value}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-xl font-serif font-bold text-text">Cursos actuales</h2>
          </div>

          {currentCourses.length === 0 ? (
            <div className="px-6 py-8 text-center text-text-muted">
              No estás matriculado en ningún curso este semestre.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Curso</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Docente</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Nota final</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentCourses.map((course, index) =>
                    <tr key={course.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                      <td className="px-6 py-4 text-sm text-text font-medium">{course.nombre}</td>
                      <td className="px-6 py-4 text-sm text-text-muted">{course.docente}</td>
                      <td className="px-6 py-4">
                        <StatusBadge variant={course.tipo === 'Regular' ? 'activo' : 'retiro'}>
                          {course.tipo}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {course.notaFinal !== null ? (
                          <span className="font-semibold text-text">{course.notaFinal}</span>
                        ) : (
                          <span className="text-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          variant={
                            course.estado === 'aprobado' ? 'aprobado' :
                            course.estado === 'desaprobado' ? 'desaprobado' : 'pendiente'
                          }>
                          {course.estado === 'aprobado' ? 'Aprobado' :
                           course.estado === 'desaprobado' ? 'Desaprobado' : 'Pendiente'}
                        </StatusBadge>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </EstudianteLayout>
  );
}
