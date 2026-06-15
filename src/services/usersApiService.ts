import { apiFetch } from './api';
import { UserRole } from '../types/auth';

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
}

export interface UserRequest {
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listUsers(token: string): Promise<User[]> {
  const res = await apiFetch<ApiResponse<User[]>>('/v1/users', token);
  return res.data;
}

export async function createUser(token: string, request: UserRequest): Promise<User> {
  const res = await apiFetch<ApiResponse<User>>('/v1/users', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateUser(token: string, id: string, request: UserRequest): Promise<User> {
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
