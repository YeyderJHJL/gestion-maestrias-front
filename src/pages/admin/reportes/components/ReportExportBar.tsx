import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileSpreadsheetIcon, DownloadIcon } from 'lucide-react';
import type { ResultadosReporte } from '../hooks/useReportes';

interface ReportExportBarProps {
  resultados: ResultadosReporte;
}

// ── Metadatos por tipo de reporte ─────────────────────────────────────────────

const REPORTE_META: Record<
  NonNullable<ResultadosReporte>['tipo'],
  { titulo: string; columnas: string[]; campos: string[] }
> = {
  'alumnos-por-promocion': {
    titulo: 'Alumnos por Promoción',
    columnas: ['Nombre', 'Email', 'DNI', 'CUI', 'Código Pago', 'Estado'],
    campos:   ['nombre', 'email', 'dni', 'cui', 'codigoPago', 'estado'],
  },
  'cursos-por-docente': {
    titulo: 'Cursos por Docente',
    columnas: ['Código', 'Nombre del Curso', 'Semestre'],
    campos:   ['codigo', 'nombre', 'semestre'],
  },
  'estudiantes-por-curso': {
    titulo: 'Estudiantes por Curso',
    columnas: ['Nombre', 'Email', 'Fecha Matrícula', 'Estado'],
    campos:   ['nombre', 'email', 'fechaMatricula', 'estadoMatricula'],
  },
  'notas-por-estudiante': {
    titulo: 'Notas por Estudiante',
    columnas: ['Código Curso', 'Curso', 'Nota', 'Estado'],
    campos:   ['codigoCurso', 'curso', 'nota', 'estado'],
  },
  'pagos-por-estudiante': {
    titulo: 'Pagos por Estudiante',
    columnas: ['Estudiante', 'Código Pago', 'Concepto', 'Monto (S/.)', 'Fecha Pago', 'Estado'],
    campos:   ['estudiante', 'codigoPago', 'concepto', 'monto', 'fechaPago', 'estado'],
  },
  'pagos-pendientes-validados': {
    titulo: 'Pagos Pendientes / Validados',
    columnas: ['Estudiante', 'Concepto', 'Monto (S/.)', 'Fecha Pago', 'Estado', 'Observación'],
    campos:   ['estudiante', 'concepto', 'monto', 'fechaPago', 'estado', 'observacion'],
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFecha(valor: string | null | undefined): string {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('es-PE');
}

function formatMonto(valor: unknown): string {
  if (valor === null || valor === undefined) return '—';
  return Number(valor).toFixed(2);
}

function filaToRow(fila: Record<string, unknown>, campos: string[]): string[] {
  return campos.map((campo) => {
    const valor = fila[campo];
    if (campo === 'fechaPago' || campo === 'fechaMatricula') return formatFecha(valor as string | null);
    if (campo === 'monto') return formatMonto(valor);
    if (valor === null || valor === undefined || valor === '') return '—';
    return String(valor);
  });
}

function getNombreArchivo(tipo: NonNullable<ResultadosReporte>['tipo']): string {
  const fecha = new Date().toISOString().slice(0, 10);
  return `${tipo}_${fecha}`;
}

// Cast seguro: pasamos por unknown para evitar el error TS2352
// (la union de tipos tipados no es directamente asignable a Record<string, unknown>)
function toRows(filas: NonNullable<ResultadosReporte>['filas']): Record<string, unknown>[] {
  return (filas as unknown) as Record<string, unknown>[];
}

// ── Exportación Excel ─────────────────────────────────────────────────────────

function exportarExcel(resultados: NonNullable<ResultadosReporte>) {
  const meta = REPORTE_META[resultados.tipo];
  const filas = toRows(resultados.filas);

  const datos = filas.map((fila) => {
    const row: Record<string, string> = {};
    meta.columnas.forEach((col, i) => {
      row[col] = filaToRow(fila, meta.campos)[i];
    });
    return row;
  });

  const ws = XLSX.utils.json_to_sheet(datos, { header: meta.columnas });

  // Ancho automático por columna
  const anchos = meta.columnas.map((col) => ({
    wch: Math.max(
      col.length,
      ...datos.map((row) => (row[col] ?? '').length)
    ) + 2,
  }));
  ws['!cols'] = anchos;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, meta.titulo.slice(0, 31));
  XLSX.writeFile(wb, `${getNombreArchivo(resultados.tipo)}.xlsx`);
}

// ── Exportación PDF ───────────────────────────────────────────────────────────

function exportarPdf(resultados: NonNullable<ResultadosReporte>) {
  const meta = REPORTE_META[resultados.tipo];
  const filas = toRows(resultados.filas);
  const fecha = new Date().toLocaleDateString('es-PE');

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Encabezado
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(meta.titulo, 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text(`Generado: ${fecha}`, 14, 22);
  doc.setTextColor(0);

  // Tabla
  autoTable(doc, {
    head: [meta.columnas],
    body: filas.map((fila) => filaToRow(fila, meta.campos)),
    startY: 27,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: 14, right: 14 },
  });

  // Pie de página
  const totalPaginas = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${totalPaginas}`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }

  doc.save(`${getNombreArchivo(resultados.tipo)}.pdf`);
}

// ── Componente ────────────────────────────────────────────────────────────────

export function ReportExportBar({ resultados }: ReportExportBarProps) {
  if (!resultados) return null;

  return (
    <div className="flex gap-3 justify-end">
      <button
        onClick={() => exportarExcel(resultados)}
        className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors text-sm font-medium"
      >
        <FileSpreadsheetIcon className="w-4 h-4" />
        Descargar Excel
      </button>
      <button
        onClick={() => exportarPdf(resultados)}
        className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
      >
        <DownloadIcon className="w-4 h-4" />
        Descargar PDF
      </button>
    </div>
  );
}