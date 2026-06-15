// Componente genérico del flujo de importación masiva de 4 pasos.
// Recibe las funciones de parseo y envío como props y muestra la UI
// correspondiente a cada paso: subida, preview, procesando y resultados.
// Se reutiliza tanto para importar estudiantes como docentes.

import { useState } from 'react';
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
  PencilIcon,
  Trash2Icon,
  CheckIcon,
} from 'lucide-react';
import { FileUpload } from '../../../components/FileUpload';
import { StatusBadge } from '../../../components/StatusBadge';
import { ImportResult } from '../../../services/importApiService';
import { useImportFlow } from './useImportFlow';

// Definición de cada columna: clave en el objeto, label visible y metadatos opcionales
export interface ColumnDef {
  key: string;
  label: string;
  required?: boolean;
  inputType?: 'text' | 'number' | 'select'; // tipo de input para edición inline
  options?: string[];                        // valores válidos (para select y guía de formato)
  hint?: string;                             // descripción extra en la guía de formato
}

interface Props<T> {
  parseFile: (file: File) => Promise<T[]>;
  submitRows: (token: string, rows: T[]) => Promise<ImportResult>;
  columnDefs: ColumnDef[];
  entityLabel: string;
  // Validación de reglas de negocio por fila; devuelve lista de advertencias (no bloquea)
  validateRow?: (row: T) => string[];
}

export function ImportFlow<T>({
  parseFile,
  submitRows,
  columnDefs,
  entityLabel,
  validateRow,
}: Props<T>) {
  const {
    step,
    file,
    rows,
    result,
    error,
    uploadKey,
    handleFileSelect,
    handleConfirm,
    updateRow,
    deleteRow,
    reset,
  } = useImportFlow<T>({ parseFile, submitRows });

  // Estado de edición inline en la tabla de preview
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Record<string, unknown>>({});

  const startEdit = (idx: number, row: T) => {
    setEditingIdx(idx);
    setEditDraft({ ...(row as Record<string, unknown>) });
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    updateRow(editingIdx, editDraft);
    setEditingIdx(null);
    setEditDraft({});
  };

  const cancelEdit = () => {
    setEditingIdx(null);
    setEditDraft({});
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta de error (parseo o envío) */}
      {error && (
        <div className="bg-accent/5 border border-accent/30 rounded-lg p-5 space-y-4">
          <div className="flex items-start gap-3">
            <XCircleIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold text-accent text-sm">Error al leer el archivo</p>
              <ul className="space-y-1 list-disc list-inside">
                {error.split('\n').map((line, i) => (
                  <li key={i} className="text-sm text-text leading-relaxed">{line}</li>
                ))}
              </ul>
            </div>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors text-sm font-semibold"
          >
            <RefreshCwIcon className="w-4 h-4" />
            Intentar de nuevo
          </button>
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
                La primera fila del Excel (cabecera) debe tener estas columnas:
              </p>
              <div className="space-y-2">
                {columnDefs.map((col) => (
                  <div key={col.key} className="text-xs border-b border-border pb-2 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-text">{col.label}</span>
                      {col.required
                        ? <span className="text-accent font-bold">*</span>
                        : <span className="text-text-muted">(opcional)</span>
                      }
                    </div>
                    {col.options && (
                      <p className="text-text-muted pl-1">
                        Valores: <span className="font-mono">{col.options.join(' | ')}</span>
                      </p>
                    )}
                    {col.hint && (
                      <p className="text-text-muted pl-1 italic">{col.hint}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-text-muted bg-surface-alt p-3 rounded-lg border border-border">
                <strong>*</strong> Campos obligatorios. Los registros con errores se
                reportan al final sin interrumpir el resto de la importación.
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

            {/* Banner de advertencias de reglas de negocio */}
            {(() => {
              const warnCount = validateRow
                ? rows.filter((r) => validateRow(r).length > 0).length
                : 0;
              return warnCount > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm">
                  <AlertTriangleIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span className="text-amber-700">
                    <strong>{warnCount}</strong> {warnCount === 1 ? 'fila tiene' : 'filas tienen'} advertencias —
                    revísalas antes de confirmar. Pasa el cursor sobre <strong>⚠</strong> para ver el detalle.
                  </span>
                </div>
              ) : null;
            })()}

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
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase whitespace-nowrap">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rows.map((row, idx) => {
                      const isEditing = editingIdx === idx;
                      const warnings = validateRow ? validateRow(row) : [];
                      const hasWarning = warnings.length > 0;
                      return (
                        <tr
                          key={idx}
                          className={
                            isEditing
                              ? 'bg-primary/5'
                              : hasWarning
                                ? 'bg-amber-500/5 hover:bg-amber-500/10 transition-colors'
                                : 'hover:bg-surface-alt transition-colors'
                          }
                        >
                          {columnDefs.map((col) => (
                            <td key={col.key} className="px-2 py-1.5 whitespace-nowrap">
                              {isEditing ? (
                                col.inputType === 'select' && col.options ? (
                                  <select
                                    value={String(editDraft[col.key] ?? '')}
                                    onChange={(e) => setEditDraft((d) => ({ ...d, [col.key]: e.target.value }))}
                                    className="w-full border border-border rounded px-2 py-1 text-xs bg-surface text-text focus:outline-none focus:border-primary"
                                  >
                                    <option value="">—</option>
                                    {col.options.map((o) => (
                                      <option key={o} value={o}>{o}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type={col.inputType === 'number' ? 'number' : 'text'}
                                    value={String(editDraft[col.key] ?? '')}
                                    onChange={(e) =>
                                      setEditDraft((d) => ({
                                        ...d,
                                        [col.key]: col.inputType === 'number' ? Number(e.target.value) : e.target.value,
                                      }))
                                    }
                                    className="w-full border border-border rounded px-2 py-1 text-xs bg-surface text-text focus:outline-none focus:border-primary"
                                  />
                                )
                              ) : (
                                <span className="px-2 text-text-muted">
                                  {String((row as Record<string, unknown>)[col.key] ?? '—')}
                                </span>
                              )}
                            </td>
                          ))}
                          <td className="px-3 py-1.5 whitespace-nowrap">
                            {isEditing ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={saveEdit}
                                  title="Guardar"
                                  className="p-1.5 rounded bg-success/10 text-success hover:bg-success/20 transition-colors"
                                >
                                  <CheckIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  title="Cancelar"
                                  className="p-1.5 rounded bg-border text-text-muted hover:bg-surface-alt transition-colors"
                                >
                                  <XCircleIcon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                {hasWarning && (
                                  <div className="relative group">
                                    <button
                                      className="p-1.5 rounded text-amber-500 hover:bg-amber-500/10 transition-colors"
                                    >
                                      <AlertTriangleIcon className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="absolute right-0 bottom-full mb-1 w-56 bg-surface border border-amber-500/30 rounded-lg p-2.5 hidden group-hover:block z-20 shadow-lg">
                                      <ul className="space-y-1.5">
                                        {warnings.map((w, i) => (
                                          <li key={i} className="flex items-start gap-1.5 text-xs text-text">
                                            <span className="text-amber-500 font-bold mt-0.5">•</span>
                                            {w}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                                <button
                                  onClick={() => startEdit(idx, row)}
                                  title="Editar fila"
                                  className="p-1.5 rounded text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                  <PencilIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => deleteRow(idx)}
                                  title="Eliminar fila"
                                  className="p-1.5 rounded text-text-muted hover:bg-accent/10 hover:text-accent transition-colors"
                                >
                                  <Trash2Icon className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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
                          {String((row as Record<string, unknown>)['firstName'] ?? '')} {String((row as Record<string, unknown>)['lastName'] ?? '')}
                        </p>
                        <p className="text-xs text-text-muted">{String((row as Record<string, unknown>)['email'] ?? '')}</p>
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
