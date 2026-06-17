import { apiFetch } from './api';

export type StudentStatus = 'Regular' | 'Reactualizacion';

export interface Promotion {
  id: number;
  name: string;
  programName: string;
}

export interface StudentRequest {
  userId: string;
  promotionId: number;
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
  status: StudentStatus;
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

// stub — /v1/promotions eliminado en V4, pero usePromociones.ts importa esta función
export async function listPromotions(_token: string): Promise<Promotion[]> {
  return [];
}

export async function listStudents(token: string): Promise<StudentResponse[]> {
  const res = await apiFetch<ApiResponse<StudentResponse[]>>('/v1/students', token);
  return res.data;
}

export async function createStudent(token: string, request: StudentRequest): Promise<StudentResponse> {
  const res = await apiFetch<ApiResponse<StudentResponse>>('/v1/students', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}
