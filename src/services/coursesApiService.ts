import { apiFetch } from './api';

// ── Tipos de respuesta ────────────────────────────────────────────────────────

export interface StoredFileSummary {
  id: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  startDate: string;   // format: date (YYYY-MM-DD)
  endDate: string;     // format: date (YYYY-MM-DD)
  observations?: string;
  syllabusFile?: StoredFileSummary;
  createdAt: string;
  updatedAt: string;
}

// ── Tipos de petición ─────────────────────────────────────────────────────────

export interface CourseRequest {
  code: string;
  name: string;
  startDate: string;        // format: date (YYYY-MM-DD)
  endDate: string;          // format: date (YYYY-MM-DD)
  observations?: string;
  syllabusFileId?: string;  // UUID del archivo subido previamente
}

// ── Envelope genérico ─────────────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

// ── Endpoints ─────────────────────────────────────────────────────────────────

/** GET /v1/courses — lista todos los cursos */
export async function listCourses(token: string): Promise<CourseResponse[]> {
  const res = await apiFetch<ApiResponse<CourseResponse[]>>('/v1/courses', token);
  return res.data;
}

/** GET /v1/courses/{id} — obtiene un curso por ID */
export async function getCourse(token: string, id: string): Promise<CourseResponse> {
  const res = await apiFetch<ApiResponse<CourseResponse>>(`/v1/courses/${id}`, token);
  return res.data;
}

/** POST /v1/courses — crea un nuevo curso */
export async function createCourse(
  token: string,
  request: CourseRequest
): Promise<CourseResponse> {
  const res = await apiFetch<ApiResponse<CourseResponse>>('/v1/courses', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** PUT /v1/courses/{id} — actualiza un curso existente */
export async function updateCourse(
  token: string,
  id: string,
  request: CourseRequest
): Promise<CourseResponse> {
  const res = await apiFetch<ApiResponse<CourseResponse>>(`/v1/courses/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

/** DELETE /v1/courses/{id} — elimina un curso */
export async function deleteCourse(token: string, id: string): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/courses/${id}`, token, {
    method: 'DELETE',
  });
}

/** GET /v1/courses/{id}/teachers — docentes asignados al curso */
export async function getCourseTeachers(token: string, courseId: string): Promise<unknown[]> {
  const res = await apiFetch<ApiResponse<unknown[]>>(
    `/v1/courses/${courseId}/teachers`,
    token
  );
  return res.data;
}

/** GET /v1/courses/{id}/students — estudiantes matriculados en el curso */
export async function getCourseStudents(token: string, courseId: string): Promise<unknown[]> {
  const res = await apiFetch<ApiResponse<unknown[]>>(
    `/v1/courses/${courseId}/students`,
    token
  );
  return res.data;
}

/** GET /v1/courses/by-teacher/{teacherId} — cursos de un docente específico */
export async function getCoursesByTeacher(
  token: string,
  teacherId: string
): Promise<CourseResponse[]> {
  const res = await apiFetch<ApiResponse<CourseResponse[]>>(
    `/v1/courses/by-teacher/${teacherId}`,
    token
  );
  return res.data;
}
