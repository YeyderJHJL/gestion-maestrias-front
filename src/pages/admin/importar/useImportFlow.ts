// Hook genérico para el flujo de importación masiva de 4 pasos:
//   1. upload   → el usuario selecciona el archivo Excel
//   2. preview  → se muestra la tabla con los datos parseados
//   3. importing → se envía el JSON al backend
//   4. results  → se muestran los resultados (creados / fallidos)
//
// Recibe las funciones de parseo y envío como parámetros,
// lo que permite reutilizarlo para estudiantes y docentes sin duplicar lógica.

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ImportResult } from '../../../services/importApiService';

export type ImportStep = 'upload' | 'preview' | 'importing' | 'results';

interface UseImportFlowOptions<T> {
  // Función que lee el archivo Excel y devuelve las filas tipadas
  parseFile: (file: File) => Promise<T[]>;
  // Función que envía las filas al endpoint del backend
  submitRows: (token: string, rows: T[]) => Promise<ImportResult>;
}

export function useImportFlow<T>({ parseFile, submitRows }: UseImportFlowOptions<T>) {
  const { token } = useAuth();

  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<T[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // Clave para forzar el remontaje de FileUpload al hacer reset
  const [uploadKey, setUploadKey] = useState(0);

  // Paso 1 → 2: parsea el Excel y avanza al preview si no hay errores
  const handleFileSelect = async (selectedFile: File) => {
    setError(null);
    try {
      const parsed = await parseFile(selectedFile);
      setFile(selectedFile);
      setRows(parsed);
      setStep('preview');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al leer el archivo.');
    }
  };

  // Paso 2 → 3 → 4: envía las filas al backend y muestra los resultados
  const handleConfirm = async () => {
    if (!token || rows.length === 0) return;
    setStep('importing');
    setError(null);
    try {
      const importResult = await submitRows(token, rows);
      setResult(importResult);
      setStep('results');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al procesar la importación.');
      setStep('preview');
    } finally {
      setImporting(false);
    }
  };

  // Vuelve al paso inicial limpiando todo el estado
  const reset = () => {
    setStep('upload');
    setFile(null);
    setRows([]);
    setResult(null);
    setError(null);
    setImporting(false);
    setUploadKey((k) => k + 1); // remonta FileUpload para limpiar su estado interno
  };

  return {
    step,
    file,
    rows,
    result,
    error,
    importing,
    uploadKey,
    handleFileSelect,
    handleConfirm,
    reset,
  };
}
