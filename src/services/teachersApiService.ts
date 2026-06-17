import { apiFetch } from './api';

// Valores que el backend deserializa via @JsonValue / @JsonCreator (label del enum)
export type TeacherType = 'Interno' | 'Externo';
export type TeacherCategory = 'Principal' | 'Asociado' | 'Auxiliar';
export type AcademicDegree = 'Magister' | 'Doctor';

export interface TeacherRequest {
  userId: string;
  type: TeacherType;        // requerido
  category?: TeacherCategory;
  regime?: string;
  academicDegree?: AcademicDegree;
  specialty?: string;
  phone?: string;
}

export interface TeacherResponse {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  category?: string;
  regime?: string;
  academicDegree?: string;
  specialty?: string;
  type: string;
  phone?: string;
  university?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function createTeacher(token: string, request: TeacherRequest): Promise<TeacherResponse> {
  const res = await apiFetch<ApiResponse<TeacherResponse>>('/v1/teachers', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function listTeachers(token: string): Promise<TeacherResponse[]> {
  const res = await apiFetch<ApiResponse<TeacherResponse[]>>('/v1/teachers', token);
  return res.data;
}
