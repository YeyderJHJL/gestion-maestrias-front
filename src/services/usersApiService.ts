import { apiFetch } from './api';
import { StoredFileSummaryResponse } from './filesApiService';
import { UserRole } from '../types/auth';
import { AcademicDegree, TeacherCategory, TeacherType } from './teachersApiService';
import { StudentStatus } from './studentsApiService';

export interface StudentProfileRequest {
  yearPromotion: number;
  status?: StudentStatus;
  reactualizationFileId?: string;
  cui: string;
  paymentCode: string;
  phone?: string;
}

export interface TeacherProfileRequest {
  category?: TeacherCategory;
  regime?: string;
  academicDegree?: AcademicDegree;
  specialty?: string;
  type: TeacherType;
  phone?: string;
  university?: string;
}

export interface UserCreateRequest {
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active?: boolean;
  teacher?: TeacherProfileRequest;
  student?: StudentProfileRequest;
}

export interface UserRequest {
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
}

// Actualización parcial: todos los subcampos de teacher/student son opcionales,
// ya que en modo edición el usuario puede dejar campos sin tocar.
export interface UserUpdateRequest extends UserRequest {
  teacher?: Partial<TeacherProfileRequest>;
  student?: Partial<StudentProfileRequest>;
}

export interface StudentProfileResponse {
  id: string;
  yearPromotion: number;
  status?: StudentStatus;
  reactualizationFile?: StoredFileSummaryResponse | null;
  cui: string;
  paymentCode: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfileResponse {
  id: string;
  category?: TeacherCategory;
  regime?: string;
  academicDegree?: AcademicDegree;
  specialty?: string;
  type: TeacherType;
  phone?: string;
  university?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  student?: StudentProfileResponse | null;
  teacher?: TeacherProfileResponse | null;
}

/** @deprecated Use UserResponse instead */
export type User = UserResponse;

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  student?: StudentProfileResponse | null;
  teacher?: TeacherProfileResponse | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string | null;
}

export async function listUsers(token: string): Promise<UserResponse[]> {
  const res = await apiFetch<ApiResponse<UserResponse[]>>('/v1/users', token);
  return res.data;
}

export async function getUserById(token: string, id: string): Promise<UserResponse> {
  const res = await apiFetch<ApiResponse<UserResponse>>(`/v1/users/${id}`, token);
  return res.data;
}

export async function createUser(
  token: string,
  request: UserCreateRequest
): Promise<UserProfileResponse> {
  const res = await apiFetch<ApiResponse<UserProfileResponse>>('/v1/users', token, {
    method: 'POST',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function updateUser(
  token: string,
  id: string,
  request: UserUpdateRequest
): Promise<UserProfileResponse> {
  const res = await apiFetch<ApiResponse<UserProfileResponse>>(`/v1/users/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
  return res.data;
}

export async function getUserById(token: string, id: string): Promise<User> {
  const res = await apiFetch<ApiResponse<User>>(`/v1/users/${id}`, token);
  return {
    ...res.data,
    role: (ROLE_NORMALIZE[res.data.role as string] ?? res.data.role) as UserRole,
  };
}

export async function deleteUser(token: string, id: string): Promise<void> {
  await apiFetch<void>(`/v1/users/${id}`, token, {
    method: 'DELETE',
  });
}
