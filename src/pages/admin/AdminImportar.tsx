import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { FileUpload } from '../../components/FileUpload';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
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
import { motion } from 'framer-motion';

// Mock de alumnos para mostrar en la vista previa (simulación de datos extraídos del Excel)
const mockPreviewStudents = [
  {
    firstName: 'Jose Manuel',
    lastName: 'Ramos Mamani',
    email: 'jramosm@unsa.edu.pe',
    dni: '71234567',
    cui: '20201234',
    paymentCode: 'P89201',
    phone: '958123456',
    promotionId: '1'
  },
  {
    firstName: 'Lucia Fernanda',
    lastName: 'Paredes Choque',
    email: 'lparedesc@unsa.edu.pe',
    dni: '72345678',
    cui: '20205678',
    paymentCode: 'P89202',
    phone: '958765432',
    promotionId: '1'
  },
  {
    firstName: 'Alberto Javier',
    lastName: 'Vargas Ortiz',
    email: 'avargaso@unsa.edu.pe',
    dni: '73456789',
    cui: '20209012',
    paymentCode: 'P89203',
    phone: '958111222',
    promotionId: '2'
  },
  {
    firstName: 'Sofía Milagros',
    lastName: 'Cáceres Beltrán',
    email: 'scaceresb@unsa.edu.pe',
    dni: '74567890',
    cui: '20203456',
    paymentCode: 'P89204',
    phone: '958999888',
    promotionId: '1'
  },
  {
    firstName: 'Renato Alonso',
    lastName: 'Herrera Medina',
    email: 'rherreram@unsa.edu.pe',
    dni: '75678901',
    cui: '20207890',
    paymentCode: 'P89205',
    phone: '958777666',
    promotionId: '3' // Inválida en mock results
  }
];

// Mock de resultados del procesamiento de importación
const mockImportResults = {
  total: 5,
  created: 4,
  failed: 1,
  errors: [
    { row: 5, reason: 'El promotionId "3" es inválido o no existe en la base de datos.' }
  ]
};

export function AdminImportar() {
  const { token } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'results'>('upload');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStep('preview');
  };

  const handleCancel = () => {
    setFile(null);
    setStep('upload');
  };

  const handleConfirmImport = () => {
    setStep('importing');
    setError(null);

    // Simulación del envío y procesamiento
    setTimeout(() => {
      setStep('results');
    }, 1500);

    /* 
    // TODO: Conexión real con el backend cuando el endpoint esté listo.
    // Endpoint: POST /api/v1/students/import (multipart/form-data)
    // Parámetros: archivo (key: 'file')
    // Rol requerido: ADMIN (se envía token en headers)

    const startBackendImport = async () => {
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file);

      try {
        const baseUrl = import.meta.env.VITE_API_URL ?? '/api';
        
        // Puesto que apiFetch en api.ts hardcodea Content-Type: application/json,
        // para el envío multipart/form-data se realiza mediante fetch directamente.
        const response = await fetch(`${baseUrl}/v1/students/import`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.message ?? `Error en el servidor: ${response.status}`);
        }

        const resJson = await response.json();
        // resJson.data debe contener: { total, created, failed, errors: [{ row, reason }] }
        // setImportResults(resJson.data);
        setStep('results');
      } catch (err: any) {
        setError(err.message ?? 'Ocurrió un error al procesar la importación masiva.');
        setStep('preview');
      }
    };
    startBackendImport();
    */
  };

  const resetAll = () => {
    setFile(null);
    setStep('upload');
    setError(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-accent pb-2">
          <div>
            <h1 className="text-3xl font-serif font-bold text-text">
              Migración de Datos
            </h1>
            <p className="text-sm text-text-muted">Importación masiva de estudiantes mediante archivo Excel</p>
          </div>
          <FileSpreadsheetIcon className="w-10 h-10 text-primary opacity-80" />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-center gap-3">
            <XCircleIcon className="w-5 h-5 text-accent flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* PASO 1: Subida de Archivo */}
        {step === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-12 gap-6"
          >
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                <h3 className="font-serif font-bold text-text text-lg mb-4">Cargar Plantilla de Excel</h3>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  acceptedFormats=".xlsx"
                  label="Arrastra el archivo de Excel (.xlsx) aquí o haz clic para buscar"
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <InfoIcon className="w-5 h-5" />
                  <h4>Formato Requerido</h4>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  El archivo Excel debe tener la siguiente estructura de columnas en la primera hoja:
                </p>
                <div className="space-y-2">
                  {[
                    { col: 'firstName', desc: 'Nombres del estudiante' },
                    { col: 'lastName', desc: 'Apellidos del estudiante' },
                    { col: 'email', desc: 'Correo electrónico institucional' },
                    { col: 'dni', desc: 'Número de DNI (8 dígitos)' },
                    { col: 'cui', desc: 'Código Único de Identificación' },
                    { col: 'paymentCode', desc: 'Código de pago de tasa' },
                    { col: 'phone', desc: 'Número telefónico de contacto' },
                    { col: 'promotionId', desc: 'ID numérico de la promoción' }
                  ].map((field) => (
                    <div key={field.col} className="text-xs border-b border-border pb-1.5 flex justify-between">
                      <span className="font-mono text-accent font-semibold">{field.col}</span>
                      <span className="text-text-muted">{field.desc}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-xs text-text-muted bg-surface-alt p-3 rounded-lg border border-border">
                  <strong>Nota:</strong> Los correos electrónicos duplicados o IDs de promoción que no existan en el sistema se reportarán en la sección de errores al finalizar.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 2: Vista Previa */}
        {step === 'preview' && file && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileSpreadsheetIcon className="w-6 h-6 text-success" />
                  <div>
                    <h3 className="font-semibold text-text">{file.name}</h3>
                    <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB · Vista previa de registros listos para importar</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Cambiar archivo
                  </button>
                  <button
                    onClick={handleConfirmImport}
                    className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold"
                  >
                    <PlayIcon className="w-4 h-4" />
                    Confirmar Importación
                  </button>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-alt">
                      <tr className="border-b border-border">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Nombres</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Apellidos</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Correo</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">DNI</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">CUI</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Cód. Pago</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Teléfono</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-text-muted uppercase">Promoción ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {mockPreviewStudents.map((student, idx) => (
                        <tr key={idx} className="bg-surface hover:bg-surface-alt transition-colors">
                          <td className="px-4 py-2.5 text-sm text-text font-medium">{student.firstName}</td>
                          <td className="px-4 py-2.5 text-sm text-text font-medium">{student.lastName}</td>
                          <td className="px-4 py-2.5 text-sm text-text-muted font-mono">{student.email}</td>
                          <td className="px-4 py-2.5 text-sm text-text-muted">{student.dni}</td>
                          <td className="px-4 py-2.5 text-sm text-text-muted">{student.cui}</td>
                          <td className="px-4 py-2.5 text-sm text-text-muted">{student.paymentCode}</td>
                          <td className="px-4 py-2.5 text-sm text-text-muted">{student.phone}</td>
                          <td className="px-4 py-2.5 text-sm text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                              {student.promotionId}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 3: Importando (Spinner) */}
        {step === 'importing' && (
          <div className="bg-surface border border-border rounded-lg p-16 shadow-sm flex flex-col items-center justify-center space-y-6">
            <RefreshCwIcon className="w-16 h-16 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <h3 className="text-xl font-serif font-bold text-text">Procesando Importación Masiva</h3>
              <p className="text-sm text-text-muted max-w-sm">
                Creando cuentas de usuario, asociando perfiles de estudiantes y asignando promociones. Esto puede tardar unos instantes...
              </p>
            </div>
          </div>
        )}

        {/* PASO 4: Resultados */}
        {step === 'results' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface border border-border rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Total Leídos</p>
                  <p className="text-3xl font-bold text-text mt-1">{mockImportResults.total}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <UploadCloudIcon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-surface border border-success/20 rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-success font-semibold uppercase tracking-wider">Creados con Éxito</p>
                  <p className="text-3xl font-bold text-success mt-1">{mockImportResults.created}</p>
                </div>
                <div className="p-3 bg-success/15 rounded-lg text-success">
                  <CheckCircle2Icon className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-surface border border-accent/20 rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-accent font-semibold uppercase tracking-wider">Filas Fallidas</p>
                  <p className="text-3xl font-bold text-accent mt-1">{mockImportResults.failed}</p>
                </div>
                <div className="p-3 bg-accent/15 rounded-lg text-accent">
                  <AlertTriangleIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Importados Exitosamente */}
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-success font-bold">
                  <UserCheckIcon className="w-5 h-5" />
                  <h3>Estudiantes Importados</h3>
                </div>
                <div className="divide-y divide-border border border-border rounded-lg overflow-hidden max-h-72 overflow-y-auto">
                  {mockPreviewStudents.slice(0, 4).map((student, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 text-sm hover:bg-surface-alt transition-colors">
                      <div>
                        <p className="font-semibold text-text">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-text-muted">{student.email}</p>
                      </div>
                      <StatusBadge variant="activo">Importado</StatusBadge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Errores de fila */}
              <div className="bg-surface border border-border rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-accent font-bold">
                  <AlertTriangleIcon className="w-5 h-5" />
                  <h3>Errores Reportados</h3>
                </div>
                {mockImportResults.errors.length === 0 ? (
                  <div className="text-center py-8 text-text-muted">
                    No se reportaron errores en la importación.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockImportResults.errors.map((err, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                        <span className="flex-shrink-0 mt-0.5 px-2 py-0.5 rounded bg-accent text-white text-xs font-mono font-bold">
                          Fila {err.row}
                        </span>
                        <div className="text-sm">
                          <p className="text-text font-medium">Error de validación</p>
                          <p className="text-xs text-text-muted mt-0.5">{err.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Back action */}
            <div className="flex justify-end pt-4">
              <button
                onClick={resetAll}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold"
              >
                Importar otro archivo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
