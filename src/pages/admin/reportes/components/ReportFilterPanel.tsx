import type { FiltrosState, SemesterOption, ProgramOption, TipoReporte } from '../types/reportes.types';
import type { TeacherResponse } from '../../../../services/teachersApiService';
import type { CourseResponse } from '../../../../services/coursesApiService';
import type { StudentResponse } from '../../../../services/studentsApiService';

interface ReportFilterPanelProps {
  filtros: FiltrosState;
  isLoading: boolean;
  semesters: SemesterOption[];
  programs: ProgramOption[];
  teachers: TeacherResponse[];
  courses: CourseResponse[];
  students: StudentResponse[];
  error: string | null;
  onChange: <K extends keyof FiltrosState>(campo: K, valor: FiltrosState[K]) => void;
  onGenerar: () => void;
  onLimpiar: () => void;
}

const TIPOS_REPORTE: { value: TipoReporte; label: string }[] = [
  { value: 'alumnos-por-promocion',      label: 'Alumnos por promoción' },
  { value: 'cursos-por-docente',         label: 'Cursos por docente' },
  { value: 'estudiantes-por-curso',      label: 'Estudiantes por curso' },
  { value: 'notas-por-estudiante',       label: 'Notas por estudiante' },
  { value: 'pagos-por-estudiante',       label: 'Pagos por estudiante' },
  { value: 'pagos-pendientes-validados', label: 'Pagos pendientes / validados' },
];

const AÑOS = Array.from(
  { length: new Date().getFullYear() - 2015 + 1 },
  (_, i) => 2015 + i
).reverse();

const selectClass =
  'w-full px-4 py-2 border border-border rounded-lg bg-surface text-text text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ' +
  'hover:border-primary transition-colors';

const labelClass = 'block text-sm font-medium text-primary mb-1';
const labelOptClass = 'block text-sm font-medium text-accent mb-1';

// ── Fila 2 dinámica ───────────────────────────────────────────────────────────

function FilaDinamica({
  filtros,
  teachers,
  courses,
  students,
  onChange,
}: Pick<ReportFilterPanelProps, 'filtros' | 'teachers' | 'courses' | 'students' | 'onChange'>) {
  const tipo = filtros.tipo;

  return (
    <div className="grid grid-cols-3 gap-4">

      {/* Col 1 */}
      {tipo === 'alumnos-por-promocion' && (
        <div>
          <label className={labelClass}>Año de promoción</label>
          <select
            value={filtros.yearPromotion}
            onChange={(e) => onChange('yearPromotion', Number(e.target.value))}
            className={selectClass}
          >
            {AÑOS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      {tipo === 'cursos-por-docente' && (
        <div>
          <label className={labelClass}>Docente</label>
          <select
            value={filtros.teacherId}
            onChange={(e) => onChange('teacherId', e.target.value)}
            className={selectClass}
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

      {tipo === 'estudiantes-por-curso' && (
        <div>
          <label className={labelClass}>Curso</label>
          <select
            value={filtros.courseId}
            onChange={(e) => onChange('courseId', e.target.value)}
            className={selectClass}
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

      {(tipo === 'notas-por-estudiante' || tipo === 'pagos-por-estudiante') && (
        <div>
          <label className={labelClass}>Estudiante</label>
          {tipo === 'notas-por-estudiante' ? (
            <select
              value={filtros.studentId}
              onChange={(e) => onChange('studentId', e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar estudiante...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName} — {s.cui}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={filtros.studentNameSearch}
              placeholder="Buscar por nombre o código"
              onChange={(e) => onChange('studentNameSearch', e.target.value)}
              className={selectClass}
            />
          )}
        </div>
      )}

      {tipo === 'pagos-pendientes-validados' && (
        <div>
          <label className={labelClass}>Estado del pago</label>
          <select
            value={filtros.estadoPago}
            onChange={(e) => onChange('estadoPago', e.target.value as FiltrosState['estadoPago'])}
            className={selectClass}
          >
            <option value="TODOS">Todos</option>
            <option value="PENDING">Pendientes</option>
            <option value="VALIDATED">Validados</option>
          </select>
        </div>
      )}

      {/* Col 2 — Estado de nota (solo notas-por-estudiante) */}
      {tipo === 'notas-por-estudiante' && (
        <div>
          <label className={labelOptClass}>Estado (opcional)</label>
          <select
            value={filtros.estadoNota}
            onChange={(e) => onChange('estadoNota', e.target.value)}
            className={selectClass}
          >
            <option value="TODOS">Todos</option>
            <option value="PASSED">Aprobado</option>
            <option value="FAILED">Desaprobado</option>
            <option value="PENDING">Pendiente</option>
          </select>
        </div>
      )}

      {/* Col 2 — Búsqueda libre de estudiante (pagos-por-estudiante, ya cubierto en col 1) */}
      {/* Col vacía para completar el grid cuando aplique */}
      {(tipo === 'alumnos-por-promocion' ||
        tipo === 'cursos-por-docente' ||
        tipo === 'estudiantes-por-curso' ||
        tipo === 'pagos-por-estudiante' ||
        tipo === 'pagos-pendientes-validados') && (
        <div /> // placeholder para mantener el grid
      )}

      {/* Col 3 siempre vacía en fila 2 (por ahora no hay tercer filtro dinámico) */}
      <div />
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function ReportFilterPanel({
  filtros,
  isLoading,
  semesters,
  programs,
  teachers,
  courses,
  students,
  error,
  onChange,
  onGenerar,
  onLimpiar,
}: ReportFilterPanelProps) {
  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm p-6 space-y-4">

      {/* Fila 1: filtros principales siempre visibles */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Tipo de reporte</label>
          <select
            value={filtros.tipo}
            onChange={(e) => onChange('tipo', e.target.value as TipoReporte)}
            className={selectClass}
          >
            {TIPOS_REPORTE.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Periodo</label>
          <select
            value={filtros.semesterId}
            onChange={(e) => onChange('semesterId', e.target.value)}
            className={selectClass}
          >
            <option value="">Todos los periodos</option>
            {semesters.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.year} — {s.code}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Programa</label>
          <select
            value={filtros.programId}
            onChange={(e) => onChange('programId', e.target.value)}
            className={selectClass}
          >
            <option value="">Todos los programas</option>
            {programs.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fila 2: filtros dinámicos según tipo */}
      <FilaDinamica
        filtros={filtros}
        teachers={teachers}
        courses={courses}
        students={students}
        onChange={onChange}
      />

      {/* Error de validación */}
      {error && (
        <p className="text-sm text-accent font-medium">{error}</p>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={onGenerar}
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Generando...' : 'Generar reporte'}
        </button>
        <button
          onClick={onLimpiar}
          className="px-6 py-3 border border-border text-text-muted rounded-lg hover:bg-surface-alt transition-colors text-sm"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}
