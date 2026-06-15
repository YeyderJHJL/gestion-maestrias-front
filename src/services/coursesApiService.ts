import { apiFetch } from './api';
import { StoredFileSummaryResponse } from './filesApiService';

export interface CourseRequest {
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  observations?: string;
  syllabusFileId?: string;
}

export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  observations?: string;
  syllabusFile: StoredFileSummaryResponse | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listCourses(token: string): Promise<CourseResponse[]> {
  const res = await apiFetch<ApiResponse<CourseResponse[]>>('/v1/courses', token);
  return res.data;
}

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

export async function deleteCourse(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/v1/courses/${id}`, token, {
    method: 'DELETE',
  });
}
