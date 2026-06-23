import { StatusBadge } from '../../../../components/StatusBadge';
import { ResultadoReporte } from '../types/reportes.types';

interface ReportResultsTableProps {
  resultados: ResultadoReporte[];
}

const COLUMNAS = ['Estudiante', 'Código', 'Curso', 'Nota', 'Estado'];

// Mapea el texto del estado al variant de StatusBadge
function resolveEstadoVariant(estado: string) {
  const map: Record<string, 'aprobado' | 'desaprobado' | 'pendiente'> = {
    Aprobado: 'aprobado',
    Desaprobado: 'desaprobado',
    Pendiente: 'pendiente',
  };
  return map[estado] ?? 'pendiente';
}

export function ReportResultsTable({ resultados }: ReportResultsTableProps) {
  if (resultados.length === 0) {
    return (
      <p className="text-center text-text-muted py-8">
        No se encontraron resultados para los filtros seleccionados.
      </p>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary text-white">
            <tr>
              {COLUMNAS.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resultados.map((resultado, index) => (
              <tr
                key={resultado.codigo}
                className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-alt'}
              >
                <td className="px-6 py-4 text-sm text-text font-medium">
                  {resultado.estudiante}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {resultado.codigo}
                </td>
                <td className="px-6 py-4 text-sm text-text">{resultado.curso}</td>
                <td className="px-6 py-4 text-sm text-text font-semibold">
                  {resultado.nota}
                </td>
                <td className="px-6 py-4 text-sm">
                  <StatusBadge variant={resolveEstadoVariant(resultado.estado)}>
                    {resultado.estado}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
