import { ReporteFiltros, TipoReporte, EstadoReporte } from '../types/reportes.types';

interface ReportFilterPanelProps {
  filtros: ReporteFiltros;
  isLoading: boolean;
  onChange: <K extends keyof ReporteFiltros>(campo: K, valor: ReporteFiltros[K]) => void;
  onGenerar: () => void;
  onLimpiar: () => void;
}

const TIPOS_REPORTE: TipoReporte[] = ['Notas', 'Matrículas', 'Pagos', 'Egresados'];
const PERIODOS = ['2024-I', '2024-II', '2023-II'];
const PROGRAMAS = ['Maestría en Informática'];
const ESTADOS: EstadoReporte[] = ['Todos', 'Aprobado', 'Desaprobado', 'Pendiente'];
const CURSOS = ['Todos', 'Algoritmos Avanzados', 'Bases de Datos Distribuidas'];

const selectClass =
  'w-full px-4 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary';

export function ReportFilterPanel({
  filtros,
  isLoading,
  onChange,
  onGenerar,
  onLimpiar,
}: ReportFilterPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      {/* Fila 1: filtros principales */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">Tipo de reporte</label>
          <select
            value={filtros.tipo}
            onChange={(e) => onChange('tipo', e.target.value as TipoReporte)}
            className={selectClass}
          >
            {TIPOS_REPORTE.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">Periodo</label>
          <select
            value={filtros.periodo}
            onChange={(e) => onChange('periodo', e.target.value)}
            className={selectClass}
          >
            {PERIODOS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">Programa</label>
          <select
            value={filtros.programa}
            onChange={(e) => onChange('programa', e.target.value)}
            className={selectClass}
          >
            {PROGRAMAS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fila 2: filtros opcionales */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Estado{' '}
            <span className="text-text-muted font-normal">(opcional)</span>
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => onChange('estado', e.target.value as EstadoReporte)}
            className={selectClass}
          >
            {ESTADOS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Estudiante{' '}
            <span className="text-text-muted font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={filtros.estudiante}
            placeholder="Buscar por nombre o código"
            onChange={(e) => onChange('estudiante', e.target.value)}
            className={selectClass}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Curso{' '}
            <span className="text-text-muted font-normal">(opcional)</span>
          </label>
          <select
            value={filtros.curso}
            onChange={(e) => onChange('curso', e.target.value)}
            className={selectClass}
          >
            {CURSOS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={onGenerar}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generando...' : 'Generar reporte'}
        </button>
        <button
          onClick={onLimpiar}
          className="px-6 py-3 border border-border text-text-muted rounded-lg hover:bg-surface-alt transition-colors"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
