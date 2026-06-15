// Componente genérico del flujo de importación masiva de 4 pasos.
// Recibe las funciones de parseo y envío como props y muestra la UI
// correspondiente a cada paso: subida, preview, procesando y resultados.
// Se reutiliza tanto para importar estudiantes como docentes.

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileSpreadsheetIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  UploadCloudIcon,
  InfoIcon,
  PlayIcon,
  RefreshCwIcon,
  UserCheckIcon,
} from 'lucide-react';
import { FileUpload } from '../../../components/FileUpload';
import { StatusBadge } from '../../../components/StatusBadge';
import { ImportResult } from '../../../services/importApiService';
import { useImportFlow } from './useImportFlow';

// Definición de cada columna: clave en el objeto, label visible y si es requerida
export interface ColumnDef {
  key: string;
  label: string;
  required?: boolean;
}

export interface ImportFlowProps<T extends Record<string, any>> {
  // Función que toma el File y devuelve el array de filas de tipo T
  parseFile: (file: File) => Promise<T[]>;
  // Función que envía las filas al backend y devuelve el resultado
  submitRows: (token: string, rows: T[]) => Promise<ImportResult>;
  // Definición de columnas para la previsualización y la guía
  columnDefs: ColumnDef[];
  // Nombre de la entidad para textos (ej. "estudiantes", "docentes")
  entityLabel: string;
}

export function ImportFlow<T extends Record<string, any>>({
  parseFile,
  submitRows,
  columnDefs,
  entityLabel,
}: ImportFlowProps<T>) {
  const {
    step,
    file,
    rows,
    result,
    error,
    uploadKey,
    handleFileSelect,
    handleConfirm,
    reset,
  } = useImportFlow<T>({ parseFile, submitRows });

  return (
    <div className="space-y-6">
      {/* Banner de error global (parseo o envío) */}
      {error && (
        <div className="bg-accent/5 border border-accent/30 text-accent px-4 py-3 rounded-lg text-sm flex items-start gap-3">
          <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* ── PASO 1: Subida del archivo ── */}
      {step === 'upload' && (
        <motion.div
          key="upload"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-12 gap-6"
        >
          {/* Zona de arrastrar y soltar */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
              <h3 className="font-serif font-bold text-text text-lg mb-4">
                Cargar archivo Excel
              </h3>
              <FileUpload
                key={uploadKey}
                onFileSelect={handleFileSelect}
                acceptedFormats=".xlsx"
                maxSizeMB={10}
                label="Arrastra el archivo .xlsx aquí o haz clic para buscar"
              />
            </div>
          </div>

          {/* Guía de formato de columnas */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold">
                <InfoIcon className="w-5 h-5" />
                <h4>Formato requerido</h4>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                La primera hoja debe tener exactamente estas columnas:
              </p>
              <div className="space-y-2">
                {columnDefs.map((col) => (
                  <div
                    key={col.key}
                    className="text-xs border-b border-border pb-1.5 flex justify-between items-center"
                  >
                    <span className="font-mono text-accent font-semibold">{col.key}</span>
                    <span className="text-text-muted">
                      {col.label}
                      {col.required && (
                        <span className="ml-1 text-accent font-bold">*</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted bg-surface-alt p-3 rounded-lg border border-border">
                <strong>*</strong> Campos obligatorios. Los correos duplicados o IDs
                inválidos se reportarán como errores sin interrumpir el resto.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PASO 2: Vista previa de los datos parseados ── */}
      {step === 'preview' && file && (
        <motion.div
          key="preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
            {/* Cabecera con nombre del archivo y botones */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <FileSpreadsheetIcon className="w-6 h-6 text-success" />
                <div>
                  <h3 className="font-semibold text-text">{file.name}</h3>
                  <p className="text-xs text-text-muted">
                    {(file.size / 1024).toFixed(1)} KB ·{' '}
                    <strong>{rows.length}</strong> {entityLabel} listos para importar
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Cambiar archivo
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm"
                >
                  <PlayIcon className="w-4 h-4" />
                  Confirmar importación
                </button>
              </div>
            </div>

            {/* Tabla de preview con los datos parseados */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-surface-alt sticky top-0">
                    <tr className="border-b border-border">
                      {columnDefs.map((col) => (
                        <th
                          key={col.key}
                          className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase whitespace-nowrap"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-alt transition-colors">
                        {columnDefs.map((col) => (
                          <td key={col.key} className="px-4 py-2.5 text-text-muted whitespace-nowrap">
                            {String(row[col.key] ?? '—')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PASO 3: Procesando ── */}
      {step === 'importing' && (
        <div className="bg-surface border border-border rounded-lg p-16 shadow-sm flex flex-col items-center justify-center space-y-6">
          <RefreshCwIcon className="w-16 h-16 text-primary animate-spin" />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-serif font-bold text-text">
              Procesando importación
            </h3>
            <p className="text-sm text-text-muted max-w-sm">
              Creando cuentas y perfiles de {entityLabel}. Esto puede tardar unos instantes...
            </p>
          </div>
        </div>
      )}

      {/* ── PASO 4: Resultados ── */}
      {step === 'results' && result && (
        <motion.div
          key="results"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-border rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">
                  Total leídos
                </p>
                <p className="text-3xl font-bold text-text mt-1">{result.total}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <UploadCloudIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-surface border border-success/20 rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-success font-semibold uppercase tracking-wider">
                  Creados con éxito
                </p>
                <p className="text-3xl font-bold text-success mt-1">{result.created}</p>
              </div>
              <div className="p-3 bg-success/15 rounded-lg text-success">
                <CheckCircle2Icon className="w-6 h-6" />
              </div>
            </div>
            <div className="bg-surface border border-accent/20 rounded-lg p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                  Filas fallidas
                </p>
                <p className="text-3xl font-bold text-accent mt-1">{result.failed}</p>
              </div>
              <div className="p-3 bg-accent/15 rounded-lg text-accent">
                <AlertTriangleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Detalle: exitosos y errores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de importados exitosamente */}
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-success font-bold">
                <UserCheckIcon className="w-5 h-5" />
                <h3>{result.created} {entityLabel} importados</h3>
              </div>
              {result.created === 0 ? (
                <p className="text-sm text-text-muted text-center py-6">
                  No se creó ningún registro.
                </p>
              ) : (
                <div className="divide-y divide-border border border-border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                  {rows.slice(0, result.created).map((row, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 text-sm hover:bg-surface-alt transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-text">
                          {String(row['firstName'] ?? '')} {String(row['lastName'] ?? '')}
                        </p>
                        <p className="text-xs text-text-muted">{String(row['email'] ?? '')}</p>
                      </div>
                      <StatusBadge variant="activo">Importado</StatusBadge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lista de errores por fila */}
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-accent font-bold">
                <AlertTriangleIcon className="w-5 h-5" />
                <h3>Errores reportados</h3>
              </div>
              {result.errors.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-sm">
                  Sin errores — todo importado correctamente.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {result.errors.map((err, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg"
                    >
                      <span className="flex-shrink-0 mt-0.5 px-2 py-0.5 rounded bg-accent text-white text-xs font-mono font-bold">
                        Fila {err.row}
                      </span>
                      <p className="text-xs text-text-muted">{err.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón para volver a importar */}
          <div className="flex justify-end pt-2">
            <button
              onClick={reset}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm"
            >
              Importar otro archivo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
