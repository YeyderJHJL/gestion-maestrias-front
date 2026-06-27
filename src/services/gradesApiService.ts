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
  stateId: number;
  value: number;
}

export interface ListGradesParams {
  enrollmentId?: string;
  courseId?: string;
  studentId?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listGrades(
  token: string,
  params?: ListGradesParams
): Promise<GradeResponse[]> {
  let path = '/v1/grades';
  if (params) {
    const searchParams = new URLSearchParams();
    if (params.enrollmentId) searchParams.set('enrollmentId', params.enrollmentId);
    if (params.courseId) searchParams.set('courseId', params.courseId);
    if (params.studentId) searchParams.set('studentId', params.studentId);
    const qs = searchParams.toString();
    if (qs) path += `?${qs}`;
  }
  const res = await apiFetch<ApiResponse<GradeResponse[]>>(path, token);
  return res.data;
}

export async function createGrade(
  token: string,
  request: GradeRequest
): Promise<GradeResponse> {
  const res = await apiFetch<ApiResponse<GradeResponse>>('/v1/grades', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateGrade(
  token: string,
  id: string,
  request: GradeRequest
): Promise<GradeResponse> {
  const res = await apiFetch<ApiResponse<GradeResponse>>(`/v1/grades/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}
