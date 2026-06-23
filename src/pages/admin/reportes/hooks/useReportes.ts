import { useState } from 'react';
import { ReporteFiltros, ResultadoReporte } from '../types/reportes.types';

const FILTROS_INICIALES: ReporteFiltros = {
  tipo: 'Notas',
  periodo: '2024-I',
  programa: 'Maestría en Informática',
  estado: 'Todos',
  estudiante: '',
  curso: 'Todos',
};

// Mock — reemplazar con llamada real a la API
const mockResults: ResultadoReporte[] = [
  {
    estudiante: 'Juan Pérez',
    codigo: '2024001',
    curso: 'Algoritmos Avanzados',
    nota: 16,
    estado: 'Aprobado',
  },
  {
    estudiante: 'María González',
    codigo: '2024002',
    curso: 'Algoritmos Avanzados',
    nota: 18,
    estado: 'Aprobado',
  },
  {
    estudiante: 'Carlos Mendoza',
    codigo: '2024003',
    curso: 'Algoritmos Avanzados',
    nota: 14,
    estado: 'Aprobado',
  },
];

export function useReportes() {
  const [filtros, setFiltros] = useState<ReporteFiltros>(FILTROS_INICIALES);
  const [resultados, setResultados] = useState<ResultadoReporte[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFiltroChange = <K extends keyof ReporteFiltros>(
    campo: K,
    valor: ReporteFiltros[K]
  ) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleGenerar = async () => {
    setIsLoading(true);
    // TODO: reemplazar con fetch real usando `filtros`
    await new Promise((r) => setTimeout(r, 300));
    setResultados(mockResults);
    setHasResults(true);
    setIsLoading(false);
  };

  const handleLimpiar = () => {
    setFiltros(FILTROS_INICIALES);
    setResultados([]);
    setHasResults(false);
  };

  return {
    filtros,
    resultados,
    hasResults,
    isLoading,
    handleFiltroChange,
    handleGenerar,
    handleLimpiar,
  };
}
