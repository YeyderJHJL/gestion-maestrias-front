import type { TipoReporte } from '../types/reportes.types';
import type { FiltrosState } from '../hooks/useReportes';
import type { TeacherResponse } from '../../../../services/teachersApiService';
import type { CourseResponse } from '../../../../services/coursesApiService';
import type { StudentResponse } from '../../../../services/studentsApiService';

interface ReportFilterPanelProps {
  tipo: TipoReporte;
  filtros: FiltrosState;
  isLoading: boolean;
  teachers: TeacherResponse[];
  courses: CourseResponse[];
  students: StudentResponse[];
  error: string | null;
  onChange: <K extends keyof FiltrosState>(campo: K, valor: FiltrosState[K]) => void;
  onGenerar: () => void;
  onLimpiar: () => void;
}

const inputClass =
  'w-full px-4 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary';

const AÑOS_PROMOCION = Array.from(
  { length: new Date().getFullYear() - 2010 + 1 },
  (_, i) => 2010 + i
).reverse();

export function ReportFilterPanel({
  tipo,
  filtros,
  isLoading,
  teachers,
  courses,
  students,
  error,
  onChange,
  onGenerar,
  onLimpiar,
}: ReportFilterPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      {/* ── Filtros dinámicos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Reporte 1: Alumnos por promoción */}
        {tipo === 'alumnos-por-promocion' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Año de promoción</label>
            <select
              value={filtros.yearPromotion}
              onChange={(e) => onChange('yearPromotion', Number(e.target.value))}
              className={inputClass}
            >
              {AÑOS_PROMOCION.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}

        {/* Reporte 2: Cursos por docente */}
        {tipo === 'cursos-por-docente' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Docente</label>
            <select
              value={filtros.teacherId}
              onChange={(e) => onChange('teacherId', e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar docente...</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.firstName} {t.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reporte 3: Estudiantes por curso */}
        {tipo === 'estudiantes-por-curso' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Curso</label>
            <select
              value={filtros.courseId}
              onChange={(e) => onChange('courseId', e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar curso...</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reporte 4: Notas por estudiante */}
        {tipo === 'notas-por-estudiante' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Estudiante</label>
            <select
              value={filtros.studentId}
              onChange={(e) => onChange('studentId', e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar estudiante...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} — {s.cui}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Reporte 5: Pagos por estudiante */}
        {tipo === 'pagos-por-estudiante' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
              Buscar estudiante{' '}
              <span className="text-text-muted font-normal">(nombre, email o código)</span>
            </label>
            <input
              type="text"
              value={filtros.studentNameSearch}
              placeholder="Ej: Juan Pérez"
              onChange={(e) => onChange('studentNameSearch', e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        {/* Reporte 6: Pagos pendientes / validados */}
        {tipo === 'pagos-pendientes-validados' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">Estado del pago</label>
            <select
              value={filtros.estadoPago}
              onChange={(e) =>
                onChange('estadoPago', e.target.value as FiltrosState['estadoPago'])
              }
              className={inputClass}
            >
              <option value="TODOS">Todos</option>
              <option value="PENDING">Pendientes</option>
              <option value="VALIDATED">Validados</option>
            </select>
          </div>
        )}
      </div>

      {/* ── Error de validación ── */}
      {error && (
        <p className="text-sm text-accent font-medium">{error}</p>
      )}

      {/* ── Acciones ── */}
      <div className="flex gap-3 pt-1">
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
