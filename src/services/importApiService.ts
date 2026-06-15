import { apiFetch } from './api';
import { UserRequest } from './usersApiService';

export interface ImportStudentRow {
  firstName: string;
  lastName: string;
  email: string;
  dni?: string;
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
}

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

export async function importStudents(
  token: string,
  rows: ImportStudentRow[]
): Promise<ImportResult> {
  const payload: UserRequest[] = rows.map((row) => ({
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    dni: row.dni,
    role: 'Estudiante',
    active: true,
    student: {
      cui: row.cui,
      paymentCode: row.paymentCode,
      phone: row.phone,
    },
  }));

  const res = await apiFetch<ApiResponse<ImportResult>>('/v1/users/import/students', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function importTeachers(
  token: string,
  rows: ImportTeacherRow[]
): Promise<ImportResult> {
  const payload: UserRequest[] = rows.map((row) => ({
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    dni: row.dni,
    role: 'Docente',
    active: true,
    teacher: {
      type: row.type,
      category: row.category || undefined,
      regime: row.regime,
      academicDegree: row.academicDegree || undefined,
      specialty: row.specialty,
      phone: row.phone,
    },
  }));

  const res = await apiFetch<ApiResponse<ImportResult>>('/v1/users/import/teachers', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}
