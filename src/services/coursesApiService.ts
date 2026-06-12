import { apiFetch } from './api';

export type CourseType = 'Regular' | 'Tesis' | 'Topicos';

export interface CourseResponse {
  id: string;
  programId: number;
  programName: string;
  promotionId: number;
  promotionName: string;
  code: string;
  name: string;
  type: CourseType;
  startDate: string;
  endDate: string;
  observations: string;
  syllabusUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseRequest {
  programId: number;
  promotionId: number;
  code: string;
  name: string;
  type: CourseType;
  startDate: string;
  endDate: string;
  observations: string;
  syllabusUrl: string;
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
  await apiFetch<ApiResponse<void>>(`/v1/courses/${id}`, token, {
    method: 'DELETE',
  });
}
