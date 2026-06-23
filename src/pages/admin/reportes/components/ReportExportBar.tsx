import { FileSpreadsheetIcon, DownloadIcon } from 'lucide-react';
import type { ResultadosReporte } from '../hooks/useReportes';

interface ReportExportBarProps {
  resultados: ResultadosReporte;
}

function getFilename(resultados: ResultadosReporte): string {
  if (!resultados) return 'reporte';
  const labels: Record<string, string> = {
    'alumnos-por-promocion': 'alumnos_por_promocion',
    'cursos-por-docente': 'cursos_por_docente',
    'estudiantes-por-curso': 'estudiantes_por_curso',
    'notas-por-estudiante': 'notas_por_estudiante',
    'pagos-por-estudiante': 'pagos_por_estudiante',
    'pagos-pendientes-validados': 'pagos_pendientes_validados',
  };
  return labels[resultados.tipo] ?? 'reporte';
}

export function ReportExportBar({ resultados }: ReportExportBarProps) {
  const handleExcelDownload = () => {
    // TODO: implementar con SheetJS (xlsx)
    // import * as XLSX from 'xlsx';
    // const ws = XLSX.utils.json_to_sheet(resultados?.filas ?? []);
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    // XLSX.writeFile(wb, `${getFilename(resultados)}.xlsx`);
    console.log('Exportar Excel:', resultados?.filas);
  };

  const handlePdfDownload = () => {
    // TODO: implementar con jsPDF o llamada al back si genera PDF
    console.log('Exportar PDF:', resultados?.filas);
  };

  return (
    <div className="flex gap-3 justify-end">
      <button
        onClick={handleExcelDownload}
        className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors text-sm font-medium"
      >
        <FileSpreadsheetIcon className="w-4 h-4" />
        Descargar Excel
      </button>
      <button
        onClick={handlePdfDownload}
        className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
      >
        <DownloadIcon className="w-4 h-4" />
        Descargar PDF
      </button>
    </div>
  );
}
