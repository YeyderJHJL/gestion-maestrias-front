import { apiFetch } from './api';

export interface GradeResponse {
  id: string;
  enrollmentId: string;
  studentId: string;
  studentEmail: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  stateId: number;
  stateCode: string;
  stateName: string;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface GradeRequest {
  enrollmentId: string;
  value: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listGrades(token: string): Promise<GradeResponse[]> {
  const res = await apiFetch<ApiResponse<GradeResponse[]>>('/v1/grades', token);
  return res.data;
}

export async function createGrade(token: string, request: GradeRequest): Promise<GradeResponse> {
  const res = await apiFetch<ApiResponse<GradeResponse>>('/v1/grades', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateGrade(token: string, id: string, request: GradeRequest): Promise<GradeResponse> {
  const res = await apiFetch<ApiResponse<GradeResponse>>(`/v1/grades/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function deleteGrade(token: string, id: string): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/grades/${id}`, token, { method: 'DELETE' });
}
