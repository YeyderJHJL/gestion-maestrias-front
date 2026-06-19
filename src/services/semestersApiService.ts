import { apiFetch } from './api';

// ── Tipos de respuesta ────────────────────────────────────────────────────────

export interface SemesterResponse {
  id: number;      // integer (int32)
  year: number;
  code: string;
  createdAt: string;
  updatedAt: string;
}

// ── Tipos de petición ─────────────────────────────────────────────────────────

export interface SemesterRequest {
  year: number;   // mínimo: 2001
  code: string;   // máximo 50 caracteres
}

// ── Envelope genérico ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /v1/semesters — lista todos los semestres */
export async function listSemesters(token: string): Promise<SemesterResponse[]> {
  const res = await apiFetch<ApiResponse<SemesterResponse[]>>('/v1/semesters', token);
  return res.data;
}

/** GET /v1/semesters/{id} — obtiene un semestre por ID */
export async function getSemester(token: string, id: number): Promise<SemesterResponse> {
  const res = await apiFetch<ApiResponse<SemesterResponse>>(`/v1/semesters/${id}`, token);
  return res.data;
}

/** POST /v1/semesters — crea un nuevo semestre */
export async function createSemester(
  token: string,
  request: SemesterRequest
): Promise<SemesterResponse> {
  const res = await apiFetch<ApiResponse<SemesterResponse>>('/v1/semesters', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** PUT /v1/semesters/{id} — actualiza un semestre existente */
export async function updateSemester(
  token: string,
  id: number,
  request: SemesterRequest
): Promise<SemesterResponse> {
  const res = await apiFetch<ApiResponse<SemesterResponse>>(`/v1/semesters/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** DELETE /v1/semesters/{id} — elimina un semestre */
export async function deleteSemester(token: string, id: number): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/semesters/${id}`, token, {
    method: 'DELETE',
  });
}
