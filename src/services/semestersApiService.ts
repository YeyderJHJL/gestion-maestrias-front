import { apiFetch } from './api';

export interface SemesterRequest {
  year: number;
  code: string;
}

export interface SemesterResponse {
  id: number;
  year: number;
  code: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listSemesters(token: string): Promise<SemesterResponse[]> {
  const res = await apiFetch<ApiResponse<SemesterResponse[]>>('/v1/semesters', token);
  return res.data;
}

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

export async function deleteSemester(token: string, id: number): Promise<void> {
  await apiFetch<void>(`/v1/semesters/${id}`, token, {
    method: 'DELETE',
  });
}
