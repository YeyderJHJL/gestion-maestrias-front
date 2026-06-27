import { apiFetch, ApiResponse } from './api';
import type { StoredFileSummary } from './filesApiService';

// ── Tipos de respuesta ────────────────────────────────────────────────────────

export interface AssignmentResponse {
  id: number;
  courseId: string;
  courseCode: string;
  courseName: string;
  teacherId: string;
  teacherEmail: string;
  teacherName: string;
  semesterId: number;
  semesterYear: number;
  semesterCode: string;
  assignmentDate: string;           // YYYY-MM-DD
  syllabusFile?: StoredFileSummary; // presente si ya se subió un sílabo
  createdAt: string;
  updatedAt: string;
}

// ── Tipos de petición ─────────────────────────────────────────────────────────

export interface AssignmentRequest {
  courseId: string;
  teacherId: string;
  semesterId: number;
  assignmentDate: string;      // YYYY-MM-DD
  syllabusFileId?: string;     // UUID — opcional
}

// ── Clave compuesta (identifica una asignación para GET / PUT / DELETE) ───────

export interface AssignmentKey {
  courseId: string;
  teacherId: string;
  semesterId: number;
}

function assignmentPath({ courseId, teacherId, semesterId }: AssignmentKey): string {
  return `/v1/assignments/courses/${courseId}/teachers/${teacherId}/semesters/${semesterId}`;
}

// ── Envelope genérico ─────────────────────────────────────────────────────────


// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /v1/assignments */
export async function listAssignments(token: string): Promise<AssignmentResponse[]> {
  const res = await apiFetch<ApiResponse<AssignmentResponse[]>>('/v1/assignments', token);
  return res.data;
}

/** GET /v1/assignments/courses/{courseId}/teachers/{teacherId}/semesters/{semesterId} */
export async function getAssignment(
  token: string,
  key: AssignmentKey
): Promise<AssignmentResponse> {
  const res = await apiFetch<ApiResponse<AssignmentResponse>>(assignmentPath(key), token);
  return res.data;
}

/** POST /v1/assignments */
export async function createAssignment(
  token: string,
  request: AssignmentRequest
): Promise<AssignmentResponse> {
  const res = await apiFetch<ApiResponse<AssignmentResponse>>('/v1/assignments', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** PUT /v1/assignments/courses/{courseId}/teachers/{teacherId}/semesters/{semesterId} */
export async function updateAssignment(
  token: string,
  key: AssignmentKey,
  request: AssignmentRequest
): Promise<AssignmentResponse> {
  const res = await apiFetch<ApiResponse<AssignmentResponse>>(assignmentPath(key), token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** DELETE /v1/assignments/courses/{courseId}/teachers/{teacherId}/semesters/{semesterId} */
export async function deleteAssignment(token: string, key: AssignmentKey): Promise<void> {
  await apiFetch<ApiResponse<void>>(assignmentPath(key), token, { method: 'DELETE' });
}

/** GET /v1/assignments/me — lista las asignaciones del docente autenticado */
export async function listMyAssignments(token: string): Promise<AssignmentResponse[]> {
  const res = await apiFetch<ApiResponse<AssignmentResponse[]>>('/v1/assignments/me', token);
  return res.data;
}

/** PUT /v1/assignments/courses/{courseId}/semesters/{semesterId}/syllabus */
export async function updateAssignmentSyllabus(
  token: string,
  courseId: string,
  semesterId: number,
  request: { syllabusFileId: string }
): Promise<AssignmentResponse> {
  const res = await apiFetch<ApiResponse<AssignmentResponse>>(
    `/v1/assignments/courses/${courseId}/semesters/${semesterId}/syllabus`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  );
  return res.data;
}
