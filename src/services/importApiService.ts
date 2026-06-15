// Servicio de importación masiva de usuarios.
// Envía arrays de filas parseadas desde Excel al backend,
// que las procesa y devuelve un resumen con éxitos y errores.

import { apiFetch } from './api';

// --- Tipos de filas parseadas desde Excel (se envían al backend) ---

export interface ImportStudentRow {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;            // @NotBlank en backend — obligatorio
  yearPromotion: number;  // año de ingreso, ej: 2024 (reemplaza promotionId)
  cui: string;
  paymentCode: string;
  phone?: string;
}

export interface ImportTeacherRow {
  firstName: string;
  lastName: string;
  email: string;
  dni?: string;
  type: 'Interno' | 'Externo';
  category?: 'Principal' | 'Asociado' | 'Auxiliar';
  regime?: string;
  academicDegree?: 'Magister' | 'Doctor';
  specialty?: string;
  phone?: string;
  university?: string;
}

// --- Forma pública del resultado (usada por la UI) ---

export interface ImportResult {
  total: number;
  created: number;
  failed: number;
  errors: { row: number; reason: string }[];
}

// --- Tipos internos de respuesta del backend ---

// POST /api/v1/teachers/bulk → TeacherImportResult
interface TeacherBulkRowResult {
  row: number;
  status: 'SUCCESS' | 'REJECTED';
  email: string;
  reason?: string;
}

interface TeacherImportResult {
  imported: number;
  rejected: number;
  results: TeacherBulkRowResult[];
}

// POST /api/v1/students/bulk → StudentImportResponse
interface StudentImportRowResult {
  rowNumber: number;       // campo es rowNumber, no row
  email: string;
  status: 'IMPORTED' | 'REJECTED';
  observations?: string[]; // lista de motivos, no campo reason
}

interface StudentImportResponse {
  totalRows: number;
  imported: number;
  rejected: number;
  results: StudentImportRowResult[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// POST /v1/teachers/bulk
export async function importTeachers(
  token: string,
  rows: ImportTeacherRow[]
): Promise<ImportResult> {
  const res = await apiFetch<ApiResponse<TeacherImportResult>>('/v1/teachers/bulk', token, {
    method: 'POST',
    body: JSON.stringify(rows),
  });
  const data = res.data;
  return {
    total: data.imported + data.rejected,
    created: data.imported,
    failed: data.rejected,
    errors: data.results
      .filter((r) => r.status === 'REJECTED')
      .map((r) => ({ row: r.row, reason: r.reason ?? 'Error desconocido' })),
  };
}

// POST /v1/students/bulk
export async function importStudents(
  token: string,
  rows: ImportStudentRow[]
): Promise<ImportResult> {
  const res = await apiFetch<ApiResponse<StudentImportResponse>>('/v1/students/bulk', token, {
    method: 'POST',
    body: JSON.stringify(rows),
  });
  const data = res.data;
  return {
    total: data.totalRows,
    created: data.imported,
    failed: data.rejected,
    errors: data.results
      .filter((r) => r.status === 'REJECTED')
      .map((r) => ({
        row: r.rowNumber,
        reason: r.observations?.join('; ') ?? 'Error desconocido',
      })),
  };
}
