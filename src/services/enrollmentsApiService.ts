import { apiFetch } from './api';
import { StoredFileSummary } from './filesApiService';

// ── Estados de matrícula (entity_type = 'ENROLLMENT') ────────────────────────
// Fuente: SELECT * FROM states WHERE entity_type = 'ENROLLMENT';
// id=5 ENROLLED | id=6 WITHDRAWN | id=7 CANCELLED
export const ENROLLMENT_STATES = {
  ENROLLED:  { id: 5, code: 'ENROLLED',  name: 'Matriculado' },
  WITHDRAWN: { id: 6, code: 'WITHDRAWN', name: 'Retirado' },
  CANCELLED: { id: 7, code: 'CANCELLED', name: 'Anulado' },
} as const;

export type EnrollmentStateKey = keyof typeof ENROLLMENT_STATES;

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface EnrollmentResponse {
  id: string;
  studentId: string;
  studentEmail: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  semesterId: number;
  semesterYear: number;
  semesterCode: string;
  stateId: number;
  stateCode: string;
  stateName: string;
  enrollmentDate: string;       // YYYY-MM-DD
  resolutionFile?: StoredFileSummary;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentRequest {
  studentId: string;
  courseId: string;
  semesterId: number;
  stateId: number;
  enrollmentDate: string;       // YYYY-MM-DD
  resolutionFileId?: string;    // UUID — opcional
  observations?: string;
}

// ── Envelope genérico ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /v1/enrollments */
export async function listEnrollments(token: string): Promise<EnrollmentResponse[]> {
  const res = await apiFetch<ApiResponse<EnrollmentResponse[]>>('/v1/enrollments', token);
  return res.data;
}

/** GET /v1/enrollments/{id} */
export async function getEnrollment(token: string, id: string): Promise<EnrollmentResponse> {
  const res = await apiFetch<ApiResponse<EnrollmentResponse>>(`/v1/enrollments/${id}`, token);
  return res.data;
}

/** POST /v1/enrollments */
export async function createEnrollment(
  token: string,
  request: EnrollmentRequest
): Promise<EnrollmentResponse> {
  const res = await apiFetch<ApiResponse<EnrollmentResponse>>('/v1/enrollments', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** PUT /v1/enrollments/{id} */
export async function updateEnrollment(
  token: string,
  id: string,
  request: EnrollmentRequest
): Promise<EnrollmentResponse> {
  const res = await apiFetch<ApiResponse<EnrollmentResponse>>(`/v1/enrollments/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** DELETE /v1/enrollments/{id} */
export async function deleteEnrollment(token: string, id: string): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/enrollments/${id}`, token, { method: 'DELETE' });
}
