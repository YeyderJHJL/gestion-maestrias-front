import { apiFetch } from './api';

export type StudentStatus = 'Regular' | 'Reactualizacion';

export interface StudentResponse {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  yearPromotion: number;
  status: StudentStatus;
  cui: string;
  paymentCode: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFilters {
  yearPromotion?: number;
  status?: StudentStatus;
  search?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

/** GET /v1/students — con filtros opcionales */
export async function listStudents(
  token: string,
  filters: StudentFilters = {}
): Promise<StudentResponse[]> {
  const params = new URLSearchParams();
  if (filters.yearPromotion) params.set('yearPromotion', String(filters.yearPromotion));
  if (filters.status)        params.set('status', filters.status);
  if (filters.search)        params.set('search', filters.search);
  const qs = params.toString() ? `?${params.toString()}` : '';
  const res = await apiFetch<ApiResponse<StudentResponse[]>>(`/v1/students${qs}`, token);
  return res.data;
}

/** GET /v1/students/{id} */
export async function getStudent(token: string, id: string): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>(`/v1/students/${id}`, token);
  return res.data;
}
