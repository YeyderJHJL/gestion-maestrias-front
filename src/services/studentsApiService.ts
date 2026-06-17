import { apiFetch } from './api';
import { StoredFileSummaryResponse } from './filesApiService';

export type StudentStatus = 'Regular' | 'Reactualizacion';

export interface StudentRequest {
  userId: string;
  yearPromotion: number;
  status?: StudentStatus;
  reactualizationFileId?: string;
  cui: string;
  paymentCode: string;
  phone?: string;
}

export interface StudentResponse {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  yearPromotion: number;
  status?: StudentStatus;
  reactualizationFile?: StoredFileSummaryResponse | null;
  cui: string;
  paymentCode: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listStudents(token: string): Promise<StudentResponse[]> {
  const res = await apiFetch<ApiResponse<StudentResponse[]>>('/v1/students', token);
  return res.data;
}

export async function getStudentById(token: string, id: string): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>(`/v1/students/${id}`, token);
  return res.data;
}

export async function createStudent(
  token: string,
  request: StudentRequest
): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>('/v1/students', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateStudent(
  token: string,
  id: string,
  request: StudentRequest
): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>(`/v1/students/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function deleteStudent(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/v1/students/${id}`, token, {
    method: 'DELETE',
  });
}
