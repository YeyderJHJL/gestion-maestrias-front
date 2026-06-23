import { FileSpreadsheetIcon, DownloadIcon } from 'lucide-react';
import { ResultadoReporte } from '../types/reportes.types';

interface ReportExportBarProps {
  resultados: ResultadoReporte[];
}

export function ReportExportBar({ resultados }: ReportExportBarProps) {
  const handleExcelDownload = () => {
    // TODO: implementar exportación a Excel (ej. con SheetJS)
    console.log('Exportar Excel', resultados);
  };

  const handlePdfDownload = () => {
    // TODO: implementar exportación a PDF
    console.log('Exportar PDF', resultados);
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
