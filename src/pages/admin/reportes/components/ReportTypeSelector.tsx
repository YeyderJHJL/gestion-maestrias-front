import type { TipoReporte } from '../types/reportes.types';

interface OpcionReporte {
  tipo: TipoReporte;
  label: string;
}

const OPCIONES: OpcionReporte[] = [
  { tipo: 'alumnos-por-promocion',      label: 'Alumnos por promoción' },
  { tipo: 'cursos-por-docente',         label: 'Cursos por docente' },
  { tipo: 'estudiantes-por-curso',      label: 'Estudiantes por curso' },
  { tipo: 'notas-por-estudiante',       label: 'Notas por estudiante' },
  { tipo: 'pagos-por-estudiante',       label: 'Pagos por estudiante' },
  { tipo: 'pagos-pendientes-validados', label: 'Pagos pendientes / validados' },
];

interface ReportTypeSelectorProps {
  activo: TipoReporte;
  onChange: (tipo: TipoReporte) => void;
}

export function ReportTypeSelector({ activo, onChange }: ReportTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPCIONES.map(({ tipo, label }) => (
        <button
          key={tipo}
          onClick={() => onChange(tipo)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activo === tipo
              ? 'bg-primary text-white'
              : 'bg-surface border border-border text-text-muted hover:border-primary hover:text-primary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
