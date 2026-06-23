// ── Tipo de reporte (coincide con las vistas del DoD) ─────────────────────────

export type TipoReporte =
  | 'alumnos-por-promocion'
  | 'cursos-por-docente'
  | 'estudiantes-por-curso'
  | 'notas-por-estudiante'
  | 'pagos-por-estudiante'
  | 'pagos-pendientes-validados';

// ── Filtros por tipo ──────────────────────────────────────────────────────────

export interface FiltrosAlumnosPorPromocion {
  yearPromotion: number;
}

export interface FiltrosCursosPorDocente {
  teacherId: string;
}

export interface FiltrosEstudiantesPorCurso {
  courseId: string;
}

export interface FiltrosNotasPorEstudiante {
  studentId: string;
}

export interface FiltrosPagosPorEstudiante {
  studentName: string; // búsqueda libre sobre los vouchers
}

export interface FiltrosPagosPendientesValidados {
  estado: 'PENDING' | 'VALIDATED' | 'TODOS';
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
  fechaInicio: string;
  fechaFin: string;
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

// ── Union de resultados ───────────────────────────────────────────────────────

export type FilaReporte =
  | FilaAlumnoPorPromocion
  | FilaCursoPorDocente
  | FilaEstudiantePorCurso
  | FilaNotaPorEstudiante
  | FilaPagoPorEstudiante
  | FilaPagoPendienteValidado;
