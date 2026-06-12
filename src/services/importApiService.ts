// Servicio de importación masiva de usuarios.
// Envía arrays de filas parseadas desde Excel al backend,
// que las procesa y devuelve un resumen con éxitos y errores.

import { apiFetch } from './api';

// --- Tipos de filas parseadas desde Excel ---

// Fila del Excel de estudiantes (columnas exactas que lee el parser)
export interface ImportStudentRow {
  firstName: string;
  lastName: string;
  email: string;
  dni?: string;
  promotionId: number;
  cui: string;
  paymentCode: string;
  phone?: string;
}

// Fila del Excel de docentes
// Los valores de type/category/academicDegree usan el label del enum del backend
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
}

// Resultado devuelto por el backend tras procesar el archivo
export interface ImportResult {
  total: number;
  created: number;
  failed: number;
  errors: { row: number; reason: string }[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// Envía el array de estudiantes al backend para su creación masiva
export async function importStudents(
  token: string,
  rows: ImportStudentRow[]
): Promise<ImportResult> {
  const res = await apiFetch<ApiResponse<ImportResult>>('/v1/students/import', token, {
    method: 'POST',
    body: JSON.stringify(rows),
  });
  return res.data;
}

// Envía el array de docentes al backend para su creación masiva
export async function importTeachers(
  token: string,
  rows: ImportTeacherRow[]
): Promise<ImportResult> {
  const res = await apiFetch<ApiResponse<ImportResult>>('/v1/teachers/import', token, {
    method: 'POST',
    body: JSON.stringify(rows),
  });
  return res.data;
}
