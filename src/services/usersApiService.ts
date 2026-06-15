import { apiFetch } from './api';
import { UserRole } from '../types/auth';

const ROLE_NORMALIZE: Record<string, UserRole> = {
  ADMIN: 'ADMIN', Administrador: 'ADMIN',
  TEACHER: 'TEACHER', Docente: 'TEACHER',
  STUDENT: 'STUDENT', Estudiante: 'STUDENT',
  COORDINATOR: 'COORDINATOR', Coordinador: 'COORDINATOR',
};

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    type: string;
    category?: string;
    regime?: string;
    academicDegree?: string;
    specialty?: string;
    phone?: string;
    university?: string;
  };
  student?: {
    yearPromotion?: number;
    status?: string;
    cui?: string;
    paymentCode?: string;
    phone?: string;
  };
}

export interface UserRequest {
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
}

export interface UserCreateRequest extends UserRequest {
  teacher?: {
    type: string;
    category?: string;
    regime?: string;
    academicDegree?: string;
    specialty?: string;
    phone?: string;
    university?: string;
  };
  student?: {
    yearPromotion: number;
    cui: string;
    paymentCode: string;
    phone?: string;
  };
}

export interface UserUpdateRequest extends UserRequest {
  teacher?: {
    type: string;
    category?: string;
    regime?: string;
    academicDegree?: string;
    specialty?: string;
    phone?: string;
    university?: string;
  };
  student?: {
    yearPromotion?: number;
    cui?: string;
    paymentCode?: string;
    status?: string;
    phone?: string;
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listUsers(token: string): Promise<User[]> {
  const res = await apiFetch<ApiResponse<User[]>>('/v1/users', token);
  return res.data.map((u) => ({
    ...u,
    role: (ROLE_NORMALIZE[u.role as string] ?? u.role) as UserRole,
  }));
}

export async function createUser(token: string, request: UserCreateRequest): Promise<User> {
  const res = await apiFetch<ApiResponse<User>>('/v1/users', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateUser(token: string, id: string, request: UserUpdateRequest): Promise<User> {
  const res = await apiFetch<ApiResponse<User>>(`/v1/users/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function deleteUser(token: string, id: string): Promise<void> {
  await apiFetch<ApiResponse<void>>(`/v1/users/${id}`, token, {
    method: 'DELETE',
  });
}
