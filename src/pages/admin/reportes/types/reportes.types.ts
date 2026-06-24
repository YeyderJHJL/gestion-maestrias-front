// ── Tipo de reporte ───────────────────────────────────────────────────────────

export type TipoReporte =
  | 'alumnos-por-promocion'
  | 'cursos-por-docente'
  | 'estudiantes-por-curso'
  | 'notas-por-estudiante'
  | 'pagos-por-estudiante'
  | 'pagos-pendientes-validados';

// ── Opciones para selects cargados desde API ──────────────────────────────────

export interface SemesterOption {
  id: number;
  year: number;
  code: string;
}

export interface ProgramOption {
  id: number;
  name: string;
}

// ── Estado de filtros ─────────────────────────────────────────────────────────

export interface FiltrosState {
  tipo: TipoReporte;
  semesterId: string;
  programId: string;
  // dinámicos por tipo
  yearPromotion: number;
  teacherId: string;
  courseId: string;
  studentId: string;
  studentNameSearch: string;
  estadoNota: string;
  estadoPago: 'PENDING' | 'VALIDATED' | 'TODOS';
}

// ── Filas de resultado por reporte ───────────────────────────────────────────

export interface FilaAlumnoPorPromocion {
  id: string;
  nombre: string;
  email: string;
  dni?: string;
  cui: string;
  codigoPago: string;
  estado?: string;
  promocion: number;
}

export interface FilaCursoPorDocente {
  courseId: string;
  codigo: string;
  nombre: string;
  semestre: string;
}

export interface FilaEstudiantePorCurso {
  studentId: string;
  nombre: string;
  email: string;
  estadoMatricula: string;
  fechaMatricula: string;
}

export interface FilaNotaPorEstudiante {
  gradeId: string;
  curso: string;
  codigoCurso: string;
  nota: number;
  estado: string;
}

export interface FilaPagoPorEstudiante {
  voucherId: string;
  estudiante: string;
  email: string;
  codigoPago: string;
  concepto: string;
  monto: number;
  fechaPago: string | null;
  estado: string;
}

export interface FilaPagoPendienteValidado {
  voucherId: string;
  estudiante: string;
  email: string;
  concepto: string;
  monto: number;
  fechaPago: string | null;
  estado: string;
  observacion?: string;
}

export type FilaReporte =
  | FilaAlumnoPorPromocion
  | FilaCursoPorDocente
  | FilaEstudiantePorCurso
  | FilaNotaPorEstudiante
  | FilaPagoPorEstudiante
  | FilaPagoPendienteValidado;

// ── Resultado tipado por reporte ──────────────────────────────────────────────

export type ResultadosReporte =
  | { tipo: 'alumnos-por-promocion';      filas: FilaAlumnoPorPromocion[] }
  | { tipo: 'cursos-por-docente';         filas: FilaCursoPorDocente[] }
  | { tipo: 'estudiantes-por-curso';      filas: FilaEstudiantePorCurso[] }
  | { tipo: 'notas-por-estudiante';       filas: FilaNotaPorEstudiante[] }
  | { tipo: 'pagos-por-estudiante';       filas: FilaPagoPorEstudiante[] }
  | { tipo: 'pagos-pendientes-validados'; filas: FilaPagoPendienteValidado[] }
  | null;
