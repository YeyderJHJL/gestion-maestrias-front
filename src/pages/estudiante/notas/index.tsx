import { EstudianteLayout } from '../../../layouts/EstudianteLayout';
import { StatusBadge } from '../../../components/StatusBadge';
import { InfoIcon, Loader2Icon } from 'lucide-react';
import { useNotas } from './hooks/useNotas';

export function EstudianteNotas() {
  const {
    loading, error, enrollments, periods, selectedPeriod, setSelectedPeriod,
    tableData, hasPendingGrades, allGradesRegistered, promedio,
  } = useNotas();

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-serif font-bold text-text">Mis Notas</h1>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span>Cargando notas...</span>
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {error}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-text-muted text-sm">No tienes notas registradas.</p>
          </div>
        ) : (
          <>
            {periods.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-4">
                <label className="block text-sm font-medium text-text mb-2">Seleccionar periodo</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {periods.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            )}

            {allGradesRegistered && tableData.length > 0 && (
              <div className="bg-primary/10 border border-primary rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-muted text-sm mb-1">Periodo: {selectedPeriod}</p>
                    <p className="text-3xl font-bold text-text">Promedio: {promedio}</p>
                  </div>
                </div>
              </div>
            )}

            {tableData.length > 0 ? (
              <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-alt">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Curso</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Nota final</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tableData.map((grade, index) =>
                        <tr key={grade.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}>
                          <td className="px-6 py-4 text-sm text-text font-medium">{grade.curso}</td>
                          <td className="px-6 py-4">
                            <StatusBadge variant={grade.tipo === 'Regular' ? 'activo' : 'retiro'}>
                              {grade.tipo}
                            </StatusBadge>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {grade.notaFinal !== null ? (
                              <span className="font-bold text-text text-base">{grade.notaFinal}</span>
                            ) : (
                              <span className="text-text-muted">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge
                              variant={
                                grade.estado === 'aprobado' ? 'aprobado' :
                                grade.estado === 'desaprobado' ? 'desaprobado' : 'pendiente'
                              }>
                              {grade.estado === 'aprobado' ? 'Aprobado' :
                               grade.estado === 'desaprobado' ? 'Desaprobado' : 'Pendiente'}
                            </StatusBadge>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 bg-surface border border-border rounded-lg">
                <p className="text-text-muted text-sm">No hay cursos en este periodo.</p>
              </div>
            )}

            {hasPendingGrades && (
              <div className="bg-primary/10 border border-primary rounded-lg p-4 flex items-start gap-3">
                <InfoIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text">
                  Algunos cursos aún no tienen nota registrada. Si el curso ya
                  finalizó, contacta a tu docente o Administración.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </EstudianteLayout>
  );
}
