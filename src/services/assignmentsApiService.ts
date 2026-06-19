import { apiFetch } from './api';

// ── Tipos de respuesta ────────────────────────────────────────────────────────

export interface AssignmentResponse {
  id: number;           // integer (int64)
  courseId: string;     // UUID
  courseCode: string;
  courseName: string;
  teacherId: string;    // UUID
  teacherEmail: string;
  teacherName: string;
  semesterId: number;   // integer (int32)
  semesterYear: number;
  semesterCode: string;
  assignmentDate: string; // format: date (YYYY-MM-DD)
  createdAt: string;
  updatedAt: string;
}

// ── Tipos de petición ─────────────────────────────────────────────────────────

export interface AssignmentRequest {
  courseId: string;       // UUID
  teacherId: string;      // UUID
  semesterId: number;     // integer (int32)
  assignmentDate: string; // format: date (YYYY-MM-DD)
}

// ── Clave compuesta para UPDATE / DELETE ──────────────────────────────────────

interface AssignmentKey {
  courseId: string;
  teacherId: string;
  semesterId: number;
}

function assignmentPath({ courseId, teacherId, semesterId }: AssignmentKey): string {
  return `/v1/assignments/courses/${courseId}/teachers/${teacherId}/semesters/${semesterId}`;
}

// ── Envelope genérico ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /v1/assignments — lista todas las asignaciones */
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

/** POST /v1/assignments — crea una nueva asignación */
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
  await apiFetch<ApiResponse<void>>(assignmentPath(key), token, {
    method: 'DELETE',
  });
}
