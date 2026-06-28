import { EstudianteLayout } from '../../../layouts/EstudianteLayout';
import { PageHeader } from '../../../components/PageHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { ChevronDownIcon, DownloadIcon, Loader2Icon } from 'lucide-react';
import { useHistorial } from './hooks/useHistorial';

export function EstudianteHistorial() {
  const {
    loading, error, history, expandedPeriod, setExpandedPeriod,
    totalCreditos, totalCreditosPlan, progressPercentage, periodosCompletados,
  } = useHistorial();

  return (
    <EstudianteLayout>
      <div className="space-y-6">
        <PageHeader title="Historial Académico" />

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-text-muted">
            <Loader2Icon className="w-5 h-5 animate-spin" />
            <span>Cargando historial...</span>
          </div>
        ) : error ? (
          <div className="px-4 py-3 rounded-lg bg-accent/10 border border-accent/30 text-sm text-accent">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {history.length === 0 ? (
                <div className="bg-surface border border-border rounded-lg p-8 text-center text-text-muted">
                  Aún no tienes historial académico registrado.
                </div>
              ) : (
                history.map((period) => (
                  <div key={period.semesterId} className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                    <button
                      onClick={() => setExpandedPeriod(expandedPeriod === period.periodo ? null : period.periodo)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-surface-alt hover:bg-surface transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="font-serif font-bold text-text text-lg">{period.periodo}</p>
                          <p className="text-sm text-text-muted">{period.year} · {period.creditos} créditos aprobados</p>
                        </div>
                      </div>
                      <ChevronDownIcon className={`w-5 h-5 text-text-muted transition-transform ${expandedPeriod === period.periodo ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedPeriod === period.periodo && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-surface-alt">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Curso</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Tipo</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Nota final</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Estado</th>
                              <th className="px-6 py-3 text-left text-xs font-semibold text-text-muted uppercase">Créditos</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {period.cursos.map((curso) => (
                              <tr
                                key={curso.id}
                                className={
                                  curso.estado === 'aprobado' ? 'bg-success/5' :
                                  curso.estado === 'desaprobado' ? 'bg-accent/5' : 'bg-surface'
                                }
                              >
                                <td className="px-6 py-4 text-sm text-text font-medium">{curso.nombre}</td>
                                <td className="px-6 py-4">
                                  <StatusBadge variant={curso.tipo === 'Regular' ? 'activo' : 'retiro'}>{curso.tipo}</StatusBadge>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-text">
                                  {curso.notaFinal !== null ? curso.notaFinal : '—'}
                                </td>
                                <td className="px-6 py-4">
                                  <StatusBadge
                                    variant={
                                      curso.estado === 'aprobado' ? 'aprobado' :
                                      curso.estado === 'desaprobado' ? 'desaprobado' : 'pendiente'
                                    }
                                  >
                                    {curso.estado === 'aprobado' ? 'Aprobado' :
                                     curso.estado === 'desaprobado' ? 'Desaprobado' : 'Pendiente'}
                                  </StatusBadge>
                                </td>
                                <td className="px-6 py-4 text-sm text-text">{curso.creditos}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm sticky top-24">
                <div className="border-b-2 border-accent pb-2 mb-6">
                  <h2 className="text-lg font-serif font-bold text-text">Resumen académico</h2>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-muted">Créditos acumulados</span>
                      <span className="font-bold text-text">{totalCreditos} / {totalCreditosPlan}</span>
                    </div>
                    <div className="w-full bg-surface-alt rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      {Math.min(progressPercentage, 100).toFixed(0)}% del plan de estudios
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted text-sm">Periodos registrados</span>
                      <span className="font-semibold text-text">{periodosCompletados}</span>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <StatusBadge variant="activo">Al día</StatusBadge>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold shadow-sm"
                onClick={() => alert('La descarga de PDF aún no está implementada por RF-MA-31')}
              >
                <DownloadIcon className="w-5 h-5" />
                Descargar récord académico en PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </EstudianteLayout>
  );
}
