import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';
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
  XIcon,
} from 'lucide-react';
import { FileUpload } from './FileUpload';
import { StatusBadge } from './StatusBadge';
import { useAuth } from '../context/AuthContext';
import { importGradesBulk, GradeBulkRequest, GradeBulkResult } from '../services/gradesApiService';

interface ImportGradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onSuccess?: () => void;
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'results';

export function ImportGradesModal({ isOpen, onClose, courseId, onSuccess }: ImportGradesModalProps) {
  const { token } = useAuth();
  
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<GradeBulkRequest[]>([]);
  const [result, setResult] = useState<GradeBulkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<GradeBulkRequest>>({});

  if (!isOpen) return null;

  const reset = () => {
    setStep('upload');
    setFile(null);
    setRows([]);
    setResult(null);
    setError(null);
    setUploadKey(k => k + 1);
  };

  const handleClose = () => {
    const shouldRefresh = result && result.imported > 0;
    reset();
    onClose();
    if (shouldRefresh && onSuccess) {
      onSuccess();
    }
  };

  const parseExcel = async (file: File): Promise<GradeBulkRequest[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<any>(firstSheet, { defval: '' });
          
          if (jsonData.length === 0) {
            throw new Error('El archivo está vacío.');
          }

          const getProp = (obj: any, keys: string[]) => {
            for (const k of keys) {
              if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
                return obj[k];
              }
            }
            return '';
          };

          const parsedRows: GradeBulkRequest[] = jsonData.map((row: any, i: number) => {
            const rowNumber = i + 2; // +1 por 0-index, +1 por cabecera
            const cui = String(getProp(row, ['cui', 'CUI'])).trim();
            const rawValue = getProp(row, ['value', 'Value', 'nota', 'Nota', 'NOTA']);
            const valueStr = String(rawValue).trim();
            
            if (!cui) throw new Error(`Fila ${rowNumber}: Falta el CUI.`);
            if (valueStr === '') throw new Error(`Fila ${rowNumber}: Falta la Nota.`);
            
            const value = Number(valueStr);
            if (isNaN(value)) throw new Error(`Fila ${rowNumber}: La Nota debe ser un número (valor encontrado: "${valueStr}").`);
            if (value < 0 || value > 20) throw new Error(`Fila ${rowNumber}: La Nota debe estar entre 0 y 20.`);

            return { cui, value };
          });
          
          resolve(parsedRows);
        } catch (err: any) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Error de lectura del archivo.'));
      reader.readAsBinaryString(file);
    });
  };

  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    try {
      const parsed = await parseExcel(selectedFile);
      setFile(selectedFile);
      setRows(parsed);
      setStep('preview');
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleConfirm = async () => {
    if (!token || rows.length === 0) return;
    setStep('importing');
    setError(null);
    try {
      const res = await importGradesBulk(token, courseId, rows);
      setResult(res);
      setStep('results');
    } catch (e: any) {
      setError(e.message || 'Error al procesar la importación.');
      setStep('preview');
    }
  };

  // Edición Inline
  const startEdit = (idx: number, row: GradeBulkRequest) => {
    setEditingIdx(idx);
    setEditDraft({ ...row });
  };
  const saveEdit = () => {
    if (editingIdx === null) return;
    setRows(prev => prev.map((r, i) => i === editingIdx ? { ...r, ...editDraft } as GradeBulkRequest : r));
    setEditingIdx(null);
    setEditDraft({});
  };
  const cancelEdit = () => {
    setEditingIdx(null);
    setEditDraft({});
  };
  const deleteRow = (idx: number) => {
    setRows(prev => prev.filter((_, i) => i !== idx));
  };

  const validateRow = (row: GradeBulkRequest): string[] => {
    const warnings: string[] = [];
    if (row.value < 0 || row.value > 20) warnings.push('La nota debe estar entre 0 y 20');
    if (!row.cui) warnings.push('CUI vacío');
    return warnings;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-surface border border-border rounded-xl shadow-xl w-full max-w-5xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-xl font-serif font-bold text-text">Importar Notas Masivamente</h2>
                <p className="text-sm text-text-muted">Sube un archivo Excel para calificar a múltiples estudiantes</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-text-muted hover:bg-surface-alt rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {error && (
                <div className="bg-accent/5 border border-accent/30 rounded-lg p-5 space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <XCircleIcon className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-semibold text-accent text-sm">Error en la importación</p>
                      <p className="text-sm text-text leading-relaxed">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex items-center gap-2 px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent/10 transition-colors text-sm font-semibold"
                  >
                    <RefreshCwIcon className="w-4 h-4" />
                    Ocultar error
                  </button>
                </div>
              )}

              {step === 'upload' && (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                      <h3 className="font-serif font-bold text-text text-lg mb-4">Cargar archivo Excel</h3>
                      <FileUpload
                        key={uploadKey}
                        onFileSelect={handleFileSelect}
                        acceptedFormats=".xlsx, .csv"
                        maxSizeMB={5}
                        label="Arrastra el archivo .xlsx aquí o haz clic para buscar"
                      />
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <InfoIcon className="w-5 h-5" />
                        <h4>Formato requerido</h4>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        La primera fila del Excel (cabecera) debe tener estas columnas:
                      </p>
                      <div className="space-y-3">
                        <div className="text-xs border-b border-border pb-2 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-text">cui</span>
                            <span className="text-accent font-bold">*</span>
                          </div>
                          <p className="text-text-muted pl-1 italic">Código único del estudiante (ej. 20210001)</p>
                        </div>
                        <div className="text-xs border-b border-border pb-2 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-text">nota</span>
                            <span className="text-accent font-bold">*</span>
                          </div>
                          <p className="text-text-muted pl-1 italic">Nota final (número entre 0 y 20)</p>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted bg-surface-alt p-3 rounded-lg border border-border">
                        <strong>*</strong> Campos obligatorios. El sistema validará que el estudiante esté matriculado en el curso actual.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'preview' && file && (
                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheetIcon className="w-6 h-6 text-success" />
                        <div>
                          <h3 className="font-semibold text-text">{file.name}</h3>
                          <p className="text-xs text-text-muted">
                            {(file.size / 1024).toFixed(1)} KB · <strong>{rows.length}</strong> notas listas para importar
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

                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-surface-alt sticky top-0 z-30">
                            <tr className="border-b border-border">
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">CUI</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Nota</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {rows.map((row, idx) => {
                              const isEditing = editingIdx === idx;
                              const warnings = validateRow(row);
                              const hasWarning = warnings.length > 0;
                              return (
                                <tr key={idx} className={isEditing ? 'bg-primary/5' : hasWarning ? 'bg-amber-500/5' : 'hover:bg-surface-alt'}>
                                  <td className="px-4 py-2.5">
                                    {isEditing ? (
                                      <input
                                        type="text"
                                        value={editDraft.cui ?? ''}
                                        onChange={(e) => setEditDraft(d => ({ ...d, cui: e.target.value }))}
                                        className="w-full border rounded px-2 py-1 text-xs"
                                      />
                                    ) : (
                                      <span className="text-text font-medium">{row.cui}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    {isEditing ? (
                                      <input
                                        type="number"
                                        value={editDraft.value ?? ''}
                                        onChange={(e) => setEditDraft(d => ({ ...d, value: Number(e.target.value) }))}
                                        className="w-full border rounded px-2 py-1 text-xs"
                                      />
                                    ) : (
                                      <span className="text-text">{row.value}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2.5">
                                    {isEditing ? (
                                      <div className="flex gap-1">
                                        <button onClick={saveEdit} className="p-1.5 rounded text-success bg-success/10"><CheckIcon className="w-3.5 h-3.5"/></button>
                                        <button onClick={cancelEdit} className="p-1.5 rounded text-text-muted bg-border"><XCircleIcon className="w-3.5 h-3.5"/></button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1">
                                        {hasWarning && (
                                          <div className="group relative">
                                            <AlertTriangleIcon className="w-4 h-4 text-amber-500 mr-2" />
                                            <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-surface border border-border p-2 text-xs rounded shadow-lg z-50">
                                              {warnings.join(', ')}
                                            </div>
                                          </div>
                                        )}
                                        <button onClick={() => startEdit(idx, row)} className="p-1.5 rounded text-text-muted hover:text-primary"><PencilIcon className="w-4 h-4"/></button>
                                        <button onClick={() => deleteRow(idx)} className="p-1.5 rounded text-text-muted hover:text-accent"><Trash2Icon className="w-4 h-4"/></button>
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

              {step === 'importing' && (
                <div className="bg-surface border border-border rounded-lg p-16 shadow-sm flex flex-col items-center justify-center space-y-6">
                  <RefreshCwIcon className="w-16 h-16 text-primary animate-spin" />
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-serif font-bold text-text">Procesando notas</h3>
                    <p className="text-sm text-text-muted max-w-sm">Registrando calificaciones en el sistema...</p>
                  </div>
                </div>
              )}

              {step === 'results' && result && (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface border border-border rounded-lg p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Total leídas</p>
                        <p className="text-3xl font-bold text-text mt-1">{result.totalRows}</p>
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg text-primary"><UploadCloudIcon className="w-6 h-6" /></div>
                    </div>
                    <div className="bg-surface border border-success/20 rounded-lg p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-success font-semibold uppercase tracking-wider">Importadas</p>
                        <p className="text-3xl font-bold text-success mt-1">{result.imported}</p>
                      </div>
                      <div className="p-3 bg-success/15 rounded-lg text-success"><CheckCircle2Icon className="w-6 h-6" /></div>
                    </div>
                    <div className="bg-surface border border-accent/20 rounded-lg p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-accent font-semibold uppercase tracking-wider">Rechazadas</p>
                        <p className="text-3xl font-bold text-accent mt-1">{result.rejected}</p>
                      </div>
                      <div className="p-3 bg-accent/15 rounded-lg text-accent"><AlertTriangleIcon className="w-6 h-6" /></div>
                    </div>
                  </div>

                  <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 font-bold text-text">
                      <UserCheckIcon className="w-5 h-5 text-primary" />
                      <h3>Resultados detallados</h3>
                    </div>
                    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                      {result.results.map((row, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 text-sm hover:bg-surface-alt transition-colors">
                          <div className="flex gap-4 items-center">
                            <span className="text-xs text-text-muted font-mono w-16">Fila {row.rowNumber}</span>
                            <p className="font-semibold text-text">{row.cui}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {row.status === 'IMPORTED' ? (
                              <StatusBadge variant="activo">Importado</StatusBadge>
                            ) : (
                              <div className="flex items-center gap-2 text-accent">
                                <StatusBadge variant="inactivo">Rechazado</StatusBadge>
                                <span className="text-xs">{(row.observations || []).join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleClose}
                      className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm shadow-sm"
                    >
                      Finalizar y ver notas actualizadas
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
