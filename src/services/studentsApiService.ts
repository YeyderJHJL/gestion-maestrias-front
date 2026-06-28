import { apiFetch, ApiResponse } from './api';
import type { StoredFileSummary } from './filesApiService';

export type StudentStatus = 'Regular' | 'Reactualizacion';

// ── Tipos de petición ─────────────────────────────────────────────────────────

export interface StudentRequest {
  userId: string;
  yearPromotion: number;
  status?: StudentStatus;
  reactualizationFileId?: string;
  cui: string;
  paymentCode: string;
  phone?: string;
}

// ── Tipos de respuesta ────────────────────────────────────────────────────────

export interface StudentResponse {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  yearPromotion: number;
  status?: StudentStatus;
  reactualizationFile?: StoredFileSummary | null;
  cui: string;
  paymentCode: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Filtros para listado ───────────────────────────────────────────────────────

export interface StudentFilters {
  yearPromotion?: number;
  status?: StudentStatus;
  search?: string;
}

// ── Envelope genérico ─────────────────────────────────────────────────────────


// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /v1/students — con filtros opcionales */
export async function listStudents(
  token: string,
  filters: StudentFilters = {}
): Promise<StudentResponse[]> {
  const params = new URLSearchParams();
  if (filters.yearPromotion) params.set('yearPromotion', String(filters.yearPromotion));
  if (filters.status)        params.set('status', filters.status);
  if (filters.search)        params.set('search', filters.search);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiFetch<ApiResponse<StudentResponse[]>>(`/v1/students${qs}`, token);
  return res.data;
}

/** GET /v1/students/{id} */
export async function getStudent(token: string, id: string): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>(`/v1/students/${id}`, token);
  return res.data;
}

/** POST /v1/students */
export async function createStudent(
  token: string,
  request: StudentRequest
): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>('/v1/students', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** PUT /v1/students/{id} */
export async function updateStudent(
  token: string,
  id: string,
  request: StudentRequest
): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>(`/v1/students/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** DELETE /v1/students/{id} */
export async function deleteStudent(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/v1/students/${id}`, token, {
    method: 'DELETE',
  });
}
