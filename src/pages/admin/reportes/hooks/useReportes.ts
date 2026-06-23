import { useState, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import {
  getAlumnosPorPromocion,
  getCursosPorDocente,
  getEstudiantesPorCurso,
  getNotasPorEstudiante,
  getPagosPorEstudiante,
  getPagosPendientesValidados,
} from '../../../../services/reportesApiService';
import type {
  TipoReporte,
  FilaAlumnoPorPromocion,
  FilaCursoPorDocente,
  FilaEstudiantePorCurso,
  FilaNotaPorEstudiante,
  FilaPagoPorEstudiante,
  FilaPagoPendienteValidado,
} from '../types/reportes.types';

// ── Estado de filtros por tipo ────────────────────────────────────────────────

export interface FiltrosState {
  // Reporte 1
  yearPromotion: number;
  // Reporte 2
  teacherId: string;
  // Reporte 3
  courseId: string;
  // Reporte 4
  studentId: string;
  // Reporte 5
  studentNameSearch: string;
  // Reporte 6
  estadoPago: 'PENDING' | 'VALIDATED' | 'TODOS';
}

const FILTROS_INICIALES: FiltrosState = {
  yearPromotion: new Date().getFullYear(),
  teacherId: '',
  courseId: '',
  studentId: '',
  studentNameSearch: '',
  estadoPago: 'TODOS',
};

// ── Resultado tipado por reporte ──────────────────────────────────────────────

export type ResultadosReporte =
  | { tipo: 'alumnos-por-promocion'; filas: FilaAlumnoPorPromocion[] }
  | { tipo: 'cursos-por-docente'; filas: FilaCursoPorDocente[] }
  | { tipo: 'estudiantes-por-curso'; filas: FilaEstudiantePorCurso[] }
  | { tipo: 'notas-por-estudiante'; filas: FilaNotaPorEstudiante[] }
  | { tipo: 'pagos-por-estudiante'; filas: FilaPagoPorEstudiante[] }
  | { tipo: 'pagos-pendientes-validados'; filas: FilaPagoPendienteValidado[] }
  | null;

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useReportes() {
  const { token } = useAuth();

  const [tipoActivo, setTipoActivo] = useState<TipoReporte>('alumnos-por-promocion');
  const [filtros, setFiltros] = useState<FiltrosState>(FILTROS_INICIALES);
  const [resultados, setResultados] = useState<ResultadosReporte>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiltroChange = useCallback(
    <K extends keyof FiltrosState>(campo: K, valor: FiltrosState[K]) => {
      setFiltros((prev) => ({ ...prev, [campo]: valor }));
    },
    []
  );

  const handleCambioTipo = useCallback((tipo: TipoReporte) => {
    setTipoActivo(tipo);
    setResultados(null);
    setError(null);
  }, []);

  const handleGenerar = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    setResultados(null);

    try {
      switch (tipoActivo) {
        case 'alumnos-por-promocion': {
          const filas = await getAlumnosPorPromocion(token, filtros.yearPromotion);
          setResultados({ tipo: 'alumnos-por-promocion', filas });
          break;
        }
        case 'cursos-por-docente': {
          if (!filtros.teacherId) throw new Error('Selecciona un docente.');
          const filas = await getCursosPorDocente(token, filtros.teacherId);
          setResultados({ tipo: 'cursos-por-docente', filas });
          break;
        }
        case 'estudiantes-por-curso': {
          if (!filtros.courseId) throw new Error('Selecciona un curso.');
          const filas = await getEstudiantesPorCurso(token, filtros.courseId);
          setResultados({ tipo: 'estudiantes-por-curso', filas });
          break;
        }
        case 'notas-por-estudiante': {
          if (!filtros.studentId) throw new Error('Selecciona un estudiante.');
          const filas = await getNotasPorEstudiante(token, filtros.studentId);
          setResultados({ tipo: 'notas-por-estudiante', filas });
          break;
        }
        case 'pagos-por-estudiante': {
          const filas = await getPagosPorEstudiante(token, filtros.studentNameSearch);
          setResultados({ tipo: 'pagos-por-estudiante', filas });
          break;
        }
        case 'pagos-pendientes-validados': {
          const filas = await getPagosPendientesValidados(token, filtros.estadoPago);
          setResultados({ tipo: 'pagos-pendientes-validados', filas });
          break;
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar el reporte.');
    } finally {
      setIsLoading(false);
    }
  }, [token, tipoActivo, filtros]);

  const handleLimpiar = useCallback(() => {
    setFiltros(FILTROS_INICIALES);
    setResultados(null);
    setError(null);
  }, []);

  return {
    tipoActivo,
    filtros,
    resultados,
    isLoading,
    error,
    handleCambioTipo,
    handleFiltroChange,
    handleGenerar,
    handleLimpiar,
  };
}
